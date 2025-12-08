"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const anthropic_1 = require("@langchain/anthropic");
const prompts_1 = require("@langchain/core/prompts");
const messages_1 = require("@langchain/core/messages");
const output_parsers_1 = require("@langchain/core/output_parsers");
const common_1 = require("@nestjs/common");
const credit_service_1 = require("../credit/credit.service");
const db_1 = require("@altairgraphql/db");
const nestjs_prisma_1 = require("nestjs-prisma");
const openai_1 = require("@langchain/openai");
const testing_1 = require("@langchain/core/utils/testing");
const constants_1 = require("altair-graphql-core/build/cjs/ai/constants");
const config_1 = require("@nestjs/config");
const dedent_1 = require("dedent");
const newrelic_1 = require("../newrelic/newrelic");
const google_genai_1 = require("@langchain/google-genai");
const ollama_1 = require("@langchain/ollama");
const prompt_1 = require("./prompt");
let AiService = class AiService {
    constructor(creditService, prisma, configService) {
        this.creditService = creditService;
        this.prisma = prisma;
        this.configService = configService;
        this.agent = (0, newrelic_1.getAgent)();
    }
    async createNewActiveSession(userId) {
        var _a;
        const res = await this.prisma.aiChatSession.updateMany({
            where: {
                userId,
            },
            data: {
                isActive: false,
            },
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.incrementMetric('ai.session.create');
        return this.prisma.aiChatSession.create({
            data: {
                userId,
                isActive: true,
                title: `Session ${res.count + 1} (${new Date().toISOString()})`,
            },
        });
    }
    async getActiveSession(userId) {
        return this.prisma.aiChatSession.findFirst({
            where: {
                userId,
                isActive: true,
            },
        });
    }
    async getSession(userId, sessionId) {
        return this.prisma.aiChatSession.findUnique({
            where: {
                userId,
                id: sessionId,
            },
        });
    }
    async getSessions(userId) {
        var _a;
        const res = await this.prisma.aiChatSession.findMany({
            where: {
                userId,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('ai.session.count', res.length);
        return res;
    }
    async getSessionMessages(userId, sessionId, limit = Infinity) {
        var _a;
        const res = await this.prisma.aiChatMessage.findMany(Object.assign({ where: {
                sessionId,
                AiChatSession: {
                    userId,
                },
            }, orderBy: {
                createdAt: 'asc',
            } }, (limit < Infinity
            ? {
                take: limit,
            }
            : {})));
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('ai.session.message.count', res.length);
        return res;
    }
    async getOrCreateActiveSession(userId) {
        const session = await this.getActiveSession(userId);
        if (session) {
            return session;
        }
        return this.createNewActiveSession(userId);
    }
    async rateMessage({ userId, sessionId, messageId, rating, }) {
        var _a, _b;
        rating > 0
            ? (_a = this.agent) === null || _a === void 0 ? void 0 : _a.incrementMetric('ai.message.rate.good')
            : (_b = this.agent) === null || _b === void 0 ? void 0 : _b.incrementMetric('ai.message.rate.bad');
        return this.prisma.aiChatMessage.update({
            where: {
                id: messageId,
                sessionId,
                role: db_1.AiChatRole.ASSISTANT,
                AiChatSession: {
                    userId,
                },
            },
            data: {
                rating: rating > 0 ? db_1.AiChatRating.GOOD : db_1.AiChatRating.BAD,
            },
        });
    }
    async sendMessage(userId, sessionId, messageInput) {
        var _a, _b, _c;
        if (!messageInput.message) {
            throw new common_1.BadRequestException('Message is required');
        }
        if (messageInput.message.length > constants_1.maxMessageChars) {
            throw new common_1.BadRequestException('Message is too long');
        }
        if (messageInput.sdl && messageInput.sdl.length > constants_1.maxSdlChars) {
            throw new common_1.BadRequestException('SDL is too long');
        }
        if (messageInput.graphqlQuery &&
            messageInput.graphqlQuery.length > constants_1.maxGraphqlQueryChars) {
            throw new common_1.BadRequestException('GraphQL query is too long');
        }
        if (messageInput.graphqlVariables &&
            messageInput.graphqlVariables.length > constants_1.maxGraphqlVariablesChars) {
            throw new common_1.BadRequestException('GraphQL variables is too large');
        }
        const session = await this.getSession(userId, sessionId);
        if (!session) {
            throw new common_1.BadRequestException('Session not found');
        }
        const messages = await this.prisma.aiChatMessage.findMany({
            where: {
                sessionId,
            },
        });
        const creditUse = await this.creditService.useCredits(userId, 1);
        const response = await this.sendToAI(messageInput, messages);
        await this.prisma.aiChatMessage.create({
            data: {
                sessionId,
                message: messageInput.message,
                role: db_1.AiChatRole.USER,
                sdl: messageInput.sdl,
                graphqlQuery: messageInput.graphqlQuery,
                graphqlVariables: messageInput.graphqlVariables,
                transactionId: creditUse.transactionId,
            },
        });
        await this.prisma.aiChatMessage.create({
            data: {
                sessionId,
                message: response.content,
                role: db_1.AiChatRole.ASSISTANT,
                inputTokens: (_a = response.usage_metadata) === null || _a === void 0 ? void 0 : _a.input_tokens,
                outputTokens: (_b = response.usage_metadata) === null || _b === void 0 ? void 0 : _b.output_tokens,
            },
        });
        await this.prisma.aiChatSession.update({
            where: {
                id: sessionId,
            },
            data: {
                updatedAt: new Date(),
            },
        });
        (_c = this.agent) === null || _c === void 0 ? void 0 : _c.incrementMetric('ai.session.message.send');
        return {
            response: response.content,
        };
    }
    async sendToAI(messageInput, previousMessages) {
        var _a, _b, _c, _d, _e, _f, _g;
        const model = this.getChatModel();
        const systemMessageParts = [
            (0, dedent_1.default) `You are an expert in GraphQL and Altair GraphQL Client (https://altairgraphql.dev). Your task is to answer user questions related to these topics professionally and concisely. Follow these instructions carefully:`,
            (0, dedent_1.default) `1. First, review the provided SDL (Schema Definition Language):
        <sdl>
        ${(_a = messageInput.sdl) !== null && _a !== void 0 ? _a : ''}
        </sdl>`,
            (0, dedent_1.default) `2. Next, examine the GraphQL query:
        <graphql_query>
        ${(_b = messageInput.graphqlQuery) !== null && _b !== void 0 ? _b : ''}
        </graphql_query>`,
            (0, dedent_1.default) `3. Then, look at the GraphQL variables (in JSON format):
        <graphql_variables>
        ${(_c = messageInput.graphqlVariables) !== null && _c !== void 0 ? _c : ''}
        </graphql_variables>`,
            (0, dedent_1.default) `4. When answering the user's question, follow these guidelines:
        - Only answer questions related to GraphQL and Altair GraphQL Client.
        - Focus solely on the topic the user is asking about.
        - Provide enough information to guide the user in the right direction, but not necessarily a complete solution.
        - Be respectful and professional in your responses.
        - Keep your responses concise and clear, using no more than 3-4 sentences.
        - Provide a maximum of 2 code snippets in your response, if necessary.
        - Write your responses in markdown format.
        - Always wrap GraphQL queries in \`\`\`graphql\`\`\` code blocks.
        - If a sdl schema is provided, only generate GraphQL queries that are valid for the provided schema.`,
            (0, dedent_1.default) `5. If you're unsure about something or need clarification, ask the user for more information.`,
            (0, dedent_1.default) `6. If you're unable to answer a question, respond with: "I'm not sure about that, but I can try to help you with something else."`,
            (0, dedent_1.default) `Now, please answer the following user question:`,
        ];
        const promptTemplate = prompts_1.ChatPromptTemplate.fromMessages([
            new messages_1.SystemMessage({
                content: [
                    {
                        text: (0, prompt_1.getPrompt)((_d = messageInput.sdl) !== null && _d !== void 0 ? _d : '', (_e = messageInput.graphqlQuery) !== null && _e !== void 0 ? _e : '', (_f = messageInput.graphqlVariables) !== null && _f !== void 0 ? _f : '', (_g = messageInput.graphqlResponse) !== null && _g !== void 0 ? _g : ''),
                        type: 'text',
                        cache_control: { type: 'ephemeral' },
                    },
                ],
            }),
            ...previousMessages.map((m) => {
                if (m.role === db_1.AiChatRole.USER) {
                    return new messages_1.HumanMessage(m.message);
                }
                return new messages_1.AIMessage(m.message);
            }),
            new messages_1.HumanMessage(`${messageInput.message}`),
        ]);
        const chain = promptTemplate.pipe(model);
        const response = await chain.invoke({});
        const parser = new output_parsers_1.StringOutputParser();
        const out = await parser.invoke(response);
        return {
            content: out,
            usage_metadata: 'usage_metadata' in response
                ? response.usage_metadata
                : undefined,
        };
    }
    getChatModel() {
        var _a;
        const modelProvider = this.configService.get('ai.modelProvider', {
            infer: true,
        });
        switch (modelProvider) {
            case 'openai': {
                return new openai_1.ChatOpenAI({
                    apiKey: this.configService.get('ai.openai.apiKey', { infer: true }),
                    model: this.configService.get('ai.openai.model', { infer: true }),
                    maxTokens: constants_1.responseMaxTokens,
                });
            }
            case 'ollama': {
                return new ollama_1.ChatOllama({
                    baseUrl: this.configService.get('ai.ollama.baseUrl', { infer: true }),
                    model: this.configService.get('ai.ollama.model', { infer: true }),
                });
            }
            case 'fake': {
                return new testing_1.FakeListChatModel({
                    responses: [
                        'Certainly! Here is a GraphQL query to fetch all users along with their names and email addresses:\n\n```graphql\nquery {\n  users {\n    id\n    name\n    email\n  }\n}\n```\n\nMake sure your GraphQL server schema includes a `users` query that returns a list of user objects, each containing `id`, `name`, and `email` fields.',
                        'Sure! Here is a GraphQL query to fetch a list of products along with their prices and availability status:\n\n```graphql\nquery {\n  products {\n    id\n    name\n    price\n    availabilityStatus\n  }\n}```\n\nMake sure your GraphQL server schema includes a `products` query that returns a list of product objects, each containing `id`, `name`, `price`, and `availabilityStatus` fields.',
                        'Certainly! Here is an example of how the `User` type might be defined in a GraphQL schema, along with an explanation of each field:\n\n```graphql\ntype User {\n  id: ID!\n  name: String!\n  email: String!\n  age: Int\n  createdAt: String!\n}\n```\n\n### Explanation\n\n- **`id: ID!`**\n  - **Type:** `ID`\n  - **Non-nullable:** Yes\n  - **Description:** A unique identifier for the user.\n\n- **`name: String!`**\n  - **Type:** `String`\n  - **Non-nullable:** Yes\n  - **Description:** The name of the user.\n\n- **`email: String!`**\n  - **Type:** `String`\n  - **Non-nullable:** Yes\n  - **Description:** The email address of the user.\n\n- **`age: Int`**\n  - **Type:** `Int`\n  - **Non-nullable:** No\n  - **Description:** The age of the user (optional field).\n\n- **`createdAt: String!`**\n  - **Type:** `String`\n  - **Non-nullable:** Yes\n  - **Description:** The timestamp of when the user was created, typically in ISO 8601 format.\n\nThis `User` type defines the structure of user objects in the GraphQL schema, specifying the fields available and their data types. The `!` after a type indicates that the field is non-nullable, meaning it must have a value.',
                        'Sure! Here are the fields available in the `Product` type and their corresponding types:\n\n```graphql\ntype Product {\n  id: ID!\n  name: String!\n  price: Float!\n  availabilityStatus: String!\n}\n```\n\n### Fields\n\n- **`id: ID!`**\n  - **Type:** `ID`\n  - **Non-nullable:** Yes\n  - **Description:** A unique identifier for the product.\n\n- **`name: String!`**\n  - **Type:** `String`\n  - **Non-nullable:** Yes\n  - **Description:** The name of the product.\n\n- **`price: Float!`**\n  - **Type:** `Float`\n  - **Non-nullable:** Yes\n  - **Description:** The price of the product.\n\n- **`availabilityStatus: String!`**\n  - **Type:** `String`\n  - **Non-nullable:** Yes\n  - **Description:** The availability status of the product (e.g., "In Stock", "Out of Stock").\n\nThese fields define the structure of product objects in the GraphQL schema, specifying the information available for each product.',
                        'Certainly! Here is a GraphQL query to fetch a list of posts along with their titles and authors:\n\n```graphql\nquery {\n  posts {\n    id\n    title\n    author {\n      id\n      name\n    }\n  }\n}```\n\nMake sure your GraphQL server schema includes a `posts` query that returns a list of post objects, each containing `id`, `title`, and `author` fields.',
                    ],
                });
            }
            case 'google': {
                const cfGatewayAccountId = this.configService.get('ai.aiGateway.accountId', {
                    infer: true,
                });
                const cfGatewayName = this.configService.get('ai.aiGateway.name', {
                    infer: true,
                });
                const baseUrl = cfGatewayAccountId && cfGatewayName
                    ? `https://gateway.ai.cloudflare.com/v1/${cfGatewayAccountId}/${cfGatewayName}/google-ai-studio`
                    : undefined;
                return new google_genai_1.ChatGoogleGenerativeAI({
                    apiKey: this.configService.get('ai.google.apiKey', { infer: true }),
                    model: (_a = this.configService.get('ai.google.model', { infer: true })) !== null && _a !== void 0 ? _a : 'gemini-2.5-flash',
                    maxOutputTokens: constants_1.responseMaxTokens,
                    baseUrl,
                });
            }
            case 'anthropic':
            default: {
                return new anthropic_1.ChatAnthropic({
                    apiKey: this.configService.get('ai.anthropic.apiKey', { infer: true }),
                    model: this.configService.get('ai.anthropic.model', { infer: true }),
                    maxTokens: constants_1.responseMaxTokens,
                    clientOptions: {
                        defaultHeaders: {
                            'anthropic-beta': 'prompt-caching-2024-07-31',
                        },
                    },
                });
            }
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [credit_service_1.CreditService,
        nestjs_prisma_1.PrismaService,
        config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map
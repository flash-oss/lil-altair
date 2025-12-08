"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    nest: {
        port: 3000,
    },
    cors: {
        enabled: true,
    },
    swagger: {
        enabled: true,
        title: 'Altair API',
        description: 'The Altair API description',
        version: '1.0',
        path: 'swagger',
    },
    security: {
        shortExpiresIn: '30s',
        expiresIn: '2d',
        refreshIn: '7d',
        bcryptSaltOrRound: 10,
    },
    ai: {
        modelProvider: process.env.AI_MODEL_PROVIDER,
        aiGateway: {
            accountId: process.env.CF_AI_GATEWAY_ACCOUNT_ID,
            name: process.env.CF_AI_GATEWAY_NAME,
        },
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            model: (_a = process.env.OPENAI_MODEL_NAME) !== null && _a !== void 0 ? _a : 'gpt-3.5-turbo-0125',
        },
        ollama: {
            baseUrl: process.env.OLLAMA_BASE_URL,
            model: (_b = process.env.OLLAMA_MODEL_NAME) !== null && _b !== void 0 ? _b : 'llama3',
        },
        anthropic: {
            apiKey: process.env.ANTHROPIC_API_KEY,
            model: (_c = process.env.ANTHROPIC_MODEL_NAME) !== null && _c !== void 0 ? _c : 'claude-3-haiku-20240307',
        },
        google: {
            apiKey: process.env.GOOGLE_GEN_API_KEY,
            model: (_d = process.env.GOOGLE_GEN_MODEL_NAME) !== null && _d !== void 0 ? _d : 'gemini-2.5-flash-preview-04-17',
        },
    },
    email: {
        resendApiKey: process.env.RESEND_API_KEY,
        audienceId: process.env.RESEND_AUDIENCE_ID,
        defaultFrom: 'Altair GraphQL <mail@mail.altairgraphql.dev>',
        replyTo: 'info@altairgraphql.dev',
    },
};
exports.default = () => config;
//# sourceMappingURL=config.js.map
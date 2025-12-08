export type AiModelProvider = 'anthropic' | 'openai' | 'google' | 'ollama' | 'fake';
declare const config: {
    nest: {
        port: number;
    };
    cors: {
        enabled: boolean;
    };
    swagger: {
        enabled: boolean;
        title: string;
        description: string;
        version: string;
        path: string;
    };
    security: {
        shortExpiresIn: string;
        expiresIn: string;
        refreshIn: string;
        bcryptSaltOrRound: number;
    };
    ai: {
        modelProvider: AiModelProvider | undefined;
        aiGateway: {
            accountId: string | undefined;
            name: string | undefined;
        };
        openai: {
            apiKey: string | undefined;
            model: string;
        };
        ollama: {
            baseUrl: string | undefined;
            model: string;
        };
        anthropic: {
            apiKey: string | undefined;
            model: string;
        };
        google: {
            apiKey: string | undefined;
            model: string;
        };
    };
    email: {
        resendApiKey: string | undefined;
        audienceId: string | undefined;
        defaultFrom: string;
        replyTo: string;
    };
};
export type Config = typeof config;
export type NestConfig = Config['nest'];
export type SwaggerConfig = Config['swagger'];
export type SecurityConfig = Config['security'];
export type CorsConfig = Config['cors'];
declare const _default: () => {
    nest: {
        port: number;
    };
    cors: {
        enabled: boolean;
    };
    swagger: {
        enabled: boolean;
        title: string;
        description: string;
        version: string;
        path: string;
    };
    security: {
        shortExpiresIn: string;
        expiresIn: string;
        refreshIn: string;
        bcryptSaltOrRound: number;
    };
    ai: {
        modelProvider: AiModelProvider | undefined;
        aiGateway: {
            accountId: string | undefined;
            name: string | undefined;
        };
        openai: {
            apiKey: string | undefined;
            model: string;
        };
        ollama: {
            baseUrl: string | undefined;
            model: string;
        };
        anthropic: {
            apiKey: string | undefined;
            model: string;
        };
        google: {
            apiKey: string | undefined;
            model: string;
        };
    };
    email: {
        resendApiKey: string | undefined;
        audienceId: string | undefined;
        defaultFrom: string;
        replyTo: string;
    };
};
export default _default;
//# sourceMappingURL=config.d.ts.map
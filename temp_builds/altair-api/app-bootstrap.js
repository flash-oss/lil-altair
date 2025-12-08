"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapApp = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const nestjs_prisma_1 = require("nestjs-prisma");
const nest_winston_1 = require("nest-winston");
const logging_interceptor_1 = require("./logging/logging.interceptor");
const bootstrapApp = async (app) => {
    if (process.env.NODE_ENV === 'production') {
        app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    }
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const prismaService = app.get(nestjs_prisma_1.PrismaService);
    await prismaService.enableShutdownHooks(app);
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new nestjs_prisma_1.PrismaClientExceptionFilter(httpAdapter));
    const configService = app.get(config_1.ConfigService);
    const corsConfig = configService.get('cors');
    const swaggerConfig = configService.get('swagger');
    if (swaggerConfig === null || swaggerConfig === void 0 ? void 0 : swaggerConfig.enabled) {
        const options = new swagger_1.DocumentBuilder()
            .setTitle(swaggerConfig.title || 'Altair')
            .setDescription(swaggerConfig.description || 'The Altair API description')
            .setVersion(swaggerConfig.version || '1.0')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup(swaggerConfig.path || 'swagger', app, document);
    }
    if (corsConfig === null || corsConfig === void 0 ? void 0 : corsConfig.enabled) {
        app.enableCors({ origin: true });
    }
    return app;
};
exports.bootstrapApp = bootstrapApp;
//# sourceMappingURL=app-bootstrap.js.map
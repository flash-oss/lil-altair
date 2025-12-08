"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NEW_RELIC_APP_NAME && process.env.NODE_ENV === 'production') {
    require('newrelic');
}
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_bootstrap_1 = require("./app-bootstrap");
const app_module_1 = require("./app.module");
async function bootstrap() {
    var _a, _b;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        rawBody: true,
    });
    await (0, app_bootstrap_1.bootstrapApp)(app);
    const configService = app.get(config_1.ConfigService);
    const nestConfig = configService.get('nest');
    const port = (_b = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : nestConfig === null || nestConfig === void 0 ? void 0 : nestConfig.port) !== null && _b !== void 0 ? _b : 3000;
    console.log('Listening on port', port);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    app_name: [process.env.NEW_RELIC_APP_NAME],
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    distributed_tracing: {
        enabled: true,
    },
    logging: {
        level: 'trace',
    },
    application_logging: {
        forwarding: {
            enabled: true,
        },
    },
    error_collector: {
        expected_status_codes: [401, 403],
    },
    allow_all_headers: true,
    attributes: {
        exclude: [
            'request.headers.cookie',
            'request.headers.authorization',
            'request.headers.proxyAuthorization',
            'request.headers.setCookie*',
            'request.headers.x*',
            'response.headers.cookie',
            'response.headers.authorization',
            'response.headers.proxyAuthorization',
            'response.headers.setCookie*',
            'response.headers.x*',
        ],
    },
};
//# sourceMappingURL=config.js.map
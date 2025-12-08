"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const tagsToString = (tags) => {
    return Object.entries(tags)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ');
};
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        var _a;
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const tags = {
            url: request.originalUrl.split('?').at(0),
            method: request.method,
            ip: request.ip,
            user: (_a = request.user) === null || _a === void 0 ? void 0 : _a.id,
        };
        const now = Date.now();
        return next.handle().pipe((0, rxjs_1.catchError)((error) => {
            tags.error = error.message;
            tags.duration = `${Date.now() - now}ms`;
            tags.status = error.status;
            tags.size = response.get('content-length');
            this.logger.error(`canonical ${tagsToString(tags)}`);
            throw error;
        }), (0, rxjs_1.tap)((x) => {
            tags.duration = `${Date.now() - now}ms`;
            tags.status = response.statusCode;
            tags.size = response.get('content-length');
            this.logger.log(`canonical ${tagsToString(tags)}`);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map
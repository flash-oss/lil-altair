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
exports.NewrelicInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const util_1 = require("util");
const newrelic_1 = require("./newrelic");
let NewrelicInterceptor = class NewrelicInterceptor {
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        const log = this.logger;
        const agent = (0, newrelic_1.getAgent)();
        if (!agent) {
            return next.handle();
        }
        this.logger.log(`Newrelic Interceptor before: ${(0, util_1.inspect)(context.getHandler().name)}`);
        return agent.startWebTransaction(context.getHandler().name, function () {
            const transaction = agent.getTransaction();
            return next.handle().pipe((0, rxjs_1.tap)(() => {
                log.log(`Newrelic Interceptor after: ${(0, util_1.inspect)(context.getHandler().name)}`);
                return transaction.end();
            }));
        });
    }
};
exports.NewrelicInterceptor = NewrelicInterceptor;
exports.NewrelicInterceptor = NewrelicInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], NewrelicInterceptor);
//# sourceMappingURL=newrelic.interceptor.js.map
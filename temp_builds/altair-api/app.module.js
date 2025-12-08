"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const nestjs_prisma_1 = require("nestjs-prisma");
const config_1 = require("@nestjs/config");
const password_service_1 = require("./auth/password/password.service");
const queries_module_1 = require("./queries/queries.module");
const query_collections_module_1 = require("./query-collections/query-collections.module");
const teams_module_1 = require("./teams/teams.module");
const config_2 = require("./common/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const team_memberships_module_1 = require("./team-memberships/team-memberships.module");
const stripe_module_1 = require("./stripe/stripe.module");
const stripe_webhook_controller_1 = require("./stripe-webhook/stripe-webhook.controller");
const workspaces_module_1 = require("./workspaces/workspaces.module");
const credit_module_1 = require("./credit/credit.module");
const schedule_1 = require("@nestjs/schedule");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const ai_module_1 = require("./ai/ai.module");
const email_service_1 = require("./email/email.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRoot({
                level: 'debug',
                transports: [
                    new winston_1.transports.Console({
                        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.ms(), nest_winston_1.utilities.format.nestLike('AltairGraphQLApi', {
                            colors: true,
                            prettyPrint: true,
                        })),
                    }),
                ],
            }),
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [config_2.default] }),
            nestjs_prisma_1.PrismaModule.forRoot({
                isGlobal: true,
                prismaServiceOptions: {
                    middlewares: [],
                },
            }),
            event_emitter_1.EventEmitterModule.forRoot({
                verboseMemoryLeak: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            queries_module_1.QueriesModule,
            query_collections_module_1.QueryCollectionsModule,
            teams_module_1.TeamsModule,
            team_memberships_module_1.TeamMembershipsModule,
            stripe_module_1.StripeModule,
            workspaces_module_1.WorkspacesModule,
            credit_module_1.CreditModule,
            ai_module_1.AiModule,
        ],
        controllers: [app_controller_1.AppController, stripe_webhook_controller_1.StripeWebhookController],
        providers: [app_service_1.AppService, password_service_1.PasswordService, email_service_1.EmailService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
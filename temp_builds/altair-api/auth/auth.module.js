"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const password_service_1 = require("./password/password.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const auth_controller_1 = require("./auth.controller");
const google_strategy_1 = require("./strategies/google.strategy");
const github_strategy_1 = require("./strategies/github.strategy");
const events_jwt_strategy_1 = require("./strategies/events-jwt.strategy");
const stripe_service_1 = require("../stripe/stripe.service");
const user_service_1 = require("./user/user.service");
const user_controller_1 = require("./user/user.controller");
const teams_service_1 = require("../teams/teams.service");
const queries_service_1 = require("../queries/queries.service");
const query_collections_service_1 = require("../query-collections/query-collections.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                useFactory: async (configService) => {
                    const securityConfig = configService.get('security');
                    return {
                        secret: configService.get('JWT_ACCESS_SECRET'),
                        signOptions: {
                            expiresIn: securityConfig === null || securityConfig === void 0 ? void 0 : securityConfig.expiresIn,
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            events_jwt_strategy_1.EventsJwtStrategy,
            google_strategy_1.GoogleStrategy,
            github_strategy_1.GitHubStrategy,
            password_service_1.PasswordService,
            stripe_service_1.StripeService,
            user_service_1.UserService,
            teams_service_1.TeamsService,
            queries_service_1.QueriesService,
            query_collections_service_1.QueryCollectionsService,
        ],
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController],
        exports: [user_service_1.UserService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map
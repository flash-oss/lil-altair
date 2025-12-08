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
exports.GitHubStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const db_1 = require("@altairgraphql/db");
const passport_github2_1 = require("passport-github2");
const auth_service_1 = require("../auth.service");
const user_service_1 = require("../user/user.service");
let GitHubStrategy = class GitHubStrategy extends (0, passport_1.PassportStrategy)(passport_github2_1.Strategy, 'github') {
    constructor(userService, authService, configService) {
        super({
            clientID: configService.get('GITHUB_OAUTH_CLIENT_ID'),
            clientSecret: configService.get('GITHUB_OAUTH_CLIENT_SECRET'),
            callbackURL: '/auth/github/callback',
            scope: ['user:email'],
        });
        this.userService = userService;
        this.authService = authService;
        this.configService = configService;
    }
    authenticate(req, options) {
        if (req.query.state) {
            options.state = req.query.state;
        }
        super.authenticate(req, options);
    }
    async validate(accessToken, refreshToken, profile) {
        var _a, _b, _c, _d;
        try {
            const identity = await this.authService.getUserCredential(profile.id, db_1.IdentityProvider.GITHUB);
            if (!identity) {
                const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
                if (!email) {
                    throw new common_1.UnauthorizedException('GitHub OAuth did not return an email address');
                }
                return this.userService.createUser({
                    email,
                    firstName: profile.displayName || profile.username || 'GitHub User',
                    lastName: undefined,
                    picture: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                }, {
                    provider: db_1.IdentityProvider.GITHUB,
                    providerUserId: profile.id,
                });
            }
            const user = await this.authService.validateUser(identity.userId);
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            return user;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
};
exports.GitHubStrategy = GitHubStrategy;
exports.GitHubStrategy = GitHubStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService,
        config_1.ConfigService])
], GitHubStrategy);
//# sourceMappingURL=github.strategy.js.map
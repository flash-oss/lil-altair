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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const db_1 = require("@altairgraphql/db");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_service_1 = require("../auth.service");
const user_service_1 = require("../user/user.service");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(userService, authService, configService) {
        super({
            clientID: configService.get('GOOGLE_OAUTH_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
            callbackURL: '/auth/google/callback',
            scope: ['email', 'profile'],
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
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const identity = await this.authService.getUserCredential(profile.id, db_1.IdentityProvider.GOOGLE);
            if (!identity) {
                const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
                if (!email) {
                    throw new common_1.UnauthorizedException('Google OAuth did not return an email address');
                }
                return this.userService.createUser({
                    email,
                    firstName: (_d = (_c = profile === null || profile === void 0 ? void 0 : profile.name) === null || _c === void 0 ? void 0 : _c.givenName) !== null && _d !== void 0 ? _d : profile.displayName,
                    lastName: (_e = profile === null || profile === void 0 ? void 0 : profile.name) === null || _e === void 0 ? void 0 : _e.familyName,
                    picture: (_g = (_f = profile === null || profile === void 0 ? void 0 : profile.photos) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.value,
                }, {
                    provider: db_1.IdentityProvider.GOOGLE,
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
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService,
        config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map
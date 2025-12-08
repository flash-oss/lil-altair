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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const nestjs_prisma_1 = require("nestjs-prisma");
const password_service_1 = require("./password/password.service");
const newrelic_1 = require("../newrelic/newrelic");
const NEW_USER_TIME = 1000 * 60 * 10;
let AuthService = class AuthService {
    constructor(jwtService, prisma, passwordService, configService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.passwordService = passwordService;
        this.configService = configService;
        this.agent = (0, newrelic_1.getAgent)();
    }
    async passwordLogin(email, password) {
        var _a;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException(`No user found for email: ${email}`);
        }
        const passwordValid = await this.passwordService.validatePassword(password, (_a = user.password) !== null && _a !== void 0 ? _a : '');
        if (!passwordValid) {
            throw new common_1.BadRequestException('Invalid password');
        }
        return this.getLoginResponse(user);
    }
    googleLogin(user) {
        if (!user) {
            throw new common_1.BadRequestException('No user from google');
        }
        return this.getLoginResponse(user);
    }
    githubLogin(user) {
        if (!user) {
            throw new common_1.BadRequestException('No user from github');
        }
        return this.getLoginResponse(user);
    }
    getUserCredential(providerUserId, provider) {
        return this.prisma.userCredential.findFirst({
            where: {
                providerUserId,
                provider,
            },
        });
    }
    validateUser(userId) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }
    getUserFromToken(token) {
        const decoded = this.jwtService.decode(token);
        if (typeof decoded === 'string') {
            throw new Error('Invalid JWT token');
        }
        const id = decoded === null || decoded === void 0 ? void 0 : decoded['userId'];
        return this.prisma.user.findUnique({ where: { id } });
    }
    async changePassword(userId, userPassword, changePassword) {
        const passwordValid = await this.passwordService.validatePassword(changePassword.oldPassword, userPassword);
        if (!passwordValid) {
            throw new common_1.BadRequestException('Invalid password');
        }
        const hashedPassword = await this.passwordService.hashPassword(changePassword.newPassword);
        return this.prisma.user.update({
            data: {
                password: hashedPassword,
            },
            where: { id: userId },
        });
    }
    getLoginResponse(user) {
        var _a;
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.incrementMetric('auth.login.success');
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            isNewUser: Date.now() - user.createdAt.getTime() < NEW_USER_TIME,
            tokens: this.generateTokens({ userId: user.id }),
        };
    }
    generateTokens(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }
    getShortLivedEventsToken(userId) {
        var _a;
        const securityConfig = this.configService.get('security');
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.incrementMetric('auth.events_token.generate');
        return this.jwtService.sign({ userId }, {
            secret: this.configService.get('EVENTS_JWT_ACCESS_SECRET'),
            expiresIn: securityConfig === null || securityConfig === void 0 ? void 0 : securityConfig.shortExpiresIn,
        });
    }
    generateAccessToken(payload) {
        return this.jwtService.sign(payload);
    }
    generateRefreshToken(payload) {
        const securityConfig = this.configService.get('security');
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: securityConfig === null || securityConfig === void 0 ? void 0 : securityConfig.refreshIn,
        });
    }
    refreshToken(token) {
        try {
            const { userId } = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            return this.generateTokens({
                userId,
            });
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        nestjs_prisma_1.PrismaService,
        password_service_1.PasswordService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
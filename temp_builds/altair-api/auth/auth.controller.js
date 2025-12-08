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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const google_oauth_guard_1 = require("./guards/google-oauth.guard");
const github_oauth_guard_1 = require("./guards/github-oauth.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    googleSignin() {
    }
    googleSigninCallback(req, res) {
        const result = this.authService.googleLogin(req.user);
        if (req.query.state && typeof req.query.state === 'string') {
            try {
                const origin = new URL(req.query.state);
                origin.searchParams.set('access_token', result.tokens.accessToken);
                return res.redirect(origin.href);
            }
            catch (err) {
                throw new common_1.BadRequestException('Invalid state provided');
            }
        }
        return res.redirect('https://altairgraphql.dev');
    }
    githubSignin() {
    }
    githubSigninCallback(req, res) {
        const result = this.authService.githubLogin(req.user);
        if (req.query.state && typeof req.query.state === 'string') {
            try {
                const origin = new URL(req.query.state);
                origin.searchParams.set('access_token', result.tokens.accessToken);
                return res.redirect(origin.href);
            }
            catch (err) {
                throw new common_1.BadRequestException('Invalid state provided');
            }
        }
        return res.redirect('https://altairgraphql.dev');
    }
    getUserProfile(req) {
        return this.authService.googleLogin(req.user);
    }
    getShortlivedEventsToken(req) {
        var _a;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new common_1.BadRequestException('User not found');
        }
        return { slt: this.authService.getShortLivedEventsToken(userId) };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('google/login'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleSignin", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_oauth_guard_1.GoogleOAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleSigninCallback", null);
__decorate([
    (0, common_1.Get)('github/login'),
    (0, common_1.UseGuards)(github_oauth_guard_1.GitHubOAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "githubSignin", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    (0, common_1.UseGuards)(github_oauth_guard_1.GitHubOAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "githubSigninCallback", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Get)('slt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getShortlivedEventsToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
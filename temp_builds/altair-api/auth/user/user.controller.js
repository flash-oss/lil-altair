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
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const db_1 = require("@altairgraphql/db");
const common_1 = require("@nestjs/common");
const queries_service_1 = require("../../queries/queries.service");
const query_collections_service_1 = require("../../query-collections/query-collections.service");
const teams_service_1 = require("../../teams/teams.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService, queryService, collectionService, teamService) {
        this.userService = userService;
        this.queryService = queryService;
        this.collectionService = collectionService;
        this.teamService = teamService;
    }
    async getBillingUrl(req) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return {
            url: await this.userService.getBillingUrl(userId, req.headers.referer),
        };
    }
    async getCurrentPlan(req) {
        var _a, _b, _c, _d, _e, _f;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        const cfg = await this.userService.getPlanConfig(userId);
        return {
            id: (_c = cfg === null || cfg === void 0 ? void 0 : cfg.id) !== null && _c !== void 0 ? _c : '',
            maxQueriesCount: (_d = cfg === null || cfg === void 0 ? void 0 : cfg.maxQueryCount) !== null && _d !== void 0 ? _d : 0,
            maxTeamsCount: (_e = cfg === null || cfg === void 0 ? void 0 : cfg.maxTeamCount) !== null && _e !== void 0 ? _e : 0,
            maxTeamMembersCount: (_f = cfg === null || cfg === void 0 ? void 0 : cfg.maxTeamMemberCount) !== null && _f !== void 0 ? _f : 0,
            canUpgradePro: (cfg === null || cfg === void 0 ? void 0 : cfg.id) === db_1.BASIC_PLAN_ID,
        };
    }
    async getStats(req) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return {
            queries: {
                own: await this.queryService.count(userId, true),
                access: await this.queryService.count(userId, false),
            },
            collections: {
                own: await this.collectionService.count(userId, true),
                access: await this.collectionService.count(userId, false),
            },
            teams: {
                own: await this.teamService.count(userId, true),
                access: await this.teamService.count(userId, false),
            },
        };
    }
    async getProPlanUrl(req) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return {
            url: await this.userService.getProPlanUrl(userId),
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('billing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBillingUrl", null);
__decorate([
    (0, common_1.Get)('plan'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCurrentPlan", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('upgrade-pro'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProPlanUrl", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        queries_service_1.QueriesService,
        query_collections_service_1.QueryCollectionsService,
        teams_service_1.TeamsService])
], UserController);
//# sourceMappingURL=user.controller.js.map
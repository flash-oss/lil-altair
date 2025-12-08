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
exports.TeamMembershipsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const team_memberships_service_1 = require("./team-memberships.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_team_membership_dto_1 = require("./dto/create-team-membership.dto");
const update_team_membership_dto_1 = require("./dto/update-team-membership.dto");
const swagger_1 = require("@nestjs/swagger");
let TeamMembershipsController = class TeamMembershipsController {
    constructor(teamMembershipsService) {
        this.teamMembershipsService = teamMembershipsService;
    }
    create(req, createTeamMembershipDto) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.teamMembershipsService.create(userId, createTeamMembershipDto);
    }
    findAll(req, teamId) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.teamMembershipsService.findAll(userId, teamId);
    }
    findOne(req, id) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.teamMembershipsService.findOne(userId, id);
    }
    update(req, id, updateTeamMembershipDto) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.teamMembershipsService.update(userId, id, updateTeamMembershipDto);
    }
    remove(req, teamId, memberId) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.teamMembershipsService.remove(userId, teamId, memberId);
    }
};
exports.TeamMembershipsController = TeamMembershipsController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_team_membership_dto_1.CreateTeamMembershipDto]),
    __metadata("design:returntype", void 0)
], TeamMembershipsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('team/:id'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeamMembershipsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeamMembershipsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_team_membership_dto_1.UpdateTeamMembershipDto]),
    __metadata("design:returntype", void 0)
], TeamMembershipsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('team/:teamId/member/:memberId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('teamId')),
    __param(2, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TeamMembershipsController.prototype, "remove", null);
exports.TeamMembershipsController = TeamMembershipsController = __decorate([
    (0, common_1.Controller)('team-memberships'),
    (0, swagger_1.ApiTags)('Team Memberships'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [team_memberships_service_1.TeamMembershipsService])
], TeamMembershipsController);
//# sourceMappingURL=team-memberships.controller.js.map
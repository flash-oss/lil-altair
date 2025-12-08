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
exports.QueriesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const queries_service_1 = require("./queries.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_query_dto_1 = require("./dto/create-query.dto");
const update_query_dto_1 = require("./dto/update-query.dto");
const swagger_1 = require("@nestjs/swagger");
let QueriesController = class QueriesController {
    constructor(queriesService) {
        this.queriesService = queriesService;
    }
    create(req, createQueryDto) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.queriesService.create(userId, createQueryDto);
    }
    findAll(req) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.queriesService.findAll(userId);
    }
    findOne(req, id) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.queriesService.findOne(userId, id);
    }
    async update(req, id, updateQueryDto) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        const res = await this.queriesService.update(userId, id, updateQueryDto);
        if (!res.count) {
            throw new common_1.NotFoundException();
        }
        return res;
    }
    async remove(req, id) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        const res = await this.queriesService.remove(userId, id);
        if (!res.count) {
            throw new common_1.NotFoundException();
        }
        return res;
    }
    async getRevisions(req, id) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.queriesService.listRevisions(userId, id);
    }
    async restoreRevision(req, id, revisionId) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.queriesService.restoreRevision(userId, revisionId);
    }
};
exports.QueriesController = QueriesController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_query_dto_1.CreateQueryDto]),
    __metadata("design:returntype", void 0)
], QueriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QueriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], QueriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_query_dto_1.UpdateQueryDto]),
    __metadata("design:returntype", Promise)
], QueriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QueriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/revisions'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QueriesController.prototype, "getRevisions", null);
__decorate([
    (0, common_1.Post)(':id/revisions/:revisionId/restore'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('revisionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], QueriesController.prototype, "restoreRevision", null);
exports.QueriesController = QueriesController = __decorate([
    (0, common_1.Controller)('queries'),
    (0, swagger_1.ApiTags)('Queries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [queries_service_1.QueriesService])
], QueriesController);
//# sourceMappingURL=queries.controller.js.map
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
exports.QueryCollectionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const query_collections_service_1 = require("./query-collections.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_query_collection_dto_1 = require("./dto/create-query-collection.dto");
const update_query_collection_dto_1 = require("./dto/update-query-collection.dto");
const swagger_1 = require("@nestjs/swagger");
let QueryCollectionsController = class QueryCollectionsController {
    constructor(queryCollectionsService) {
        this.queryCollectionsService = queryCollectionsService;
    }
    create(req, createQueryCollectionDto) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.queryCollectionsService.create(userId, createQueryCollectionDto);
    }
    findAll(req) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.queryCollectionsService.findAll(userId);
    }
    async findOne(req, id) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        const collection = await this.queryCollectionsService.findOne(userId, id);
        if (!collection) {
            throw new common_1.NotFoundException();
        }
        return collection;
    }
    async update(req, id, updateQueryCollectionDto) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        const res = await this.queryCollectionsService.update(userId, id, updateQueryCollectionDto);
        if (!res.count) {
            throw new common_1.NotFoundException();
        }
        return res;
    }
    async remove(req, id) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        const res = await this.queryCollectionsService.remove(userId, id);
        if (!res.count) {
            throw new common_1.NotFoundException();
        }
        return res;
    }
};
exports.QueryCollectionsController = QueryCollectionsController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_query_collection_dto_1.CreateQueryCollectionDto]),
    __metadata("design:returntype", void 0)
], QueryCollectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QueryCollectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QueryCollectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_query_collection_dto_1.UpdateQueryCollectionDto]),
    __metadata("design:returntype", Promise)
], QueryCollectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QueryCollectionsController.prototype, "remove", null);
exports.QueryCollectionsController = QueryCollectionsController = __decorate([
    (0, common_1.Controller)('query-collections'),
    (0, swagger_1.ApiTags)('Query Collections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [query_collections_service_1.QueryCollectionsService])
], QueryCollectionsController);
//# sourceMappingURL=query-collections.controller.js.map
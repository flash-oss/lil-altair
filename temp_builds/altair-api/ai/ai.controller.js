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
exports.AiController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const send_message_dto_1 = require("./dto/send-message.dto");
const rate_message_dto_1 = require("./dto/rate-message.dto");
let AiController = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async getActiveSession(req) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.aiService.getActiveSession(userId);
    }
    async getAllSessions(req) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.aiService.getSessions(userId);
    }
    async createSession(req) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.aiService.createNewActiveSession(userId);
    }
    async getSessionMessages(req, sessionId) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.aiService.getSessionMessages(userId, sessionId);
    }
    async sendMessage(req, sessionId, sendMessageDto) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.aiService.sendMessage(userId, sessionId, sendMessageDto);
    }
    async rateMessage(req, sessionId, messageId, rateMessageDto) {
        var _a, _b;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        return this.aiService.rateMessage({
            userId,
            sessionId,
            messageId,
            rating: rateMessageDto.rating,
        });
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('sessions/active'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getActiveSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getAllSessions", null);
__decorate([
    (0, common_1.Post)('sessions'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('sessions/:id/messages'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getSessionMessages", null);
__decorate([
    (0, common_1.Post)('sessions/:id/messages'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/messages/:messageId/rate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Param)('messageId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, rate_message_dto_1.RateMessageDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "rateMessage", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, swagger_1.ApiTags)('AI'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map
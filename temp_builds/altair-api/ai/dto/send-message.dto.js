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
exports.SendMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const constants_1 = require("altair-graphql-core/build/cjs/ai/constants");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SendMessageDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String, maxLength: constants_1.maxMessageChars }, sdl: { required: false, type: () => String, maxLength: constants_1.maxSdlChars }, graphqlQuery: { required: false, type: () => String, maxLength: constants_1.maxGraphqlQueryChars }, graphqlVariables: { required: false, type: () => String, maxLength: constants_1.maxGraphqlVariablesChars }, graphqlResponse: { required: false, type: () => String, maxLength: constants_1.maxMessageChars } };
    }
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(constants_1.maxMessageChars),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(constants_1.maxSdlChars),
    __metadata("design:type", String)
], SendMessageDto.prototype, "sdl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(constants_1.maxGraphqlQueryChars),
    __metadata("design:type", String)
], SendMessageDto.prototype, "graphqlQuery", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(constants_1.maxGraphqlVariablesChars),
    __metadata("design:type", String)
], SendMessageDto.prototype, "graphqlVariables", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(constants_1.maxMessageChars),
    __metadata("design:type", String)
], SendMessageDto.prototype, "graphqlResponse", void 0);
//# sourceMappingURL=send-message.dto.js.map
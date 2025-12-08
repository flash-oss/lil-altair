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
exports.CreateQueryCollectionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_query_dto_1 = require("../../queries/dto/create-query.dto");
class CreateQueryCollectionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, queries: { required: false, type: () => [require("../../queries/dto/create-query.dto").CreateQuerySansCollectionIdDto] }, workspaceId: { required: false, type: () => String }, teamId: { required: false, type: () => String }, description: { required: false, type: () => String }, preRequestScript: { required: false, type: () => String }, preRequestScriptEnabled: { required: false, type: () => Boolean }, postRequestScript: { required: false, type: () => String }, postRequestScriptEnabled: { required: false, type: () => Boolean }, headers: { required: false }, environmentVariables: { required: false, type: () => Object } };
    }
}
exports.CreateQueryCollectionDto = CreateQueryCollectionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateQueryCollectionDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => create_query_dto_1.CreateQuerySansCollectionIdDto),
    __metadata("design:type", Array)
], CreateQueryCollectionDto.prototype, "queries", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateQueryCollectionDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateQueryCollectionDto.prototype, "teamId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateQueryCollectionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateQueryCollectionDto.prototype, "preRequestScript", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateQueryCollectionDto.prototype, "preRequestScriptEnabled", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateQueryCollectionDto.prototype, "postRequestScript", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateQueryCollectionDto.prototype, "postRequestScriptEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], CreateQueryCollectionDto.prototype, "headers", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], CreateQueryCollectionDto.prototype, "environmentVariables", void 0);
//# sourceMappingURL=create-query-collection.dto.js.map
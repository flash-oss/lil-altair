"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_query_dto_1 = require("./create-query.dto");
class UpdateQueryDto extends (0, swagger_1.PartialType)(create_query_dto_1.CreateQueryDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateQueryDto = UpdateQueryDto;
//# sourceMappingURL=update-query.dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQueryCollectionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_query_collection_dto_1 = require("./create-query-collection.dto");
class UpdateQueryCollectionDto extends (0, swagger_1.PartialType)(create_query_collection_dto_1.CreateQueryCollectionDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateQueryCollectionDto = UpdateQueryCollectionDto;
//# sourceMappingURL=update-query-collection.dto.js.map
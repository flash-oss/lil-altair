"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTeamMembershipDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_team_membership_dto_1 = require("./create-team-membership.dto");
class UpdateTeamMembershipDto extends (0, swagger_1.PartialType)(create_team_membership_dto_1.CreateTeamMembershipDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTeamMembershipDto = UpdateTeamMembershipDto;
//# sourceMappingURL=update-team-membership.dto.js.map
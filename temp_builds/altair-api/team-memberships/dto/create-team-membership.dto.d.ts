import { ICreateTeamMembershipDto } from '@altairgraphql/api-utils';
import { TeamMemberRole } from '@altairgraphql/db';
export declare class CreateTeamMembershipDto implements ICreateTeamMembershipDto {
    email: string;
    teamId: string;
    role?: TeamMemberRole;
}
//# sourceMappingURL=create-team-membership.dto.d.ts.map
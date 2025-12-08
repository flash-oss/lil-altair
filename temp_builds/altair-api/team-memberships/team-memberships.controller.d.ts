import { TeamMembershipsService } from './team-memberships.service';
import { Request } from 'express';
import { CreateTeamMembershipDto } from './dto/create-team-membership.dto';
import { UpdateTeamMembershipDto } from './dto/update-team-membership.dto';
export declare class TeamMembershipsController {
    private readonly teamMembershipsService;
    constructor(teamMembershipsService: TeamMembershipsService);
    create(req: Request, createTeamMembershipDto: CreateTeamMembershipDto): Promise<{
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: Request, teamId: string): Promise<({
        user: {
            firstName: string | null;
            lastName: string | null;
            email: string;
        };
    } & {
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(req: Request, id: string): void;
    update(req: Request, id: string, updateTeamMembershipDto: UpdateTeamMembershipDto): void;
    remove(req: Request, teamId: string, memberId: string): Promise<{
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=team-memberships.controller.d.ts.map
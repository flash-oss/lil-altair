import { PrismaService } from 'nestjs-prisma';
import { UserService } from 'src/auth/user/user.service';
import { CreateTeamMembershipDto } from './dto/create-team-membership.dto';
import { UpdateTeamMembershipDto } from './dto/update-team-membership.dto';
export declare class TeamMembershipsService {
    private prisma;
    private userService;
    private readonly agent;
    constructor(prisma: PrismaService, userService: UserService);
    create(userId: string, createTeamMembershipDto: CreateTeamMembershipDto): Promise<{
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllByTeamOwner(userId: string): Promise<{
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAll(userId: string, teamId: string): Promise<({
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
    findOne(userId: string, id: string): void;
    update(userId: string, id: string, updateTeamMembershipDto: UpdateTeamMembershipDto): void;
    remove(ownerId: string, teamId: string, memberId: string): Promise<{
        userId: string;
        teamId: string;
        role: import("@prisma/client").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSubscriptionQuantity(userId: string): Promise<void>;
}
//# sourceMappingURL=team-memberships.service.d.ts.map
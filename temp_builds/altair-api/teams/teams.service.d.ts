import { Prisma } from '@altairgraphql/db';
import { PrismaService } from 'nestjs-prisma';
import { UserService } from 'src/auth/user/user.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsService {
    private prisma;
    private userService;
    private readonly agent;
    constructor(prisma: PrismaService, userService: UserService);
    create(userId: string, createTeamDto: CreateTeamDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string): Promise<({
        Workspace: {
            name: string;
            id: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(userId: string, id: string): Prisma.Prisma__TeamClient<({
        Workspace: {
            name: string;
            id: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(userId: string, id: string, updateTeamDto: UpdateTeamDto): Prisma.PrismaPromise<Prisma.BatchPayload>;
    remove(userId: string, id: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
    count(userId: string, ownOnly?: boolean): Prisma.PrismaPromise<number>;
    ownerWhere(userId: string): Prisma.TeamWhereInput;
    ownerOrMemberWhere(userId: string): Prisma.TeamWhereInput;
}
//# sourceMappingURL=teams.service.d.ts.map
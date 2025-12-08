import { TeamsService } from './teams.service';
import { Request } from 'express';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    create(req: Request, createTeamDto: CreateTeamDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: Request): Promise<({
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
    findOne(req: Request, id: string): Promise<{
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
    }>;
    update(req: Request, id: string, updateTeamDto: UpdateTeamDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(req: Request, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
//# sourceMappingURL=teams.controller.d.ts.map
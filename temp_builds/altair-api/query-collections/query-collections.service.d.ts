import { PrismaService } from 'nestjs-prisma';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TeamsService } from 'src/teams/teams.service';
import { UserService } from 'src/auth/user/user.service';
import { CreateQueryCollectionDto } from './dto/create-query-collection.dto';
import { UpdateQueryCollectionDto } from './dto/update-query-collection.dto';
export declare class QueryCollectionsService {
    private readonly prisma;
    private readonly userService;
    private readonly teamsService;
    private readonly eventService;
    private readonly agent;
    constructor(prisma: PrismaService, userService: UserService, teamsService: TeamsService, eventService: EventEmitter2);
    create(userId: string, createQueryCollectionDto: CreateQueryCollectionDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        preRequestScript: string | null;
        preRequestScriptEnabled: boolean;
        postRequestScript: string | null;
        postRequestScriptEnabled: boolean;
        environmentVariables: import("@prisma/client").Prisma.JsonValue | null;
        headers: import("@prisma/client").Prisma.JsonValue | null;
        workspaceId: string;
        parentCollectionId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string): Promise<({
        queries: {
            id: string;
            queryVersion: number;
            name: string;
            collectionId: string;
            content: import("@prisma/client").Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        preRequestScript: string | null;
        preRequestScriptEnabled: boolean;
        postRequestScript: string | null;
        postRequestScriptEnabled: boolean;
        environmentVariables: import("@prisma/client").Prisma.JsonValue | null;
        headers: import("@prisma/client").Prisma.JsonValue | null;
        workspaceId: string;
        parentCollectionId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(userId: string, id: string): import("@prisma/client").Prisma.Prisma__QueryCollectionClient<({
        queries: {
            id: string;
            queryVersion: number;
            name: string;
            collectionId: string;
            content: import("@prisma/client").Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        preRequestScript: string | null;
        preRequestScriptEnabled: boolean;
        postRequestScript: string | null;
        postRequestScriptEnabled: boolean;
        environmentVariables: import("@prisma/client").Prisma.JsonValue | null;
        headers: import("@prisma/client").Prisma.JsonValue | null;
        workspaceId: string;
        parentCollectionId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(userId: string, id: string, updateQueryCollectionDto: UpdateQueryCollectionDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(userId: string, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    count(userId: string, ownOnly?: boolean): Promise<number>;
    private getWorkspaceOwnerId;
}
//# sourceMappingURL=query-collections.service.d.ts.map
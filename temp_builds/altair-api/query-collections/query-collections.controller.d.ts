import { QueryCollectionsService } from './query-collections.service';
import { Request } from 'express';
import { CreateQueryCollectionDto } from './dto/create-query-collection.dto';
import { UpdateQueryCollectionDto } from './dto/update-query-collection.dto';
export declare class QueryCollectionsController {
    private readonly queryCollectionsService;
    constructor(queryCollectionsService: QueryCollectionsService);
    create(req: Request, createQueryCollectionDto: CreateQueryCollectionDto): Promise<{
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
    findAll(req: Request): Promise<({
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
    findOne(req: Request, id: string): Promise<{
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
    }>;
    update(req: Request, id: string, updateQueryCollectionDto: UpdateQueryCollectionDto): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(req: Request, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
//# sourceMappingURL=query-collections.controller.d.ts.map
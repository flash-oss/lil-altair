import { QueriesService } from './queries.service';
import { Request } from 'express';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { QueryItem } from '@altairgraphql/db';
export declare class QueriesController {
    private readonly queriesService;
    constructor(queriesService: QueriesService);
    create(req: Request, createQueryDto: CreateQueryDto): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: Request): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(req: Request, id: string): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(req: Request, id: string, updateQueryDto: UpdateQueryDto): Promise<import("@altairgraphql/db").Prisma.BatchPayload>;
    remove(req: Request, id: string): Promise<import("@altairgraphql/db").Prisma.BatchPayload>;
    getRevisions(req: Request, id: string): Promise<({
        createdByUser: {
            firstName: string | null;
            lastName: string | null;
            email: string;
        };
    } & {
        id: string;
        queryItemId: string;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        createdById: string;
    })[]>;
    restoreRevision(req: Request, id: string, revisionId: string): Promise<QueryItem>;
}
//# sourceMappingURL=queries.controller.d.ts.map
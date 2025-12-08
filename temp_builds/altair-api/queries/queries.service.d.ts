import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'nestjs-prisma';
import { UserService } from 'src/auth/user/user.service';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
export declare class QueriesService {
    private readonly prisma;
    private readonly userService;
    private readonly eventService;
    private readonly agent;
    constructor(prisma: PrismaService, userService: UserService, eventService: EventEmitter2);
    create(userId: string, createQueryDto: CreateQueryDto): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createV2(userId: string, createQueryDto: CreateQueryDto): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(userId: string, id: string, updateQueryDto: UpdateQueryDto): Promise<import("@altairgraphql/db").Prisma.BatchPayload>;
    remove(userId: string, id: string): Promise<import("@altairgraphql/db").Prisma.BatchPayload>;
    count(userId: string, ownOnly?: boolean): Promise<number>;
    listRevisions(userId: string, queryId: string): Promise<({
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
    restoreRevision(userId: string, revisionId: string): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private getPlanConfig;
    private getCollectionOwnerId;
    private getPlanConfigByCollection;
    private addQueryRevision;
}
//# sourceMappingURL=queries.service.d.ts.map
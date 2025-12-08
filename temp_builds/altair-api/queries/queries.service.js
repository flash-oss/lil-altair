"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueriesService = void 0;
const db_1 = require("@altairgraphql/db");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const nestjs_prisma_1 = require("nestjs-prisma");
const user_service_1 = require("../auth/user/user.service");
const events_1 = require("../common/events");
const invalid_request_exception_1 = require("../exceptions/invalid-request.exception");
const where_clauses_1 = require("../common/where-clauses");
const newrelic_1 = require("../newrelic/newrelic");
const DEFAULT_QUERY_REVISION_LIMIT = 10;
let QueriesService = class QueriesService {
    constructor(prisma, userService, eventService) {
        this.prisma = prisma;
        this.userService = userService;
        this.eventService = eventService;
        this.agent = (0, newrelic_1.getAgent)();
    }
    async create(userId, createQueryDto) {
        var _a, _b, _c;
        if (!createQueryDto.collectionId ||
            !createQueryDto.name ||
            !createQueryDto.content ||
            !createQueryDto.content.query ||
            createQueryDto.content.version !== 1) {
            throw new common_1.BadRequestException();
        }
        if (((_a = (await this.getPlanConfigByCollection(createQueryDto.collectionId))) === null || _a === void 0 ? void 0 : _a.id) ===
            db_1.PRO_PLAN_ID) {
            return this.createV2(userId, createQueryDto);
        }
        const userPlanConfig = await this.getPlanConfig(userId);
        const userPlanMaxQueryCount = (_b = userPlanConfig === null || userPlanConfig === void 0 ? void 0 : userPlanConfig.maxQueryCount) !== null && _b !== void 0 ? _b : 0;
        const queryCount = await this.prisma.queryItem.count({
            where: Object.assign({}, (0, where_clauses_1.queryItemWhereOwner)(userId)),
        });
        if (queryCount >= userPlanMaxQueryCount) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_MAX_QUERY_COUNT');
        }
        const validCollection = await this.prisma.queryCollection.findMany({
            where: {
                id: createQueryDto.collectionId,
                workspace: {
                    ownerId: userId,
                },
            },
        });
        if (!validCollection.length) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_PERM_DENIED', 'You do not have the permission to add a query to this collection');
        }
        const res = await this.prisma.queryItem.create({
            data: {
                collectionId: createQueryDto.collectionId,
                name: createQueryDto.name,
                queryVersion: createQueryDto.content.version,
                content: createQueryDto.content,
            },
        });
        await this.addQueryRevision(userId, res.id);
        this.eventService.emit(events_1.EVENTS.QUERY_UPDATE, { id: res.id });
        (_c = this.agent) === null || _c === void 0 ? void 0 : _c.incrementMetric('query.create');
        return res;
    }
    async createV2(userId, createQueryDto) {
        var _a, _b;
        const ownerId = await this.getCollectionOwnerId(createQueryDto.collectionId);
        if (!ownerId) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_PERM_DENIED');
        }
        const userPlanConfig = await this.getPlanConfig(ownerId);
        const userPlanMaxQueryCount = (_a = userPlanConfig === null || userPlanConfig === void 0 ? void 0 : userPlanConfig.maxQueryCount) !== null && _a !== void 0 ? _a : 0;
        if (userPlanMaxQueryCount < Infinity) {
            const queryCount = await this.prisma.queryItem.count({
                where: Object.assign({}, (0, where_clauses_1.queryItemWhereOwner)(ownerId)),
            });
            if (queryCount >= userPlanMaxQueryCount) {
                throw new invalid_request_exception_1.InvalidRequestException('ERR_MAX_QUERY_COUNT');
            }
        }
        const validCollection = await this.prisma.queryCollection.findMany({
            where: Object.assign({ id: createQueryDto.collectionId }, (0, where_clauses_1.collectionWhereOwnerOrMember)(userId)),
        });
        if (!validCollection.length) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_PERM_DENIED', 'You do not have the permission to add a query to this collection');
        }
        const res = await this.prisma.queryItem.create({
            data: {
                collectionId: createQueryDto.collectionId,
                name: createQueryDto.name,
                queryVersion: createQueryDto.content.version,
                content: createQueryDto.content,
            },
        });
        await this.addQueryRevision(userId, res.id);
        this.eventService.emit(events_1.EVENTS.QUERY_UPDATE, { id: res.id });
        (_b = this.agent) === null || _b === void 0 ? void 0 : _b.incrementMetric('query.create');
        return res;
    }
    async findAll(userId) {
        var _a;
        const res = await this.prisma.queryItem.findMany({
            where: Object.assign({}, (0, where_clauses_1.queryItemWhereOwnerOrMember)(userId)),
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('query.list.count', res.length);
        return res;
    }
    async findOne(userId, id) {
        const query = await this.prisma.queryItem.findFirst({
            where: Object.assign({ id }, (0, where_clauses_1.queryItemWhereOwnerOrMember)(userId)),
        });
        if (!query) {
            throw new common_1.NotFoundException();
        }
        return query;
    }
    async update(userId, id, updateQueryDto) {
        const res = await this.prisma.queryItem.updateMany({
            where: Object.assign({ id }, (0, where_clauses_1.queryItemWhereOwnerOrMember)(userId)),
            data: {
                name: updateQueryDto.name,
                collectionId: updateQueryDto.collectionId,
                content: updateQueryDto.content,
            },
        });
        if (res.count) {
            this.eventService.emit(events_1.EVENTS.QUERY_UPDATE, { id });
        }
        await this.addQueryRevision(userId, id);
        return res;
    }
    async remove(userId, id) {
        const res = await this.prisma.queryItem.deleteMany({
            where: Object.assign({ id }, (0, where_clauses_1.queryItemWhereOwner)(userId)),
        });
        if (res.count) {
            this.eventService.emit(events_1.EVENTS.QUERY_UPDATE, { id });
        }
        return res;
    }
    async count(userId, ownOnly = true) {
        var _a;
        const cnt = await this.prisma.queryItem.count({
            where: Object.assign({}, (ownOnly
                ? (0, where_clauses_1.queryItemWhereOwner)(userId)
                : (0, where_clauses_1.queryItemWhereOwnerOrMember)(userId))),
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('query.list.count', cnt);
        return cnt;
    }
    async listRevisions(userId, queryId) {
        var _a;
        const res = await this.prisma.queryItemRevision.findMany({
            where: {
                queryItem: Object.assign({ id: queryId }, (0, where_clauses_1.queryItemWhereOwnerOrMember)(userId)),
            },
            include: {
                createdByUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('query.revision.list.count', res.length);
        return res;
    }
    async restoreRevision(userId, revisionId) {
        const revision = await this.prisma.queryItemRevision.findUnique({
            where: {
                id: revisionId,
            },
        });
        if (!revision) {
            throw new common_1.NotFoundException();
        }
        const query = await this.findOne(userId, revision.queryItemId);
        if (!query) {
            throw new common_1.NotFoundException();
        }
        const revisionContent = revision.content;
        if (!revisionContent) {
            throw new common_1.BadRequestException();
        }
        return this.prisma.queryItem.update({
            where: {
                id: revision.queryItemId,
            },
            data: {
                name: revision.name,
                content: revisionContent,
                collectionId: revision.collectionId,
            },
        });
    }
    async getPlanConfig(userId) {
        const userPlanConfig = await this.userService.getPlanConfig(userId);
        return userPlanConfig;
    }
    async getCollectionOwnerId(collectionId) {
        const res = await this.prisma.queryCollection.findFirst({
            where: {
                id: collectionId,
            },
            select: {
                workspace: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        });
        if (!res) {
            return;
        }
        return res.workspace.ownerId;
    }
    async getPlanConfigByCollection(collectionId) {
        const ownerId = await this.getCollectionOwnerId(collectionId);
        if (!ownerId) {
            return;
        }
        const userPlanConfig = await this.getPlanConfig(ownerId);
        return userPlanConfig;
    }
    async addQueryRevision(userId, queryId) {
        var _a, _b;
        const userPlanConfig = await this.getPlanConfig(userId);
        const userPlanQueryRevisionLimit = (_a = userPlanConfig === null || userPlanConfig === void 0 ? void 0 : userPlanConfig.queryRevisionLimit) !== null && _a !== void 0 ? _a : DEFAULT_QUERY_REVISION_LIMIT;
        const query = await this.findOne(userId, queryId);
        const queryContent = query.content;
        if (!queryContent) {
            throw new common_1.BadRequestException();
        }
        const res = await this.prisma.queryItemRevision.create({
            data: {
                queryItemId: queryId,
                createdById: userId,
                name: query.name,
                content: queryContent,
                collectionId: query.collectionId,
            },
        });
        const revisions = await this.prisma.queryItemRevision.count({
            where: {
                queryItemId: queryId,
            },
        });
        if (revisions > userPlanQueryRevisionLimit) {
            const oldestRevision = await this.prisma.queryItemRevision.findFirst({
                where: {
                    queryItemId: queryId,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
            if (!oldestRevision) {
                return res;
            }
            await this.prisma.queryItemRevision.delete({
                where: {
                    id: oldestRevision.id,
                },
            });
        }
        (_b = this.agent) === null || _b === void 0 ? void 0 : _b.incrementMetric('query.revision.create');
        return res;
    }
};
exports.QueriesService = QueriesService;
exports.QueriesService = QueriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        user_service_1.UserService,
        event_emitter_1.EventEmitter2])
], QueriesService);
//# sourceMappingURL=queries.service.js.map
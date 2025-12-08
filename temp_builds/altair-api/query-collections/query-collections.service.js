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
exports.QueryCollectionsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_1 = require("../common/events");
const teams_service_1 = require("../teams/teams.service");
const invalid_request_exception_1 = require("../exceptions/invalid-request.exception");
const user_service_1 = require("../auth/user/user.service");
const where_clauses_1 = require("../common/where-clauses");
const newrelic_1 = require("../newrelic/newrelic");
let QueryCollectionsService = class QueryCollectionsService {
    constructor(prisma, userService, teamsService, eventService) {
        this.prisma = prisma;
        this.userService = userService;
        this.teamsService = teamsService;
        this.eventService = eventService;
        this.agent = (0, newrelic_1.getAgent)();
    }
    async create(userId, createQueryCollectionDto) {
        var _a, _b;
        let workspaceId = createQueryCollectionDto.workspaceId;
        const teamId = createQueryCollectionDto.teamId;
        const userWorkspace = await this.prisma.workspace.findFirst({
            where: {
                ownerId: userId,
            },
        });
        if (!workspaceId) {
            workspaceId = userWorkspace === null || userWorkspace === void 0 ? void 0 : userWorkspace.id;
            if (teamId) {
                const validTeam = await this.teamsService.findOne(userId, teamId);
                if (!validTeam) {
                    throw new invalid_request_exception_1.InvalidRequestException('ERR_PERM_DENIED', 'You cannot create a collection for this teaam.');
                }
                const teamWorkspace = await this.prisma.workspace.findFirst({
                    where: {
                        teamId: validTeam.id,
                    },
                });
                workspaceId = teamWorkspace === null || teamWorkspace === void 0 ? void 0 : teamWorkspace.id;
            }
        }
        if (!workspaceId) {
            throw new common_1.BadRequestException('Workspace is not valid.');
        }
        const workspaceOwnerId = await this.getWorkspaceOwnerId(workspaceId);
        if (!workspaceOwnerId) {
            throw new common_1.BadRequestException('Workspace is not valid.');
        }
        const queryItems = await this.prisma.queryItem.findMany({
            where: Object.assign({}, (0, where_clauses_1.queryItemWhereOwner)(workspaceOwnerId)),
        });
        const workspaceOwnerPlanConfig = await this.userService.getPlanConfig(workspaceOwnerId);
        const workspaceOwnerPlanMaxQueryCount = (_a = workspaceOwnerPlanConfig === null || workspaceOwnerPlanConfig === void 0 ? void 0 : workspaceOwnerPlanConfig.maxQueryCount) !== null && _a !== void 0 ? _a : 0;
        const createQueryCollectionDtoQueries = createQueryCollectionDto.queries || [];
        if (queryItems.length + createQueryCollectionDtoQueries.length >
            workspaceOwnerPlanMaxQueryCount) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_MAX_QUERY_COUNT');
        }
        const res = await this.prisma.queryCollection.create({
            data: {
                name: createQueryCollectionDto.name,
                workspaceId,
                queries: {
                    create: createQueryCollectionDtoQueries,
                },
                description: createQueryCollectionDto.description,
                preRequestScript: createQueryCollectionDto.preRequestScript,
                preRequestScriptEnabled: createQueryCollectionDto.preRequestScriptEnabled,
                postRequestScript: createQueryCollectionDto.postRequestScript,
                postRequestScriptEnabled: createQueryCollectionDto.postRequestScriptEnabled,
                headers: createQueryCollectionDto.headers,
                environmentVariables: createQueryCollectionDto.environmentVariables,
            },
        });
        this.eventService.emit(events_1.EVENTS.COLLECTION_UPDATE, { id: res.id });
        (_b = this.agent) === null || _b === void 0 ? void 0 : _b.incrementMetric('query_collection.create');
        return res;
    }
    async findAll(userId) {
        var _a;
        const res = await this.prisma.queryCollection.findMany({
            where: Object.assign({}, (0, where_clauses_1.collectionWhereOwnerOrMember)(userId)),
            include: {
                queries: true,
            },
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('query_collection.list.count', res.length);
        return res;
    }
    findOne(userId, id) {
        return this.prisma.queryCollection.findFirst({
            where: Object.assign({ id }, (0, where_clauses_1.collectionWhereOwnerOrMember)(userId)),
            include: {
                queries: true,
            },
        });
    }
    async update(userId, id, updateQueryCollectionDto) {
        const res = await this.prisma.queryCollection.updateMany({
            where: Object.assign({ id }, (0, where_clauses_1.collectionWhereOwnerOrMember)(userId)),
            data: {
                name: updateQueryCollectionDto.name,
                description: updateQueryCollectionDto.description,
                preRequestScript: updateQueryCollectionDto.preRequestScript,
                preRequestScriptEnabled: updateQueryCollectionDto.preRequestScriptEnabled,
                postRequestScript: updateQueryCollectionDto.postRequestScript,
                postRequestScriptEnabled: updateQueryCollectionDto.postRequestScriptEnabled,
                headers: updateQueryCollectionDto.headers,
                environmentVariables: updateQueryCollectionDto.environmentVariables,
            },
        });
        if (res.count) {
            this.eventService.emit(events_1.EVENTS.COLLECTION_UPDATE, { id });
        }
        return res;
    }
    async remove(userId, id) {
        const res = await this.prisma.queryCollection.deleteMany({
            where: Object.assign({ id }, (0, where_clauses_1.collectionWhereOwner)(userId)),
        });
        if (res.count) {
            this.eventService.emit(events_1.EVENTS.COLLECTION_UPDATE, { id });
        }
        return res;
    }
    async count(userId, ownOnly = true) {
        var _a;
        const cnt = await this.prisma.queryCollection.count({
            where: Object.assign({}, (ownOnly
                ? (0, where_clauses_1.collectionWhereOwner)(userId)
                : (0, where_clauses_1.collectionWhereOwnerOrMember)(userId))),
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('query_collection.list.count', cnt);
        return cnt;
    }
    async getWorkspaceOwnerId(workspaceId) {
        const res = await this.prisma.workspace.findFirst({
            where: {
                id: workspaceId,
            },
            select: {
                ownerId: true,
            },
        });
        if (!res) {
            return;
        }
        return res.ownerId;
    }
};
exports.QueryCollectionsService = QueryCollectionsService;
exports.QueryCollectionsService = QueryCollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        user_service_1.UserService,
        teams_service_1.TeamsService,
        event_emitter_1.EventEmitter2])
], QueryCollectionsService);
//# sourceMappingURL=query-collections.service.js.map
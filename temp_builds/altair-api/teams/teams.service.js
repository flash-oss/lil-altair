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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const user_service_1 = require("../auth/user/user.service");
const invalid_request_exception_1 = require("../exceptions/invalid-request.exception");
const newrelic_1 = require("../newrelic/newrelic");
let TeamsService = class TeamsService {
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
        this.agent = (0, newrelic_1.getAgent)();
    }
    async create(userId, createTeamDto) {
        var _a, _b;
        const userPlanConfig = await this.userService.getPlanConfig(userId);
        const userPlanMaxTeamCount = (_a = userPlanConfig === null || userPlanConfig === void 0 ? void 0 : userPlanConfig.maxTeamCount) !== null && _a !== void 0 ? _a : 0;
        const teamCount = await this.prisma.team.count({
            where: {
                ownerId: userId,
            },
        });
        if (teamCount >= userPlanMaxTeamCount) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_MAX_TEAM_COUNT', 'You have reached the limit of the number of teams for your plan.');
        }
        const res = await this.prisma.team.create({
            data: Object.assign(Object.assign({}, createTeamDto), { ownerId: userId, Workspace: {
                    create: {
                        name: `${createTeamDto.name} Workspace`,
                        ownerId: userId,
                    },
                } }),
        });
        (_b = this.agent) === null || _b === void 0 ? void 0 : _b.incrementMetric('team.created');
        return res;
    }
    async findAll(userId) {
        var _a;
        const res = await this.prisma.team.findMany({
            where: Object.assign({}, this.ownerOrMemberWhere(userId)),
            include: {
                Workspace: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('team.list.count', res.length);
        return res;
    }
    findOne(userId, id) {
        return this.prisma.team.findFirst({
            where: Object.assign({ id }, this.ownerOrMemberWhere(userId)),
            include: {
                Workspace: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    update(userId, id, updateTeamDto) {
        return this.prisma.team.updateMany({
            where: Object.assign({ id }, this.ownerWhere(userId)),
            data: Object.assign({}, updateTeamDto),
        });
    }
    remove(userId, id) {
        return this.prisma.team.deleteMany({
            where: Object.assign({ id }, this.ownerWhere(userId)),
        });
    }
    count(userId, ownOnly = true) {
        return this.prisma.team.count({
            where: Object.assign({}, (ownOnly ? this.ownerWhere(userId) : this.ownerOrMemberWhere(userId))),
        });
    }
    ownerWhere(userId) {
        return {
            ownerId: userId,
        };
    }
    ownerOrMemberWhere(userId) {
        return {
            OR: [
                {
                    ownerId: userId,
                },
                {
                    TeamMemberships: {
                        some: {
                            userId,
                        },
                    },
                },
            ],
        };
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        user_service_1.UserService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map
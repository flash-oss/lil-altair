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
exports.TeamMembershipsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const user_service_1 = require("../auth/user/user.service");
const invalid_request_exception_1 = require("../exceptions/invalid-request.exception");
const newrelic_1 = require("../newrelic/newrelic");
let TeamMembershipsService = class TeamMembershipsService {
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
        this.agent = (0, newrelic_1.getAgent)();
    }
    async create(userId, createTeamMembershipDto) {
        var _a, _b;
        const userPlanConfig = await this.userService.getPlanConfig(userId);
        const userPlanMaxTeamMemberCount = (_a = userPlanConfig === null || userPlanConfig === void 0 ? void 0 : userPlanConfig.maxTeamMemberCount) !== null && _a !== void 0 ? _a : 0;
        const teamMembershipCount = await this.prisma.teamMembership.count({
            where: {
                team: {
                    id: createTeamMembershipDto.teamId,
                    ownerId: userId,
                },
            },
        });
        if (teamMembershipCount >= userPlanMaxTeamMemberCount) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_MAX_TEAM_MEMBER_COUNT');
        }
        const validTeam = await this.prisma.team.findFirst({
            where: {
                id: createTeamMembershipDto.teamId,
                ownerId: userId,
            },
        });
        if (!validTeam) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_PERM_DENIED', 'You are not permitted to add a team member to this team.');
        }
        const validMember = await this.prisma.user.findFirst({
            where: {
                email: createTeamMembershipDto.email,
            },
        });
        if (!validMember) {
            console.error('The user does not exist.');
            throw new common_1.BadRequestException();
        }
        const res = await this.prisma.teamMembership.create({
            data: {
                teamId: createTeamMembershipDto.teamId,
                userId: validMember.id,
            },
        });
        await this.updateSubscriptionQuantity(userId);
        (_b = this.agent) === null || _b === void 0 ? void 0 : _b.incrementMetric('team.membership.added');
        return res;
    }
    async findAllByTeamOwner(userId) {
        var _a;
        const res = await this.prisma.teamMembership.findMany({
            where: {
                team: {
                    ownerId: userId,
                },
            },
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('team.membership.count_by_owner', res.length);
        return res;
    }
    async findAll(userId, teamId) {
        var _a;
        const validMember = await this.prisma.teamMembership.findFirst({
            where: {
                userId,
            },
        });
        const validOwner = await this.prisma.team.findFirst({
            where: {
                id: teamId,
                ownerId: userId,
            },
        });
        if (!validMember && !validOwner) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_PERM_DENIED', 'You do not have permission to access the team members.');
        }
        const res = await this.prisma.teamMembership.findMany({
            where: {
                teamId,
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('team.membership.count', res.length);
        return res;
    }
    findOne(userId, id) {
        throw new common_1.BadRequestException('not yet implemented');
    }
    update(userId, id, updateTeamMembershipDto) {
        throw new common_1.BadRequestException('not yet implemented');
    }
    async remove(ownerId, teamId, memberId) {
        const validOwner = await this.prisma.teamMembership.findFirst({
            where: {
                team: {
                    ownerId,
                },
            },
        });
        if (!validOwner) {
            throw new invalid_request_exception_1.InvalidRequestException('ERR_PERM_DENIED', 'You are not permitted to remove this team membership.');
        }
        const res = await this.prisma.teamMembership.delete({
            where: {
                userId_teamId: {
                    teamId,
                    userId: memberId,
                },
            },
        });
        await this.updateSubscriptionQuantity(ownerId);
        return res;
    }
    async updateSubscriptionQuantity(userId) {
        const userPlanConfig = await this.userService.getPlanConfig(userId);
        if (userPlanConfig === null || userPlanConfig === void 0 ? void 0 : userPlanConfig.allowMoreTeamMembers) {
            const memberships = await this.findAllByTeamOwner(userId);
            const uniqueMembers = new Set(memberships.map((m) => m.userId));
            await this.userService.updateSubscriptionQuantity(userId, uniqueMembers.size);
        }
    }
};
exports.TeamMembershipsService = TeamMembershipsService;
exports.TeamMembershipsService = TeamMembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        user_service_1.UserService])
], TeamMembershipsService);
//# sourceMappingURL=team-memberships.service.js.map
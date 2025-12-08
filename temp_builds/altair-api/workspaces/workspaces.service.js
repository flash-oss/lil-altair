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
exports.WorkspacesService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const where_clauses_1 = require("../common/where-clauses");
const newrelic_1 = require("../newrelic/newrelic");
let WorkspacesService = class WorkspacesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.agent = (0, newrelic_1.getAgent)();
    }
    create(userId, createWorkspaceDto) {
        return 'This action adds a new workspace';
    }
    async findAll(userId) {
        var _a;
        const res = await this.prisma.workspace.findMany({
            where: Object.assign({}, (0, where_clauses_1.workspaceWhereOwnerOrMember)(userId)),
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('workspace.list.count', res.length);
        return res;
    }
    findOne(userId, id) {
        return this.prisma.workspace.findFirst({
            where: Object.assign({ id }, (0, where_clauses_1.workspaceWhereOwnerOrMember)(userId)),
        });
    }
    update(userId, id, updateWorkspaceDto) {
        return `This action updates a #${id} workspace`;
    }
    remove(userId, id) {
        return `This action removes a #${id} workspace`;
    }
    async count(userId, ownOnly = true) {
        return this.prisma.workspace.count({
            where: Object.assign({}, (ownOnly
                ? (0, where_clauses_1.workspaceWhereOwner)(userId)
                : (0, where_clauses_1.workspaceWhereOwnerOrMember)(userId))),
        });
    }
};
exports.WorkspacesService = WorkspacesService;
exports.WorkspacesService = WorkspacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService])
], WorkspacesService);
//# sourceMappingURL=workspaces.service.js.map
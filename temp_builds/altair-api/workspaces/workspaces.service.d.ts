import { ReturnedWorkspace } from '@altairgraphql/api-utils';
import { PrismaService } from 'nestjs-prisma';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
export declare class WorkspacesService {
    private readonly prisma;
    private readonly agent;
    constructor(prisma: PrismaService);
    create(userId: string, createWorkspaceDto: CreateWorkspaceDto): string;
    findAll(userId: string): Promise<ReturnedWorkspace[]>;
    findOne(userId: string, id: string): Promise<ReturnedWorkspace | null>;
    update(userId: string, id: string, updateWorkspaceDto: UpdateWorkspaceDto): string;
    remove(userId: string, id: string): string;
    count(userId: string, ownOnly?: boolean): Promise<number>;
}
//# sourceMappingURL=workspaces.service.d.ts.map
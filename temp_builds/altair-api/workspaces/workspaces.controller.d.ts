import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Request } from 'express';
export declare class WorkspacesController {
    private readonly workspacesService;
    constructor(workspacesService: WorkspacesService);
    create(req: Request, createWorkspaceDto: CreateWorkspaceDto): string;
    findAll(req: Request): Promise<{
        id: string;
        name: string;
        ownerId: string;
        teamId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(req: Request, id: string): Promise<{
        id: string;
        name: string;
        ownerId: string;
        teamId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(req: Request, id: string, updateWorkspaceDto: UpdateWorkspaceDto): string;
    remove(req: Request, id: string): string;
}
//# sourceMappingURL=workspaces.controller.d.ts.map
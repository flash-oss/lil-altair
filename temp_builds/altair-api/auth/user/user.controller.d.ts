import { IPlan } from '@altairgraphql/api-utils';
import { Request } from 'express';
import { QueriesService } from 'src/queries/queries.service';
import { QueryCollectionsService } from 'src/query-collections/query-collections.service';
import { TeamsService } from 'src/teams/teams.service';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    private queryService;
    private collectionService;
    private teamService;
    constructor(userService: UserService, queryService: QueriesService, collectionService: QueryCollectionsService, teamService: TeamsService);
    getBillingUrl(req: Request): Promise<{
        url: string;
    }>;
    getCurrentPlan(req: Request): Promise<IPlan>;
    getStats(req: Request): Promise<{
        queries: {
            own: number;
            access: number;
        };
        collections: {
            own: number;
            access: number;
        };
        teams: {
            own: number;
            access: number;
        };
    }>;
    getProPlanUrl(req: Request): Promise<{
        url: string | null;
    }>;
}
//# sourceMappingURL=user.controller.d.ts.map
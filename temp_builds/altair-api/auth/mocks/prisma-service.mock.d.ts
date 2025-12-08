import { PlanConfig, User, UserPlan } from '@altairgraphql/db';
import { Prisma } from '@prisma/client';
export declare function mockUser(): User;
export declare function mockUserPlan(): UserPlan & {
    planConfig: PlanConfig;
};
export declare function mockPlanConfig(): PlanConfig;
export declare function mockPrismaConflictError(): Prisma.PrismaClientKnownRequestError;
//# sourceMappingURL=prisma-service.mock.d.ts.map
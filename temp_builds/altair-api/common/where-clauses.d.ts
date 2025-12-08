import { Prisma } from '@altairgraphql/db';
export declare const workspaceWhereOwner: (userId: string) => Prisma.WorkspaceWhereInput;
export declare const workspaceWhereOwnerOrMember: (userId: string) => Prisma.WorkspaceWhereInput;
export declare const collectionWhereOwner: (userId: string) => Prisma.QueryCollectionWhereInput;
export declare const collectionWhereOwnerOrMember: (userId: string) => Prisma.QueryCollectionWhereInput;
export declare const queryItemWhereOwnerOrMember: (userId: string) => Prisma.QueryItemWhereInput;
export declare const queryItemWhereOwner: (userId: string) => Prisma.QueryItemWhereInput;
//# sourceMappingURL=where-clauses.d.ts.map
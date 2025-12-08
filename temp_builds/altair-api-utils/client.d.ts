import { KyInstance } from 'ky/distribution/types/ky';
import { ICreateQueryCollectionDto, ICreateQueryDto, IUpdateQueryCollectionDto, IUpdateQueryDto } from './query';
import { QueryItem, QueryCollection, TeamMembership, QueryItemRevision, IdentityProvider } from '@altairgraphql/db';
import { IPlan, IPlanInfo, IUserProfile, IUserStats } from './user';
import { ICreateTeamDto, ICreateTeamMembershipDto, IUpdateTeamDto } from './team';
import { Observable, Subject } from 'rxjs';
import { ConfigEnvironment } from 'altair-graphql-core/build/config/environment';
import { UrlConfig } from 'altair-graphql-core/build/config/urls';
import { IRateMessageDto, ISendMessageDto } from './ai';
import { IAvailableCredits } from 'altair-graphql-core/build/types/state/account.interfaces';
export type FullQueryCollection = QueryCollection & {
    queries: QueryItem[];
};
export type ReturnedTeamMembership = TeamMembership & {
    user: Pick<IUserProfile, 'firstName' | 'lastName' | 'email'>;
};
export type QueryItemRevisionWithUsername = QueryItemRevision & {
    createdByUser: Pick<IUserProfile, 'firstName' | 'lastName' | 'email'>;
};
export declare class APIClient {
    urlConfig: UrlConfig;
    ky: KyInstance;
    authToken?: string;
    user$: Subject<IUserProfile | undefined>;
    private _user?;
    get user(): IUserProfile | undefined;
    set user(val: IUserProfile | undefined);
    constructor(urlConfig: UrlConfig);
    private checkCachedUser;
    private setCachedToken;
    private getCachedToken;
    private clearCachedToken;
    private setAuthHeaderBeforeRequest;
    private nonce;
    private getPopupUrl;
    observeUser(): Observable<IUserProfile | undefined>;
    getUser(): Promise<IUserProfile | undefined>;
    signInWithCustomToken(token: string): Promise<IUserProfile>;
    signinWithPopup(provider?: IdentityProvider): Promise<IUserProfile>;
    private signinWithPopupGetToken;
    signOut(): void;
    createQuery(queryInput: ICreateQueryDto): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateQuery(id: string, queryInput: IUpdateQueryDto): Promise<unknown>;
    deleteQuery(id: string): Promise<unknown>;
    getQuery(id: string): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    getQueryRevisions(id: string): Promise<QueryItemRevisionWithUsername[]>;
    restoreQueryRevision(id: string, revisionId: string): Promise<{
        id: string;
        queryVersion: number;
        name: string;
        collectionId: string;
        content: import("@altairgraphql/db").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createQueryCollection(collectionInput: ICreateQueryCollectionDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        preRequestScript: string | null;
        preRequestScriptEnabled: boolean;
        postRequestScript: string | null;
        postRequestScriptEnabled: boolean;
        environmentVariables: import("@altairgraphql/db").Prisma.JsonValue | null;
        headers: import("@altairgraphql/db").Prisma.JsonValue | null;
        workspaceId: string;
        parentCollectionId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCollection(id: string, collectionInput: IUpdateQueryCollectionDto): Promise<unknown>;
    deleteCollection(id: string): Promise<unknown>;
    getCollection(id: string): Promise<FullQueryCollection | undefined>;
    getCollections(): Promise<FullQueryCollection[]>;
    createTeam(teamInput: ICreateTeamDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTeam(id: string, teamInput: IUpdateTeamDto): Promise<unknown>;
    deleteTeam(id: string): Promise<unknown>;
    getTeam(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    getTeams(): Promise<{
        id: string;
        name: string;
        description: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    addTeamMember(input: ICreateTeamMembershipDto): Promise<{
        userId: string;
        teamId: string;
        role: import("@altairgraphql/db").$Enums.TeamMemberRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTeamMembers(teamId: string): Promise<ReturnedTeamMembership[]>;
    getWorkspaces(): Promise<{
        id: string;
        name: string;
        ownerId: string;
        teamId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getBillingUrl(): Promise<{
        url: string;
    }>;
    getUpgradeProUrl(): Promise<{
        url: string;
    }>;
    openBillingPage(): Promise<void>;
    getUserStats(): Promise<IUserStats>;
    getUserPlan(): Promise<IPlan>;
    getPlanInfos(): Promise<IPlanInfo[]>;
    getAvailableCredits(): Promise<IAvailableCredits>;
    buyCredits(): Promise<{
        url: string | null;
    }>;
    getActiveAiSession(): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createAiSession(): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAiSessionMessages(sessionId: string): Promise<{
        id: string;
        sessionId: string;
        message: string;
        role: import("@altairgraphql/db").$Enums.AiChatRole;
        transactionId: string | null;
        sdl: string | null;
        graphqlQuery: string | null;
        graphqlVariables: string | null;
        inputTokens: number | null;
        outputTokens: number | null;
        rating: import("@altairgraphql/db").$Enums.AiChatRating | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    sendMessageToAiSession(sessionId: string, input: ISendMessageDto): Promise<{
        response: string;
    }>;
    rateAiMessage(sessionId: string, messageId: string, input: IRateMessageDto): Promise<{
        id: string;
        sessionId: string;
        message: string;
        role: import("@altairgraphql/db").$Enums.AiChatRole;
        transactionId: string | null;
        sdl: string | null;
        graphqlQuery: string | null;
        graphqlVariables: string | null;
        inputTokens: number | null;
        outputTokens: number | null;
        rating: import("@altairgraphql/db").$Enums.AiChatRating | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getQueryShareUrl(queryId: string): string;
    private getSLT;
    private fromEventSource;
    listenForEvents(): Observable<unknown>;
}
export declare const initializeClient: (env?: ConfigEnvironment) => APIClient;
//# sourceMappingURL=client.d.ts.map
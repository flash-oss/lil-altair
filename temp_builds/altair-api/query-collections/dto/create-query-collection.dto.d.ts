import { ICreateQueryCollectionDto } from '@altairgraphql/api-utils';
import { CreateQuerySansCollectionIdDto } from 'src/queries/dto/create-query.dto';
export declare class CreateQueryCollectionDto implements ICreateQueryCollectionDto {
    name: string;
    queries?: CreateQuerySansCollectionIdDto[];
    workspaceId?: string;
    teamId?: string;
    description?: string;
    preRequestScript?: string;
    preRequestScriptEnabled?: boolean;
    postRequestScript?: string;
    postRequestScriptEnabled?: boolean;
    headers?: {
        key: string;
        value: string;
        enabled: boolean;
    }[];
    environmentVariables?: Record<string, unknown>;
}
//# sourceMappingURL=create-query-collection.dto.d.ts.map
import { ICreateQueryDto, IQueryContentDto } from '@altairgraphql/api-utils';
export declare class CreateQueryDto implements ICreateQueryDto {
    name: string;
    content: IQueryContentDto;
    collectionId: string;
}
declare const CreateQuerySansCollectionIdDto_base: import("@nestjs/common").Type<Omit<CreateQueryDto, "collectionId">>;
export declare class CreateQuerySansCollectionIdDto extends CreateQuerySansCollectionIdDto_base {
}
export {};
//# sourceMappingURL=create-query.dto.d.ts.map
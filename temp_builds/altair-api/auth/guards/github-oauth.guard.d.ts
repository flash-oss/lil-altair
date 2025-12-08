import { ConfigService } from '@nestjs/config';
declare const GitHubOAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GitHubOAuthGuard extends GitHubOAuthGuard_base {
    private configService;
    constructor(configService: ConfigService);
}
export {};
//# sourceMappingURL=github-oauth.guard.d.ts.map
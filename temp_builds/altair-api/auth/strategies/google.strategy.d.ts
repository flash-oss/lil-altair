import { ConfigService } from '@nestjs/config';
import { User } from '@altairgraphql/db';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { UserService } from '../user/user.service';
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly userService;
    private readonly authService;
    readonly configService: ConfigService;
    constructor(userService: UserService, authService: AuthService, configService: ConfigService);
    authenticate(req: Request, options: Record<string, unknown>): void;
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User>;
}
export {};
//# sourceMappingURL=google.strategy.d.ts.map
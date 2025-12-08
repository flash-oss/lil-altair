import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    googleSignin(): void;
    googleSigninCallback(req: Request, res: Response): void;
    githubSignin(): void;
    githubSigninCallback(req: Request, res: Response): void;
    getUserProfile(req: Request): {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        picture: string | null;
        isNewUser: boolean;
        tokens: import("@altairgraphql/api-utils").IToken;
    };
    getShortlivedEventsToken(req: Request): {
        slt: string;
    };
}
//# sourceMappingURL=auth.controller.d.ts.map
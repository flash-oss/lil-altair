import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, IdentityProvider } from '@altairgraphql/db';
import { PrismaService } from 'nestjs-prisma';
import { ChangePasswordInput } from './models/change-password.input';
import { PasswordService } from './password/password.service';
import { IToken } from '@altairgraphql/api-utils';
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    private readonly passwordService;
    private readonly configService;
    private readonly agent;
    constructor(jwtService: JwtService, prisma: PrismaService, passwordService: PasswordService, configService: ConfigService);
    passwordLogin(email: string, password: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        picture: string | null;
        isNewUser: boolean;
        tokens: IToken;
    }>;
    googleLogin(user?: User): {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        picture: string | null;
        isNewUser: boolean;
        tokens: IToken;
    };
    githubLogin(user?: User): {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        picture: string | null;
        isNewUser: boolean;
        tokens: IToken;
    };
    getUserCredential(providerUserId: string, provider: IdentityProvider): import("@altairgraphql/db").Prisma.Prisma__UserCredentialClient<{
        id: string;
        provider: import("@altairgraphql/db").$Enums.IdentityProvider;
        providerUserId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    validateUser(userId: string): Promise<User | null>;
    getUserFromToken(token: string): Promise<User | null>;
    changePassword(userId: string, userPassword: string, changePassword: ChangePasswordInput): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        emailVerified: Date | null;
        password: string | null;
        picture: string | null;
        stripeCustomerId: string | null;
        resendContactId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getLoginResponse(user: User): {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        picture: string | null;
        isNewUser: boolean;
        tokens: IToken;
    };
    generateTokens(payload: {
        userId: string;
    }): IToken;
    getShortLivedEventsToken(userId: string): string;
    private generateAccessToken;
    private generateRefreshToken;
    refreshToken(token: string): IToken;
}
//# sourceMappingURL=auth.service.d.ts.map
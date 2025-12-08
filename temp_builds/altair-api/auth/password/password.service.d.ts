import { ConfigService } from '@nestjs/config';
export declare class PasswordService {
    private configService;
    constructor(configService: ConfigService);
    get bcryptSaltRounds(): string | number;
    validatePassword(password: string, hashedPassword: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
}
//# sourceMappingURL=password.service.d.ts.map
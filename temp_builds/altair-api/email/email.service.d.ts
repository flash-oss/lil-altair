import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/auth/user/user.service';
import { Config } from 'src/common/config';
export declare class EmailService {
    private configService;
    private readonly userService;
    private resend;
    private agent;
    constructor(configService: ConfigService<Config>, userService: UserService);
    subscribeUser(userId: string): Promise<void>;
    sendWelcomeEmail(userId: string): Promise<{
        data: import("resend").CreateEmailResponseSuccess | null;
        error: import("resend").ErrorResponse | null;
    }>;
    sendGoodbyeEmail(userId: string): Promise<{
        data: import("resend").CreateEmailResponseSuccess | null;
        error: import("resend").ErrorResponse | null;
    }>;
    private sendEmail;
    private getFirstName;
}
//# sourceMappingURL=email.service.d.ts.map
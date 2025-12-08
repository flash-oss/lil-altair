import { PrismaService } from 'nestjs-prisma';
import { UserService } from 'src/auth/user/user.service';
import { StripeService } from 'src/stripe/stripe.service';
export declare class CreditService {
    private readonly prisma;
    private readonly userService;
    private readonly stripeService;
    private readonly logger;
    private readonly agent;
    constructor(prisma: PrismaService, userService: UserService, stripeService: StripeService);
    buyCredits(userId: string, amount?: number): Promise<{
        url: string | null;
    }>;
    getAvailableCredits(userId: string): Promise<{
        fixed: number;
        monthly: number;
        total: number;
    }>;
    useCredits(userId: string, amount: number): Promise<{
        transactionId: string;
        fixedCredits: number;
        monthlyCredits: number;
    }>;
    handleMonthlyRefill(): Promise<void>;
}
//# sourceMappingURL=credit.service.d.ts.map
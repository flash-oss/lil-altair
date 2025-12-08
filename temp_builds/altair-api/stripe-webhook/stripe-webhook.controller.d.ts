import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'nestjs-prisma';
import { UserService } from 'src/auth/user/user.service';
import { EmailService } from 'src/email/email.service';
import { StripeService } from 'src/stripe/stripe.service';
export declare class StripeWebhookController {
    private readonly stripeService;
    private readonly userService;
    private readonly prisma;
    private readonly emailService;
    constructor(stripeService: StripeService, userService: UserService, prisma: PrismaService, emailService: EmailService);
    incomingEvents(stripeSignature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
//# sourceMappingURL=stripe-webhook.controller.d.ts.map
import { IPlanInfo } from '@altairgraphql/api-utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Response } from 'express';
import { PrismaService } from 'nestjs-prisma';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { StripeService } from './stripe/stripe.service';
export declare class AppController {
    private readonly appService;
    private readonly eventService;
    private readonly prisma;
    private readonly stripeService;
    constructor(appService: AppService, eventService: EventEmitter2, prisma: PrismaService, stripeService: StripeService);
    goHome(res: Response): void;
    getPlans(): Promise<IPlanInfo[]>;
    handleUserEvents(req: Request): Observable<unknown>;
}
//# sourceMappingURL=app.controller.d.ts.map
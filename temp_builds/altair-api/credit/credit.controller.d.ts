import { CreditService } from './credit.service';
import { Request } from 'express';
import { BuyDto } from './dto/buy.dto';
export declare class CreditController {
    private readonly creditService;
    constructor(creditService: CreditService);
    getAvailableCredits(req: Request): Promise<{
        fixed: number;
        monthly: number;
        total: number;
    }>;
    buyCredits(req: Request, buyDto: BuyDto): Promise<{
        url: string | null;
    }>;
}
//# sourceMappingURL=credit.controller.d.ts.map
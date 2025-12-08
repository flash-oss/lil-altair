"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CreditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditService = void 0;
const db_1 = require("@altairgraphql/db");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const nestjs_prisma_1 = require("nestjs-prisma");
const user_service_1 = require("../auth/user/user.service");
const newrelic_1 = require("../newrelic/newrelic");
const stripe_service_1 = require("../stripe/stripe.service");
let CreditService = CreditService_1 = class CreditService {
    constructor(prisma, userService, stripeService) {
        this.prisma = prisma;
        this.userService = userService;
        this.stripeService = stripeService;
        this.logger = new common_1.Logger(CreditService_1.name);
        this.agent = (0, newrelic_1.getAgent)();
    }
    async buyCredits(userId, amount = db_1.MINIMUM_CREDIT_PURCHASE) {
        const planConfig = await this.userService.getPlanConfig(userId);
        if ((planConfig === null || planConfig === void 0 ? void 0 : planConfig.id) !== db_1.PRO_PLAN_ID) {
            throw new common_1.BadRequestException('Only pro users can buy credits');
        }
        const customerId = await this.userService.getStripeCustomerId(userId);
        const creditInfo = await this.stripeService.getCreditInfo();
        const ses = await this.stripeService.createCreditCheckoutSession(customerId, creditInfo.priceId, Math.min(amount, db_1.MINIMUM_CREDIT_PURCHASE));
        return { url: ses.url };
    }
    async getAvailableCredits(userId) {
        var _a, _b;
        const creditBalance = await this.prisma.creditBalance.findUnique({
            where: { userId },
        });
        if (!creditBalance) {
            (_a = this.agent) === null || _a === void 0 ? void 0 : _a.incrementMetric('credit.balance.not_found');
            throw new common_1.BadRequestException('User has no credits');
        }
        (_b = this.agent) === null || _b === void 0 ? void 0 : _b.recordMetric('credit.balance.total', creditBalance.fixedCredits + creditBalance.monthlyCredits);
        return {
            fixed: creditBalance.fixedCredits,
            monthly: creditBalance.monthlyCredits,
            total: creditBalance.fixedCredits + creditBalance.monthlyCredits,
        };
    }
    async useCredits(userId, amount) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Invalid amount');
        }
        const credits = await this.getAvailableCredits(userId);
        if (credits.total < amount) {
            throw new common_1.BadRequestException('Insufficient credits');
        }
        let usedMonthlyCredits = 0;
        let usedFixedCredits = 0;
        usedMonthlyCredits = Math.min(credits.monthly, amount);
        usedFixedCredits = Math.min(credits.fixed, amount - usedMonthlyCredits);
        const transaction = await this.prisma.creditTransaction.create({
            data: {
                userId,
                fixedAmount: -usedFixedCredits,
                monthlyAmount: -usedMonthlyCredits,
                type: db_1.CreditTransactionType.USED,
                description: 'Used credits',
            },
        });
        const balance = await this.prisma.creditBalance.update({
            where: { userId },
            data: {
                monthlyCredits: { decrement: usedMonthlyCredits },
                fixedCredits: { decrement: usedFixedCredits },
            },
        });
        return {
            transactionId: transaction.id,
            fixedCredits: balance.fixedCredits,
            monthlyCredits: balance.monthlyCredits,
        };
    }
    async handleMonthlyRefill() {
        var _a;
        const proUsers = await this.userService.getProUsers();
        const creditBalanceRecords = proUsers.map(async (user) => {
            var _a;
            const currentUserBalance = await this.prisma.creditBalance.findUnique({
                where: { userId: user.id },
            });
            await this.prisma.creditBalance.update({
                where: { userId: user.id },
                data: {
                    monthlyCredits: db_1.MONTHLY_CREDIT_REFILL,
                },
            });
            await this.prisma.creditTransaction.create({
                data: {
                    userId: user.id,
                    monthlyAmount: db_1.MONTHLY_CREDIT_REFILL - ((_a = currentUserBalance === null || currentUserBalance === void 0 ? void 0 : currentUserBalance.monthlyCredits) !== null && _a !== void 0 ? _a : 0),
                    fixedAmount: 0,
                    type: db_1.CreditTransactionType.MONTHLY_REFILL,
                    description: 'Monthly refill',
                },
            });
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('credit.monthly.refill_count', proUsers.length);
        await Promise.all(creditBalanceRecords);
    }
};
exports.CreditService = CreditService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CreditService.prototype, "handleMonthlyRefill", null);
exports.CreditService = CreditService = CreditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        user_service_1.UserService,
        stripe_service_1.StripeService])
], CreditService);
//# sourceMappingURL=credit.service.js.map
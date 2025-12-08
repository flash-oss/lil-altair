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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const openapi = require("@nestjs/swagger");
const db_1 = require("@altairgraphql/db");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const user_service_1 = require("../auth/user/user.service");
const email_service_1 = require("../email/email.service");
const stripe_service_1 = require("../stripe/stripe.service");
let StripeWebhookController = class StripeWebhookController {
    constructor(stripeService, userService, prisma, emailService) {
        this.stripeService = stripeService;
        this.userService = userService;
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async incomingEvents(stripeSignature, req) {
        var _a, _b, _c;
        if (!stripeSignature) {
            throw new common_2.BadRequestException('Missing stripe signature');
        }
        const event = this.stripeService.createWebhookEvent(req.rawBody, stripeSignature);
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const data = event.data.object;
                const user = await this.userService.getUserByStripeCustomerId(data.customer.toString());
                if (!user) {
                    throw new common_2.BadRequestException('User not found!');
                }
                const status = data.status;
                const shouldCancelPlan = status === 'canceled' || status === 'unpaid';
                const item = data.items.data.at(0);
                if (!item) {
                    throw new common_2.BadRequestException('No item found!');
                }
                const quantity = (_a = item.quantity) !== null && _a !== void 0 ? _a : 1;
                const planInfos = await this.stripeService.getPlanInfos();
                const planInfo = planInfos.find((p) => p.id === item.plan.product);
                if (!planInfo) {
                    throw new common_2.BadRequestException('Plan info not found!');
                }
                const planRole = shouldCancelPlan ? db_1.BASIC_PLAN_ID : planInfo.role;
                if (planRole === db_1.BASIC_PLAN_ID) {
                    await this.userService.toBasicPlan(user.id);
                    if (shouldCancelPlan) {
                        console.log('Sending goodbye email');
                        await this.emailService.sendGoodbyeEmail(user.id);
                    }
                }
                else if (planRole === db_1.PRO_PLAN_ID) {
                    await this.userService.toProPlan(user.id, quantity);
                    if (event.type === 'customer.subscription.created') {
                        console.log('Sending welcome email');
                        await this.emailService.sendWelcomeEmail(user.id);
                        console.log('Subscribing user');
                        await this.emailService.subscribeUser(user.id);
                    }
                }
                break;
            }
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded': {
                const data = event.data.object;
                const checkoutSession = await this.stripeService.retrieveCheckoutSession(data.id);
                if (!checkoutSession.customer) {
                    throw new common_2.BadRequestException('No customer found!');
                }
                if (await this.prisma.creditPurchase.findFirst({
                    where: {
                        stripeSessionId: checkoutSession.id,
                    },
                })) {
                    throw new common_2.BadRequestException('Credit purchase already exists!');
                }
                if (checkoutSession.payment_status !== 'unpaid') {
                    const creditInfo = await this.stripeService.getCreditInfo();
                    const purchasedCreditsItem = (_b = checkoutSession.line_items) === null || _b === void 0 ? void 0 : _b.data.find((item) => {
                        var _a;
                        return ((_a = item.price) === null || _a === void 0 ? void 0 : _a.product) === creditInfo.id;
                    });
                    if (purchasedCreditsItem) {
                        const user = await this.userService.getUserByStripeCustomerId(checkoutSession.customer.toString());
                        if (!user) {
                            throw new common_2.BadRequestException('User not found!');
                        }
                        const quantity = (_c = purchasedCreditsItem.quantity) !== null && _c !== void 0 ? _c : 0;
                        await this.prisma.creditBalance.update({
                            where: {
                                userId: user.id,
                            },
                            data: {
                                fixedCredits: {
                                    increment: quantity,
                                },
                            },
                        });
                        const transaction = await this.prisma.creditTransaction.create({
                            data: {
                                userId: user.id,
                                fixedAmount: quantity,
                                monthlyAmount: 0,
                                description: 'Purchased credits',
                                type: db_1.CreditTransactionType.PURCHASED,
                            },
                        });
                        await this.prisma.creditPurchase.create({
                            data: {
                                userId: user.id,
                                transactionId: transaction.id,
                                stripeSessionId: checkoutSession.id,
                                amount: quantity,
                                cost: creditInfo.price,
                                currency: creditInfo.currency,
                            },
                        });
                    }
                    else {
                        throw new common_2.BadRequestException('Unknown checkout session');
                    }
                }
                break;
            }
        }
        return { received: true };
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, common_2.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "incomingEvents", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, common_2.Controller)('stripe-webhook'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        user_service_1.UserService,
        nestjs_prisma_1.PrismaService,
        email_service_1.EmailService])
], StripeWebhookController);
//# sourceMappingURL=stripe-webhook.controller.js.map
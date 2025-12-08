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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("@altairgraphql/db");
const common_1 = require("@nestjs/common");
const nestjs_prisma_1 = require("nestjs-prisma");
const client_1 = require("@prisma/client");
const stripe_service_1 = require("../../stripe/stripe.service");
const newrelic_1 = require("../../newrelic/newrelic");
let UserService = UserService_1 = class UserService {
    constructor(prisma, stripeService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
        this.logger = new common_1.Logger(UserService_1.name);
        this.agent = (0, newrelic_1.getAgent)();
    }
    async createUser(payload, providerInfo) {
        try {
            const stripeCustomer = await this.stripeService.connectOrCreateCustomer(payload.email);
            const user = await this.prisma.user.create({
                data: Object.assign(Object.assign(Object.assign({}, payload), { stripeCustomerId: stripeCustomer.id, Workspace: {
                        create: {
                            name: 'My workspace',
                        },
                    }, UserPlan: {
                        create: {
                            planRole: db_1.BASIC_PLAN_ID,
                            quantity: 1,
                        },
                    }, CreditBalance: {
                        create: {
                            fixedCredits: db_1.INITIAL_CREDIT_BALANCE,
                            monthlyCredits: 0,
                        },
                    }, CreditTransaction: {
                        create: {
                            type: db_1.CreditTransactionType.INITIAL,
                            fixedAmount: db_1.INITIAL_CREDIT_BALANCE,
                            monthlyAmount: 0,
                            description: 'Initial credits',
                        },
                    } }), (providerInfo
                    ? {
                        UserCredential: {
                            create: {
                                provider: providerInfo.provider,
                                providerUserId: providerInfo.providerUserId,
                            },
                        },
                    }
                    : {})),
            });
            return user;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException(`Email ${payload.email} already used.`);
            }
            throw new Error(e);
        }
    }
    getUser(userId) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }
    async mustGetUser(userId) {
        const user = await this.getUser(userId);
        if (!user) {
            throw new Error(`User not found for id: ${userId}`);
        }
        return user;
    }
    getUserByStripeCustomerId(stripeCustomerId) {
        return this.prisma.user.findFirst({
            where: {
                stripeCustomerId,
            },
        });
    }
    updateUser(userId, newUserData) {
        return this.prisma.user.update({
            data: newUserData,
            where: {
                id: userId,
            },
        });
    }
    updateUserResendContactId(userId, resendContactId) {
        return this.prisma.user.update({
            data: {
                resendContactId,
            },
            where: {
                id: userId,
            },
        });
    }
    async getPlanConfig(userId) {
        const res = await this.prisma.userPlan.findUnique({
            where: {
                userId,
            },
            include: {
                planConfig: true,
            },
        });
        if (!res) {
            this.logger.warn(`No plan config found for user (${userId}). Falling back to basic.`);
            return this.prisma.planConfig.findUnique({
                where: {
                    id: db_1.BASIC_PLAN_ID,
                },
            });
        }
        return Object.assign(Object.assign({}, res.planConfig), { maxTeamMemberCount: res.planConfig.allowMoreTeamMembers
                ? Infinity
                : res.planConfig.maxTeamMemberCount });
    }
    async updateSubscriptionQuantity(userId, quantity) {
        const user = await this.mustGetUser(userId);
        if (!user.stripeCustomerId) {
            throw new Error(`Cannot update subscription quantity since user (${userId}) does not have a stripe customer ID`);
        }
        return this.stripeService.updateSubscriptionQuantity(user.stripeCustomerId, quantity);
    }
    async getStripeCustomerId(userId) {
        const user = await this.mustGetUser(userId);
        if (user.stripeCustomerId) {
            return user.stripeCustomerId;
        }
        const res = await this.stripeService.connectOrCreateCustomer(user.email);
        const customerId = res.id;
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                stripeCustomerId: customerId,
            },
        });
        return customerId;
    }
    async getBillingUrl(userId, returnUrl) {
        const customerId = await this.getStripeCustomerId(userId);
        const session = await this.stripeService.createBillingSession(customerId, returnUrl);
        return session.url;
    }
    async getProPlanUrl(userId) {
        const planConfig = await this.getPlanConfig(userId);
        if ((planConfig === null || planConfig === void 0 ? void 0 : planConfig.id) === db_1.PRO_PLAN_ID) {
            console.warn('User is already on pro plan. Going to return billing url instead.');
            return this.getBillingUrl(userId);
        }
        const customerId = await this.getStripeCustomerId(userId);
        const proPlanInfo = await this.stripeService.getPlanInfoByRole(db_1.PRO_PLAN_ID);
        if (!proPlanInfo) {
            throw new Error(`No plan info found for id: ${db_1.PRO_PLAN_ID}`);
        }
        const session = await this.stripeService.createSubscriptionCheckoutSession(customerId, proPlanInfo.priceId);
        return session.url;
    }
    async updateUserPlan(userId, planId, quantity) {
        const user = await this.mustGetUser(userId);
        await this.prisma.userPlan.upsert({
            where: {
                userId: user.id,
            },
            create: {
                userId: user.id,
                planRole: planId,
                quantity,
            },
            update: {
                planRole: planId,
                quantity,
            },
        });
        return this.updateSubscriptionQuantity(userId, quantity);
    }
    async toBasicPlan(userId) {
        await this.updateUserPlan(userId, db_1.BASIC_PLAN_ID, 1);
        const creditBalance = await this.prisma.creditBalance.findUnique({
            where: { userId },
        });
        if (!creditBalance) {
            throw new Error('User has no credit balance');
        }
        const remainingMonthlyCredits = creditBalance.monthlyCredits;
        if (remainingMonthlyCredits > 0) {
            await this.prisma.creditBalance.update({
                where: { userId },
                data: {
                    monthlyCredits: 0,
                },
            });
            await this.prisma.creditTransaction.create({
                data: {
                    userId,
                    monthlyAmount: remainingMonthlyCredits,
                    fixedAmount: 0,
                    type: db_1.CreditTransactionType.DOWNGRADED,
                    description: 'Downgraded to basic plan',
                },
            });
        }
    }
    async toProPlan(userId, quantity) {
        await this.updateUserPlan(userId, db_1.PRO_PLAN_ID, quantity);
    }
    async getProUsers() {
        var _a;
        const proUsers = await this.prisma.user.findMany({
            where: {
                UserPlan: {
                    planRole: db_1.PRO_PLAN_ID,
                },
            },
        });
        (_a = this.agent) === null || _a === void 0 ? void 0 : _a.recordMetric('users.pro.count', proUsers.length);
        return proUsers;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        stripe_service_1.StripeService])
], UserService);
//# sourceMappingURL=user.service.js.map
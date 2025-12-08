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
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
let StripeService = StripeService_1 = class StripeService {
    constructor() {
        this.logger = new common_1.Logger(StripeService_1.name);
        this.stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-06-20',
        });
    }
    async createCustomer(email) {
        return this.stripe.customers.create({
            email,
            description: 'Added from altair-api',
        });
    }
    async connectOrCreateCustomer(email) {
        const foundCustomer = await this.getCustomerByEmail(email);
        if (foundCustomer) {
            return foundCustomer;
        }
        return this.createCustomer(email);
    }
    async getCustomerByEmail(email) {
        const list = await this.stripe.customers.list({
            email,
        });
        return list.data.at(0);
    }
    getCustomerById(id) {
        return this.stripe.customers.retrieve(id);
    }
    createWebhookEvent(payload, signature) {
        return this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    }
    createBillingSession(stripeCustomerId, returnUrl) {
        return this.stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: returnUrl,
        });
    }
    commonCheckoutSessionParams(stripeCustomerId, priceId, quantity = 1) {
        return {
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            automatic_tax: {
                enabled: true,
            },
            customer_update: {
                address: 'auto',
                name: 'auto',
            },
            tax_id_collection: {
                enabled: true,
            },
            line_items: [
                {
                    price: priceId,
                    quantity,
                    adjustable_quantity: {
                        enabled: true,
                        minimum: quantity,
                    },
                },
            ],
        };
    }
    createSubscriptionCheckoutSession(stripeCustomerId, priceId) {
        return this.stripe.checkout.sessions.create(Object.assign(Object.assign({}, this.commonCheckoutSessionParams(stripeCustomerId, priceId)), { custom_text: {
                submit: {
                    message: 'Note: The quantity determines the number of users in your team. Adding new team members will automatically increase the quantity of your subscription.',
                },
            }, mode: 'subscription', success_url: `https://altairgraphql.dev/checkout_success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `https://altairgraphql.dev/checkout_cancel?session_id={CHECKOUT_SESSION_ID}` }));
    }
    createCreditCheckoutSession(stripeCustomerId, priceId, quantity = 1) {
        return this.stripe.checkout.sessions.create(Object.assign(Object.assign({}, this.commonCheckoutSessionParams(stripeCustomerId, priceId, quantity)), { mode: 'payment', success_url: `https://altairgraphql.dev/checkout_success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `https://altairgraphql.dev/checkout_cancel?session_id={CHECKOUT_SESSION_ID}` }));
    }
    retrieveCheckoutSession(sessionId) {
        return this.stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items'],
        });
    }
    getProducts() {
        return this.stripe.products.list();
    }
    getPrices() {
        return this.stripe.prices.list();
    }
    async getPlanInfoByRole(role) {
        const plans = await this.getPlanInfos();
        return plans.find((plan) => (plan === null || plan === void 0 ? void 0 : plan.role) === role);
    }
    async getPlanInfos() {
        const products = await this.getProducts();
        const prices = await this.getPrices();
        return products.data
            .map((product) => {
            var _a, _b, _c, _d;
            const price = prices.data.find((price) => price.product === product.id);
            if (!price) {
                return undefined;
            }
            if (!product.metadata.role || product.metadata.type !== 'plan') {
                return undefined;
            }
            return {
                id: product.id,
                priceId: price.id,
                role: product.metadata.role,
                name: product.name,
                description: (_a = product.description) !== null && _a !== void 0 ? _a : '',
                price: (_b = price.unit_amount) !== null && _b !== void 0 ? _b : 0,
                currency: price.currency,
                interval: (_d = (_c = price.recurring) === null || _c === void 0 ? void 0 : _c.interval) !== null && _d !== void 0 ? _d : '',
            };
        })
            .filter((plan) => !!plan);
    }
    async getCreditInfo() {
        var _a, _b;
        const products = await this.getProducts();
        const prices = await this.getPrices();
        const product = products.data.find((product) => product.metadata.type === 'credit');
        if (!product) {
            throw new Error('Credit product not found');
        }
        const price = prices.data.find((price) => price.product === product.id);
        if (!price) {
            throw new Error('Credit price not found');
        }
        return {
            id: product.id,
            priceId: price.id,
            price: (_a = price.unit_amount) !== null && _a !== void 0 ? _a : 0,
            currency: price.currency,
            name: product.name,
            description: (_b = product.description) !== null && _b !== void 0 ? _b : '',
        };
    }
    async updateSubscriptionQuantity(stripeCustomerId, quantity) {
        var _a, _b;
        const res = await this.stripe.subscriptions.list({
            customer: stripeCustomerId,
        });
        if (res.data.length > 1) {
            this.logger.error(`stripe customer (${stripeCustomerId}) has ${res.data.length} active subscriptions. Only 1 subscription is allowed.`);
        }
        if (res.data.length === 0) {
            console.error('Customer does not have an active subscription. Exiting.');
            return;
        }
        const itemId = (_b = (_a = res.data.at(0)) === null || _a === void 0 ? void 0 : _a.items.data.at(0)) === null || _b === void 0 ? void 0 : _b.id;
        if (!itemId) {
            throw new Error(`Cannot update subscription quantity since customer (${stripeCustomerId}) does not have a subscription item ID`);
        }
        return this.stripe.subscriptionItems.update(itemId, {
            quantity,
        });
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StripeService);
//# sourceMappingURL=stripe.service.js.map
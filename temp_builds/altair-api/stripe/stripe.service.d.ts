import { Stripe } from 'stripe';
import { PLAN_IDS } from '@altairgraphql/db';
import { IPlanInfo } from '@altairgraphql/api-utils';
export declare class StripeService {
    private stripe;
    private readonly logger;
    constructor();
    createCustomer(email: string): Promise<Stripe.Response<Stripe.Customer>>;
    connectOrCreateCustomer(email: string): Promise<Stripe.Customer>;
    getCustomerByEmail(email: string): Promise<Stripe.Customer | undefined>;
    getCustomerById(id: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>;
    createWebhookEvent(payload: Buffer, signature: string): Stripe.Event;
    createBillingSession(stripeCustomerId: string, returnUrl?: string): Promise<Stripe.Response<Stripe.BillingPortal.Session>>;
    commonCheckoutSessionParams(stripeCustomerId: string, priceId: string, quantity?: number): Stripe.Checkout.SessionCreateParams;
    createSubscriptionCheckoutSession(stripeCustomerId: string, priceId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    createCreditCheckoutSession(stripeCustomerId: string, priceId: string, quantity?: number): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    retrieveCheckoutSession(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    getProducts(): Stripe.ApiListPromise<Stripe.Product>;
    getPrices(): Stripe.ApiListPromise<Stripe.Price>;
    getPlanInfoByRole(role: (typeof PLAN_IDS)[keyof typeof PLAN_IDS]): Promise<IPlanInfo | undefined>;
    getPlanInfos(): Promise<IPlanInfo[]>;
    getCreditInfo(): Promise<{
        id: string;
        priceId: string;
        price: number;
        currency: string;
        name: string;
        description: string;
    }>;
    updateSubscriptionQuantity(stripeCustomerId: string, quantity: number): Promise<Stripe.Response<Stripe.SubscriptionItem> | undefined>;
}
//# sourceMappingURL=stripe.service.d.ts.map
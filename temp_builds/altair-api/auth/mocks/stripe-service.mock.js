"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockStripeCustomer = mockStripeCustomer;
exports.mockSubscriptionItem = mockSubscriptionItem;
exports.mockPlanInfo = mockPlanInfo;
function mockStripeCustomer() {
    return {
        id: 'dad57297-637d-4598-862b-9dedd84121fe',
    };
}
function mockSubscriptionItem() {
    return {
        id: 'f7102dc9-4c0c-42b4-9a17-e2bd4af94d5a',
        object: {},
        billing_thresholds: {},
        created: 1,
        metadata: {},
        plan: {},
        price: {},
        subscription: 'my sub',
        tax_rates: [],
        lastResponse: {},
    };
}
function mockPlanInfo() {
    return {
        priceId: 'c444e512-4a6d-4b68-bb80-43c32edde415',
    };
}
//# sourceMappingURL=stripe-service.mock.js.map
import type { startWebTransaction, getTransaction, recordMetric, incrementMetric } from 'newrelic';
export interface Agent {
    startWebTransaction: typeof startWebTransaction;
    getTransaction: typeof getTransaction;
    recordMetric: typeof recordMetric;
    incrementMetric: typeof incrementMetric;
}
export declare const getAgent: () => Agent | undefined;
//# sourceMappingURL=newrelic.d.ts.map
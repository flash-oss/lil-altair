"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgent = void 0;
const getAgent = () => {
    if (process.env.NEW_RELIC_APP_NAME && process.env.NODE_ENV === 'production') {
        const newrelic = require('newrelic');
        return {
            startWebTransaction: (...args) => newrelic.startWebTransaction(...args),
            getTransaction: (...args) => newrelic.getTransaction(...args),
            recordMetric: (name, ...rest) => newrelic.recordMetric(name.split('.').join('/'), ...rest),
            incrementMetric: (name, ...rest) => newrelic.incrementMetric(name.split('.').join('/'), ...rest),
        };
    }
    return;
};
exports.getAgent = getAgent;
//# sourceMappingURL=newrelic.js.map
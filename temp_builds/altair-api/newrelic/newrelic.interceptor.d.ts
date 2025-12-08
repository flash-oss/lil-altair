import { CallHandler, ExecutionContext, LoggerService, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class NewrelicInterceptor implements NestInterceptor {
    private readonly logger;
    constructor(logger: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
//# sourceMappingURL=newrelic.interceptor.d.ts.map
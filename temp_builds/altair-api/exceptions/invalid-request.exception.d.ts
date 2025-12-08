import { HttpException } from '@nestjs/common';
import { ErrorCode } from 'src/common/errors';
export declare class InvalidRequestException extends HttpException {
    constructor(errCode: ErrorCode, message?: string);
}
//# sourceMappingURL=invalid-request.exception.d.ts.map
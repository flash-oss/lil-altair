"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRequestException = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../common/errors");
class InvalidRequestException extends common_1.HttpException {
    constructor(errCode, message) {
        let msg = errors_1.ERRORS[errCode];
        if (msg && message) {
            msg += `: ${message}`;
        }
        if (!msg) {
            msg = message !== null && message !== void 0 ? message : 'Bad request';
        }
        super({
            status: common_1.HttpStatus.BAD_REQUEST,
            error: {
                code: errCode,
                message: msg,
            },
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidRequestException = InvalidRequestException;
//# sourceMappingURL=invalid-request.exception.js.map
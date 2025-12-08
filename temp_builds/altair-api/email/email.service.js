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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
const emails_1 = require("@altairgraphql/emails");
const user_service_1 = require("../auth/user/user.service");
const newrelic_1 = require("../newrelic/newrelic");
let EmailService = class EmailService {
    constructor(configService, userService) {
        this.configService = configService;
        this.userService = userService;
        this.agent = (0, newrelic_1.getAgent)();
        this.resend = new resend_1.Resend(this.configService.get('email.resendApiKey', { infer: true }));
    }
    async subscribeUser(userId) {
        var _a;
        const user = await this.userService.mustGetUser(userId);
        if (user.resendContactId) {
            return;
        }
        const audienceId = this.configService.get('email.audienceId', { infer: true });
        if (!audienceId) {
            console.error('No audience ID found');
            return;
        }
        const { data, error } = await this.resend.contacts.create({
            email: user.email,
            audienceId,
            firstName: this.getFirstName(user),
            lastName: (_a = user.lastName) !== null && _a !== void 0 ? _a : '',
        });
        if (error) {
            console.error('Error subscribing user', error);
            return;
        }
        if (!(data === null || data === void 0 ? void 0 : data.id)) {
            console.error('No contact ID found');
            return;
        }
        await this.userService.updateUserResendContactId(userId, data.id);
    }
    async sendWelcomeEmail(userId) {
        const user = await this.userService.mustGetUser(userId);
        const { data, error } = await this.sendEmail({
            to: user.email,
            subject: 'Welcome to Altair GraphQL Cloud',
            html: await (0, emails_1.renderWelcomeEmail)({ username: this.getFirstName(user) }),
        });
        if (error) {
            console.error('Error sending welcome email', error);
        }
        return { data, error };
    }
    async sendGoodbyeEmail(userId) {
        const user = await this.userService.mustGetUser(userId);
        const { data, error } = await this.sendEmail({
            to: user.email,
            subject: 'Sorry to see you go 👋🏾',
            html: `Hey ${this.getFirstName(user)},
      <br><br>
      Samuel here. I noticed you've cancelled your Altair GraphQL pro subscription and wanted to check in.
      <br><br>
      Would you mind sharing what led to your decision? Your feedback helps us make Altair better for everyone. Just hit reply to let me know.
      <br><br>
      If you ever want to come back, we'll be here! And of course, you can keep using Altair's free version as long as you like.
      <br><br>
      Thanks for giving the pro version a try!
      <br><br>
      Best wishes,
      <br>
      Samuel
      <br><br>
      P.S. If you cancelled because of a technical issue or need help with something, just let me know -- I'm happy to help!`,
        });
        if (error) {
            console.error('Error sending goodbye email', error);
        }
        return { data, error };
    }
    async sendEmail({ to, subject, html, }) {
        var _a, _b, _c;
        const { data, error } = await this.resend.emails.send({
            from: (_a = this.configService.get('email.defaultFrom', { infer: true })) !== null && _a !== void 0 ? _a : 'info@mail.altairgraphql.dev',
            to,
            replyTo: this.configService.get('email.replyTo', { infer: true }),
            subject,
            html,
        });
        if (error) {
            (_b = this.agent) === null || _b === void 0 ? void 0 : _b.incrementMetric('email.send.error');
        }
        (_c = this.agent) === null || _c === void 0 ? void 0 : _c.incrementMetric('email.send.success');
        return { data, error };
    }
    getFirstName(user) {
        var _a;
        return (_a = user.firstName) !== null && _a !== void 0 ? _a : user.email;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_service_1.UserService])
], EmailService);
//# sourceMappingURL=email.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUser = mockUser;
exports.mockUserPlan = mockUserPlan;
exports.mockPlanConfig = mockPlanConfig;
exports.mockPrismaConflictError = mockPrismaConflictError;
const client_1 = require("@prisma/client");
function mockUser() {
    return {
        id: 'f7102dc9-4c0c-42b4-9a17-e2bd4af94d5a',
        stripeCustomerId: 'f7102dc9-4c0c-42b4-9a17-e2bd4af94d5a',
        resendContactId: 'f7102dc9-4c0c-42b4-9a17-e2bd4af94d5a',
        email: 'john.doe@email.com',
        firstName: 'John',
        lastName: 'Doe',
        picture: 'asdf',
        isNewUser: false,
        emailVerified: new Date(),
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
function mockUserPlan() {
    return {
        userId: 'f7102dc9-4c0c-42b4-9a17-e2bd4af94d5a',
        planRole: 'my role',
        quantity: 1,
        planConfig: mockPlanConfig(),
    };
}
function mockPlanConfig() {
    return {
        id: 'f7102dc9-4c0c-42b4-9a17-e2bd4af94d5a',
        stripeProductId: 'f7102dc9-4c0c-42b4-9a17-e2bd4af94d5a',
        maxQueryCount: 1,
        maxTeamCount: 1,
        maxTeamMemberCount: 1,
        allowMoreTeamMembers: false,
    };
}
function mockPrismaConflictError() {
    return new client_1.Prisma.PrismaClientKnownRequestError('User already exists', {
        code: 'P2002',
        clientVersion: '1.0.0',
    });
}
//# sourceMappingURL=prisma-service.mock.js.map
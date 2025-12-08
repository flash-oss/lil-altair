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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const nestjs_prisma_1 = require("nestjs-prisma");
const rxjs_1 = require("rxjs");
const app_service_1 = require("./app.service");
const events_jwt_auth_guard_1 = require("./auth/guards/events-jwt-auth.guard");
const events_1 = require("./common/events");
const stripe_service_1 = require("./stripe/stripe.service");
let AppController = class AppController {
    constructor(appService, eventService, prisma, stripeService) {
        this.appService = appService;
        this.eventService = eventService;
        this.prisma = prisma;
        this.stripeService = stripeService;
    }
    goHome(res) {
        return res.redirect('https://altairgraphql.dev');
    }
    getPlans() {
        return this.stripeService.getPlanInfos();
    }
    handleUserEvents(req) {
        var _a;
        const subject$ = new rxjs_1.Subject();
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        const collectionUpdateListener = async ({ id }) => {
            const validUserCollection = await this.prisma.queryCollection.findFirst({
                select: {
                    id: true,
                },
                where: {
                    id,
                    OR: [
                        {
                            workspace: {
                                ownerId: userId,
                            },
                        },
                        {
                            workspace: {
                                team: {
                                    TeamMemberships: {
                                        some: {
                                            userId,
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
            });
            if (validUserCollection) {
                subject$.next({ uid: userId, collectionId: id });
            }
        };
        this.eventService.on([events_1.EVENTS.COLLECTION_UPDATE], collectionUpdateListener);
        const queryUpdateListener = async ({ id }) => {
            var _a;
            const validQueryItem = await this.prisma.queryItem.findFirst({
                where: {
                    AND: {
                        id,
                        collection: {
                            OR: [
                                {
                                    workspace: {
                                        ownerId: userId,
                                    },
                                },
                                {
                                    workspace: {
                                        team: {
                                            TeamMemberships: {
                                                some: {
                                                    userId,
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            });
            if (validQueryItem) {
                subject$.next({ uid: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id, queryId: id });
            }
        };
        this.eventService.on([events_1.EVENTS.QUERY_UPDATE], queryUpdateListener);
        return subject$.pipe((0, rxjs_1.map)((data) => ({ data })));
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "goHome", null);
__decorate([
    (0, common_1.Get)('plans'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPlans", null);
__decorate([
    (0, common_1.UseGuards)(events_jwt_auth_guard_1.EventsJwtAuthGuard),
    (0, common_1.Sse)('events'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], AppController.prototype, "handleUserEvents", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        event_emitter_1.EventEmitter2,
        nestjs_prisma_1.PrismaService,
        stripe_service_1.StripeService])
], AppController);
//# sourceMappingURL=app.controller.js.map
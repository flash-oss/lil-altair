import { AiService } from './ai.service';
import { Request } from 'express';
import { SendMessageDto } from './dto/send-message.dto';
import { RateMessageDto } from './dto/rate-message.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getActiveSession(req: Request): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAllSessions(req: Request): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createSession(req: Request): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getSessionMessages(req: Request, sessionId: string): Promise<{
        id: string;
        sessionId: string;
        message: string;
        role: import("@prisma/client").$Enums.AiChatRole;
        transactionId: string | null;
        sdl: string | null;
        graphqlQuery: string | null;
        graphqlVariables: string | null;
        inputTokens: number | null;
        outputTokens: number | null;
        rating: import("@prisma/client").$Enums.AiChatRating | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    sendMessage(req: Request, sessionId: string, sendMessageDto: SendMessageDto): Promise<{
        response: string;
    }>;
    rateMessage(req: Request, sessionId: string, messageId: string, rateMessageDto: RateMessageDto): Promise<{
        id: string;
        sessionId: string;
        message: string;
        role: import("@prisma/client").$Enums.AiChatRole;
        transactionId: string | null;
        sdl: string | null;
        graphqlQuery: string | null;
        graphqlVariables: string | null;
        inputTokens: number | null;
        outputTokens: number | null;
        rating: import("@prisma/client").$Enums.AiChatRating | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=ai.controller.d.ts.map
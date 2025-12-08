import { CreditService } from 'src/credit/credit.service';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/common/config';
export declare class AiService {
    private readonly creditService;
    private readonly prisma;
    private readonly configService;
    private readonly agent;
    constructor(creditService: CreditService, prisma: PrismaService, configService: ConfigService<Config>);
    createNewActiveSession(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getActiveSession(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getSession(userId: string, sessionId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getSessions(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getSessionMessages(userId: string, sessionId: string, limit?: number): Promise<{
        id: string;
        sessionId: string;
        message: string;
        role: import("@altairgraphql/db").$Enums.AiChatRole;
        transactionId: string | null;
        sdl: string | null;
        graphqlQuery: string | null;
        graphqlVariables: string | null;
        inputTokens: number | null;
        outputTokens: number | null;
        rating: import("@altairgraphql/db").$Enums.AiChatRating | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getOrCreateActiveSession(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    rateMessage({ userId, sessionId, messageId, rating, }: {
        userId: string;
        sessionId: string;
        messageId: string;
        rating: number;
    }): Promise<{
        id: string;
        sessionId: string;
        message: string;
        role: import("@altairgraphql/db").$Enums.AiChatRole;
        transactionId: string | null;
        sdl: string | null;
        graphqlQuery: string | null;
        graphqlVariables: string | null;
        inputTokens: number | null;
        outputTokens: number | null;
        rating: import("@altairgraphql/db").$Enums.AiChatRating | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    sendMessage(userId: string, sessionId: string, messageInput: SendMessageDto): Promise<{
        response: string;
    }>;
    private sendToAI;
    private getChatModel;
}
//# sourceMappingURL=ai.service.d.ts.map
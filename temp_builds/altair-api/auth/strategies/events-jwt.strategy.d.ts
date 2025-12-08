import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { User } from '@altairgraphql/db';
import { AuthService } from '../auth.service';
import { JwtDto } from '../models/jwt.dto';
declare const EventsJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class EventsJwtStrategy extends EventsJwtStrategy_base {
    private readonly authService;
    readonly configService: ConfigService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: JwtDto): Promise<User>;
}
export {};
//# sourceMappingURL=events-jwt.strategy.d.ts.map
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Request } from 'express';

type JwtPayload = {
    sub: string;
    email: string;
};

@Injectable()
export class AcccessTokenStrategiest extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const authHeader = request.header('authorization');
                    
                    if(!authHeader) throw new UnauthorizedException();

                    const data = authHeader.replace('Bearer', '').trim();

                    if (!data) {
                        return null;
                    }

                    return data;
                },
            ]),
            secretOrKey: 'at-secret',
        });
    }

    async validate(payload: JwtPayload) {
        if (!payload) {
            throw new UnauthorizedException();
        }

        return payload;
    }
}
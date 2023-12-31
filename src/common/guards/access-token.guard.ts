import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService, private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        console.log(info)
        if (err || !user) {
            throw new UnauthorizedException('Unauthorized');
        }
        return user;
    }
}

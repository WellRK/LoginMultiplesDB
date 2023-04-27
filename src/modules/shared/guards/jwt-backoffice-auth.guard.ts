import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtBackofficeAuthGuard extends AuthGuard('jwt-backoffice') {

    canActivate(context: ExecutionContext) {
        console.log('context, ' , context)
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        console.log('handlerequest,', err, user, info)

        if (err || !user)
            throw err || new UnauthorizedException();

        return user;
    }
}
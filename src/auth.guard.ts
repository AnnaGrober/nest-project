import {CanActivate, ExecutionContext, Injectable, Request} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    validateRequest(req: Request) {
        return req !== undefined;
    }
}

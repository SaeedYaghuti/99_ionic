import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { mergeMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.getTokenListener().pipe(
            take(1),
            mergeMap(token => {
                const newReq = req.clone({
                    headers: req.headers.set('Authorization', 'Bearer ' + token)
                });
                return next.handle(newReq);
            })
        )
    }

}
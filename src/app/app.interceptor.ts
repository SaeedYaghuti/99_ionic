import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor(
        private alertCtrl: AlertController 
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                console.log('@AppInterceptor Error Occourd err>: ', err);
                this.alertCtrl
                .create({
                    header: 'Error Occourd',
                    subHeader: 'HttpResponce from server',
                    // message:  err.error.errors[0].message || err.message,
                    message:  JSON.stringify(err),
                    buttons: ['OK']
                })
                .then( alertEl => {
                    alertEl.present();
                });
                return throwError(err);
            })
        );
    }

}
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BackendService} from './backend.service';


@Injectable()
export class BackendInterceptor implements HttpInterceptor {

  constructor(private backend: BackendService){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.backend.token !== null){

    const req = request.clone({
      headers: request.headers.set('token', this.backend.token)
    });
    return next.handle(req);
    }
  }
}

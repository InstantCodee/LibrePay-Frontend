import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BackendService} from './backend.service';


@Injectable()
export class BackendInterceptor implements HttpInterceptor {

  constructor(private backend: BackendService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.backend.getToken() !== '') {
      const req = request.clone({
        headers: request.headers.set('token', this.backend.getToken())
      });
      return next.handle(req);
    }
    return next.handle(request);
  }
}

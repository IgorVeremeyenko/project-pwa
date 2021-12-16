import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    request = request.clone({ headers: request.headers.set('Accept', '*/*') });
    request = request.clone({ headers: request.headers.set(
      'Access-Control-Allow-Origin', ['https://elite-service-92d53.web.app', 'http://localhost:4200/', '*']
    ) });
    return next.handle(request);
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';
import { API_ENDPOINT } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.auth.userCredentials?.token;

    const route   = req.url;
    const request = req.clone({
      setHeaders: {authorization: `Bearer ${authToken}`},
      url: API_ENDPOINT + route
    });

    return next.handle(request);
  }
}

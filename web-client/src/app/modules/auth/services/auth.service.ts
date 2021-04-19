import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT, USER_TOKEN_COOKIE_LIFETIME } from '@shared/constants';
import { Observable } from 'rxjs';
import { ApiAuthParam, ApiAuthResponse } from 'src/app/modules/auth/models/api-auth';
import { getCookie, setCookie } from '@shared/models/cookies-utils';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  signIn(user: ApiAuthParam): Observable<ApiAuthResponse> {
    return this.http.post<ApiAuthResponse>(API_ENDPOINT + 'auth/', user).pipe(
      tap(response => setCookie('user_token', response.token, USER_TOKEN_COOKIE_LIFETIME))
    );
  }

  isAuthenticated(): boolean {
    return this.getAuthorizationToken() !== undefined;
  }

  getAuthorizationToken(): string | undefined {
    return getCookie('user_token');
  }
}

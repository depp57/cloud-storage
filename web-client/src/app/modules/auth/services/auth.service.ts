import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT, USER_TOKEN_COOKIE_LIFETIME } from '@shared/constants';
import { Observable } from 'rxjs';
import { ApiAuthParam, ApiAuthResponse } from 'src/app/modules/auth/models/api-auth';
import { getCookie, setCookie } from '@shared/models/cookies-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  signIn(user: ApiAuthParam): Observable<ApiAuthResponse> {
    const response = this.http.post<ApiAuthResponse>(API_ENDPOINT + 'auth/', user);

    response.subscribe(authResponse => {
      if (authResponse.error === 'no-error') { // TODO if there is no error
        setCookie('user_token', authResponse.token, USER_TOKEN_COOKIE_LIFETIME);
      }
    });

    return response;
  }

  isAuthenticated(): boolean {
    return getCookie('user_token') !== undefined;
  }
}

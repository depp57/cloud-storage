export interface ApiAuthResponse {
  readonly token: string;
  readonly error: string;
}

export interface ApiAuthParam {
  readonly username: string;
  readonly password: string;
}

export class UserCredentials {
  readonly username: string;
  readonly token: string;

  constructor(username: string, token: string) {
    this.username = username;
    this.token    = token;
  }

  get asJson(): string {
    return JSON.stringify(this);
  }

  static fromJson(json: string): UserCredentials {
    return JSON.parse(json);
  }
}

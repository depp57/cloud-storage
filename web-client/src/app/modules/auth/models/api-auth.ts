export interface ApiAuthResponse {
  token: string;
  error: string;
}

export interface ApiAuthParam {
  username: string;
  password: string;
}

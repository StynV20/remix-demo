export interface Response {
  access_token: string;
  id_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

export interface Identity {
  connection: string;
  provider: string;
  user_id: string;
  isSocial: boolean;
}

export interface User {
  clientID: string;
  created_at: string;
  email: string;
  email_verified: boolean;
  identities: Identity[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  user_metadata: {};
  app_metadata: {};
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
}

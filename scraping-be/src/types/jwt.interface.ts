export interface JwtPayload {
  username: string;
  userId: string | number;
  iat: number;
  exp: number;
}

export interface Decode {
  valid: Boolean;
  expired: Boolean;
  decoded: JwtPayload | null;
}

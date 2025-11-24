export interface JwtPayload {
  email: string;
  sub: string;
  enterpriseId: string;
  role: string;
  iat?: number;
  exp?: number;
}

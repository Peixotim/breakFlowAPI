export interface JwtPayload {
  mail: string;
  sub: string;
  enterpriseId: string;
  role: string;
  iat?: number;
  exp?: number;
}

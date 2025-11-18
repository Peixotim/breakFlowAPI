export interface ResetTokenPayload {
  sub: string;
  email: string;
  purpose: string;
  iat?: number;
  exp?: number;
}

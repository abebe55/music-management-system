// Validated via auth.validation.ts loginSchema — Joi enforces shape at runtime
export interface LoginDto {
  email: string;
  password: string;
}

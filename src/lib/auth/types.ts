export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_DISABLED"
  | "REFRESH_TOKEN_INVALID"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;

  constructor(message: string, code: ApiErrorCode = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  code?: ApiErrorCode;
  data?: T;
};

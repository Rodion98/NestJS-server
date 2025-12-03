export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  code?: string;
  error?: string;
  details?: unknown;
  timestamp?: string;
  path?: string;
  stack?: string;
}

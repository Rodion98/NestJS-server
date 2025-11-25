export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(params: { code: string; message: string; statusCode: number; details?: unknown }) {
    super(params.message);

    this.code = params.code;
    this.statusCode = params.statusCode;
    this.details = params.details;

    // фикс прототипа, чтобы instanceof работал
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
  }
}

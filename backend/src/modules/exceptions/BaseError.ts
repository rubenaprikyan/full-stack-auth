export class BaseError extends Error {
  constructor(
    protected details: string,
    public message: string,
    protected statusCode: number,
  ) {
    super();
    this.details = details;
    this.message = message;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  // to override
  public getError() {
    return {
      details: this.details,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

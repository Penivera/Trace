/** A non-2xx response from the backend. */
export class ApiError extends Error {
  override readonly name = "ApiError";

  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }
}

/** The backend responded, but the payload did not match the expected schema. */
export class ApiContractError extends Error {
  override readonly name = "ApiContractError";

  constructor(
    readonly path: string,
    readonly issues: unknown,
  ) {
    super(`Response from ${path} did not match the expected schema`);
  }
}

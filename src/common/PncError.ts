type PNC_ERROR_CODE = 'NEW_ENTITY_ID_ERROR';

export class PncError extends Error {
  readonly code: PNC_ERROR_CODE;

  constructor({ code, message }: { code: PNC_ERROR_CODE; message: string }) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

export const isPncError = (error: Error): boolean => {
  return error instanceof PncError;
};

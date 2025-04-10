import { StatusCodes } from "http-status-codes";

export interface IErrorResponse {
  message: string;
  status: string;
  statusCode: number;

  serializeErrors(): IError;
}

export interface IError {
  message: string;
  status: string;
  statusCode: number;
}

export abstract class CustomerError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

export class BadRequest extends CustomerError {
  status: string = "errror";
  statusCode: number = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}

export class NotFound extends CustomerError {
  status: string = "errror";
  statusCode: number = StatusCodes.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}

export class InternalServerError extends CustomerError {
  status: string = "errror";
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super(message);
  }
}

export class JoyiValidation extends CustomerError {
  status: string = "errror";
  statusCode: number = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}

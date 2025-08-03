import { HttpException } from "./httpException";

export class BadReqException extends HttpException {
  constructor(message: string) {
    super(message, 400);
  }
}

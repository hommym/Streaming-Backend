

import { HttpException } from "./httpException";

export class UnauthReqException extends HttpException {
  constructor(message: string) {
    super(message, 401);
  }
}

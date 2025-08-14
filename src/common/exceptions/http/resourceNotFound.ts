

import { HttpException } from "./httpException";

export class ResourceNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, 404);
  }
}

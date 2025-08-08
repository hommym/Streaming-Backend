



import { HttpException } from "./httpException";

export class ResourceConflict extends HttpException {
  constructor(message: string) {
    super(message, 409);
  }
}

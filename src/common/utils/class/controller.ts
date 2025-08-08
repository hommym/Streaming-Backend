import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { BadReqException } from "../../exceptions/http/badReq";

export class Controller {
  private  router = Router();

  // Overload for routes without DTO validation
  public addRoute<R>(method: RouteType, path: string, serviceMethod: (arg1: undefined, req: Request) => Promise<R> | R): void;
  // Overload for routes with DTO validation
  public addRoute<T extends object, R>(method: RouteType, path: string, serviceMethod: (arg1: T, req: Request) => Promise<R> | R, dtoType: ClassConstructor<T>): void;
  // Implementation
  public addRoute<T extends object, R>(method: RouteType, path: string, serviceMethod: (arg1: T | undefined, req: Request) => Promise<R> | R, dtoType?: ClassConstructor<T>): void {
    this.router[method](
      path,
      asyncHandler(async (req: Request, res: Response) => {
        let dtoInstance: T | undefined = undefined;
        if (dtoType) {
          dtoInstance = plainToInstance(dtoType, req.body ?? {}, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });
          const errors = await validate(dtoInstance);
          if (errors.length > 0) {
            throw new BadReqException("Invalid Request Body");
          }
        }

        const result = await serviceMethod(dtoInstance as T, req);
        if (typeof result === "undefined") {
          res.status(204).end();
          return;
        }
        res.json(result);
      })
    );
  }

 
  public getRouter() {
    return this.router;
  }
}

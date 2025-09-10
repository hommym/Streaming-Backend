import "express";
import { User } from "../database/models/user";

declare module "express" {
  export interface Request {
    user?: User;
  }
}

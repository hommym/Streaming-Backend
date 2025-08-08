import { Request } from "express";
import { User } from "../../../database/models/user";


export interface RequestWithContext extends Request{

     user:User;


}
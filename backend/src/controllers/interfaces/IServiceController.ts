import { Request, Response } from "express";


export default interface IServiceController{

 listServices(req:Request,res:Response):Promise<void>;
 createService(req:Request,res:Response):Promise<void>;

}

import { Response,Request,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
export function authMiddleware(req:Request,res:Response,next:NextFunction){
   const token=req.headers.authorization as unknown as string;
   try{
    const payload = jwt.verify(token,JWT_PASSWORD);
    //@ts-ignore
    req.id=payload.id
    next();
   }
   catch(err){
      return res.status(403).json({
        message:'your are not logged In!'
      })
   }
}
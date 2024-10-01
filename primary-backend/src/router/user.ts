import {Router} from 'express'
import { signinSchema, signupSchema } from '../types';
import { prismaClient } from '../db';
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from '../config';
import { authMiddleware } from '../middleware';
const router=Router();



router.post("/signup",async (req:any,res:any) =>{
    const body=req.body;
    const parseData=signupSchema.safeParse(body);
    if(!parseData.success){
        return res.status(401).json({
         message:'Incorrect Inputs!'
        })
    }
    const userExist = await prismaClient.user.findFirst({
      where:{
        email:parseData.data?.username
      }
    });

    if(userExist){
        return res.status(403).json({
            message:'user exist!'
        })
    }
    await prismaClient.user.create({
        data:{
         email:parseData.data?.username,
         //todo:user salt to hash password  
         password:parseData.data?.password,
         name:parseData.data?.name,
        }
    })
    return res.json({
        message:'User created!'
    });        
    
})

router.post("/signin",async (req:any,res:any)=>{
    const body=req.body;
    const parseData=signinSchema.safeParse(body);
    console.log(parseData);
    if(!parseData.success){
        return res.status(401).json({
            message:'Incorrect Inputs!'
        })
    }
        const user=await prismaClient.user.findFirst({
            where:{
                email:parseData.data?.username,
                password:parseData.data?.password
            }
        })
        if(!user){
            return res.status(401).json({
                message:'user does not exist'
            })
        }
        const token=jwt.sign({
            id:user.id
        }, JWT_PASSWORD )
        return res.status(200).json({
            message:'Sign in sucsess',
            token,
        })
})
//@ts-ignore
router.get("/",authMiddleware , async(req,res)=>{
    //@ts-ignore
    const id=req.id;
    const user=await prismaClient.user.findFirst({
        where:{
            id,
        },
        select:{
            name:true,
            email:true
        }
    });
    return res.json({
      user
    });
});

export const userRouter=router;
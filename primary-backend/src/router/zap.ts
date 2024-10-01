import { Router } from "express";
import { prismaClient } from "../db";
import { ZapcreateSchema } from "../types";
import { authMiddleware } from "../middleware";

const router=Router();
  //@ts-ignore
router.post("/",authMiddleware ,async(req,res)=>{
      //@ts-ignore
      const id =req.id as string;
      const body=req.body;
      const parseData=ZapcreateSchema.safeParse(body);
      if(!parseData.success){
        return res.status(411).json({
            message:'Incorrect Inputs'
        })
      }
    console.log(1);
    const zapid= await prismaClient.$transaction(async tx=>{
        const zap=await prismaClient.zap.create({
            data:{
                userId:parseInt(id),
                triggerId:"",
                actions:{
                    create:parseData.data.actions.map((x,index)=>({
                        actionId:x.availableAction,
                        sortingOrder:index,
                        metadata:x.actionMetaData
                    }))
                }
            }
        })
        const trigger =await tx.trigger.create({
            data:{
                triggerId:parseData.data.availableTriggerId,
                zapId:zap.id
            }
        });
        console.log(2);

        await tx.zap.update({
            where:{
                id:zap.id
            },
            data:{
                triggerId:trigger.id
            }
        })
        return zap.id;
    })
    return res.json({
        zapid
    })
})

//@ts-ignore
router.get("/",authMiddleware,async(req,res)=>{
   //@ts-ignore
    const id=req.id;
    const zaps =await prismaClient.zap.findMany({
        where:{
            userId:id,
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
        trigger:{   
            include:{
                type:true
            }
        }
        }
    })
    return res.json({
        zaps
    })
})

//@ts-ignore
router.get("/:zapId",authMiddleware,async(req,res)=>{
   //@ts-ignore
    const id=req.id;
    const zapId=req.params.id;

    const zap=await prismaClient.zap.findFirst({
        where:{
            id:zapId,
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })

    return res.json({
        zap
    })
})
export const zapRouter=router;
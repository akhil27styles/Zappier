import { useRouter } from "next/router"
import { LinkButton } from "./buttons/LinkButton";

export const Appbar=()=>{
    const router=useRouter();
    return <div className="flex border-b justify-between">
        <div>
            Zapier
        </div>
        <div>
            <LinkButton onClick={()=>{}}>Contact sales</LinkButton>
            <LinkButton onClick={()=>router.push("/login")}>Login</LinkButton>
        </div>
    </div>
}
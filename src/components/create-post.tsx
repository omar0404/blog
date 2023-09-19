import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import React,{useState} from "react";
import { api } from "~/utils/api";

const CreatePost = () => {
    const [value,setValue] = useState('')
   const {user} =  useUser();
   const ctx = api.useContext()
   const {mutate,isLoading} = api.post.create.useMutation({onSuccess() {
    setValue('');
    ctx.post.getAll.invalidate()
   }})
   if(!user)
    return <div />
    return (
        <div className="flex flex-1 items-center">
            <Image className="rounded-2xl" width={30} height={30} alt="avatar" src={user?.imageUrl || ""} />
            <input disabled={isLoading} onChange={e => setValue(e.target.value)} className="flex-1 outline-none ml-3 bg-transparent" placeholder="Write post" />
            <button
            onClick={() => mutate({content:value})}
            >Post</button>
        </div>
    )
}
export {CreatePost}
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import React,{useState} from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const CreatePost = () => {
    const [value,setValue] = useState('')
   const {user} =  useUser();
   const ctx = api.useContext()
   const {mutate,isLoading} = api.post.create.useMutation({onSuccess() {
    setValue('');
    ctx.post.getAll.invalidate()
   },onError(){
    toast.error('Failed to post !')
   }})
   if(!user)
    return <div />
    return (
        <div className="flex flex-1 items-center">
            <Image className="rounded-2xl" width={30} height={30} alt="avatar" src={user?.imageUrl || ""} />
            <input value={value} disabled={isLoading} onChange={e => setValue(e.target.value)} className="flex-1 outline-none ml-3 bg-transparent" placeholder="Write post" />
            <button
            onClick={() => mutate({content:value})}
            >Post</button>
        </div>
    )
}
export {CreatePost}
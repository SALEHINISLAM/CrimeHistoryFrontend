import React from 'react'
import UserProfile from './components/UserProfile'
import { useGetMeQuery } from '../redux/features/users/user.api'
import CrimePostFeed from './components/CrimePostFeed'
import CreateCrimePost from './components/CreateCrimePost'
import { useAppSelector } from '../redux/hooks'
import { useCurrentUser } from '../redux/features/auth/AuthSlice'

export default function Profile() {
    const userInfo = useGetMeQuery()
    console.log(userInfo.data)
    const user= useAppSelector(useCurrentUser)
    console.log(user)
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="md:w-[30%] md:sticky md:top-0 md:h-fit md:overflow-y-auto">
                {
                    userInfo ? <UserProfile user={userInfo.data?.data} /> : <div className="flex w-52 flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4">
                                <div className="skeleton h-4 w-20"></div>
                                <div className="skeleton h-4 w-28"></div>
                            </div>
                        </div>
                        <div className="skeleton h-32 w-full"></div>
                    </div>
                }
            </div>
            <div className="w-full">
                <div className="px-12 mt-2">
                    <button className="btn w-full" onClick={() => document.getElementById('create-crime-post').showModal()}>Create Post</button>
                    <dialog id="create-crime-post" className="modal">
                        <div className="modal-box max-h-[90vh]">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-1 text-red-500 border border-black">✕</button>
                            </form>
                            <CreateCrimePost /> 
                        </div>
                    </dialog>
                </div>
                <CrimePostFeed user_id={userInfo.data?.data?.user_id}/>
            </div>
        </div>
    )
}

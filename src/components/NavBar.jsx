import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { logout, useCurrentUser } from '../redux/features/auth/AuthSlice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'

export default function NavBar() {
    const dispatch =useAppDispatch()
    const navigate=useNavigate()
    const user=useAppSelector(useCurrentUser)

    const handleLogOut=async ()=>{
        await dispatch(logout())
        if (user) {
            toast.error("Something went wrong")
        }
        navigate('/')
        toast.success('Logged out successfully')
    }
    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><a>Item 1</a></li>
                        <li>
                            <a>Parent</a>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">3rd Eye</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Item 1</a></li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a>Item 3</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <button onClick={handleLogOut} className="btn">Logout</button>
            </div>
        </div>
    )
}

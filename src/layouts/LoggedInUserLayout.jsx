import React from 'react'
import { Navigate, Outlet } from 'react-router'
import NavBar from '../components/NavBar'
import { useAppSelector } from '../redux/hooks';
import { useCurrentUser } from '../redux/features/auth/AuthSlice';

export default function LoggedInUserLayout() {
    const user = useAppSelector(useCurrentUser); // Get current user from Redux

    return user ? <div className='p-4 container mx-auto'>
        <NavBar />
        <Outlet />
    </div> : <Navigate to="/" replace />;

}

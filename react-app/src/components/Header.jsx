import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../Services/authServices'



export default function Header() {
    const { user }=useAuth();
    return (
        <div>
            <nav className= 'shadow  bg-blue-100 px-4 flex justify-between items-center'>

                <div className='m-2'>
                    <h1 className=' text-violet-400 font-bold text-xl px-2'>Chat-Bot</h1>
                    <p className=' capitalize text-stone-800 font-semibold'>enjoy to chat with ai</p>
                </div>



                <div>

                    { user ? (
                        <div className='flex  flex-col items-center'>
                            <p className='text-violet-400 text-md font-semibold'>Welcome, {user.displayName || user.email}</p>
                            <button  className=' cursor-pointer shadow text-sm p-2 px-4  rounded-2xl bg-blue-300  hover:bg-blue-400 transition-colors font-semibold' onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <p className='text-lg font-semibold text-gray-800'>Please <span className=' text-violet-400'>Log In</span> </p>
                    )}
                </div>

            </nav>
        </div>
    )
}

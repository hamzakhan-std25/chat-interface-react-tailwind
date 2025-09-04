import { useState } from 'react';
import { useAuth } from '../contexts/authContext'
import { logout } from '../Services/authServices';
import { FiArrowLeft, FiArrowRight, FiMenu } from 'react-icons/fi'



export default function Header() {
    const [sideIn, setSideIn] = useState(false);



    const { user } = useAuth();

    console.log('User firebase :', user)
    return (
        <>
            <span
                onClick={() => setSideIn(true)}
                className={`fixed h-20 sm:-left-2 hover:left-0 w-4 rounded-2xl float-end  flex justify-center items-center bg-blue-200  transition-all cursor-pointer`} >
                &gt;
            </span>


            <div className={`max-w-[300px] shadow  bg-blue-100 flex flex-col justify-between items-center  h-screen fixed top-0 z-50 transition-all ${sideIn ? "left-0 " : "-left-full"}  `}>

                <div className='m-2'>
                    <div className='flex items-center justify-center'>


                        {sideIn && <span
                            onClick={() => setSideIn(false)}

                            className={`fixed h-20 sm:-left-2 left-0 w-4 rounded-2xl float-end  flex justify-center items-center bg-blue-200  hover:left-0 transition-all cursor-pointer`} >
                            &lt;
                        </span>}

                        <h1 className=' text-violet-400 font-bold text-xl p-4  '>Chat-Bot</h1></div>
                    <p className=' capitalize text-stone-800 font-semibold'>enjoy to chat with ai</p>
                </div>



                <div>

                    {user ? (
                        <div className='p-4'>
                            <div className='flex  flex-col items-center mb-4 border-t border-gray-400'>
                            <p className='text-violet-400 text-md font-semibold p-4'>Welcome, {user.displayName || user.email}</p>
                            <p className=' text-sm p-4'>uid: {user.uid}, </p>
                            <button className=' cursor-pointer shadow text-sm p-2 px-4  rounded-2xl bg-blue-300  hover:bg-blue-400 transition-colors font-semibold' onClick={logout}>Logout</button>
                        </div>
                        </div>
                    ) : (
                        <p className='text-lg font-semibold text-gray-800'>Please <span className=' text-violet-400'>Log In</span> </p>
                    )}
                </div>


            </div>

        </>
    )
}

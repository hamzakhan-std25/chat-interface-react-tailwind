import { useState } from 'react';
import { useAuth } from '../contexts/authContext'
import { logout } from '../Services/authServices';
import { FiArrowLeft, FiMenu } from 'react-icons/fi'



export default function Header() {
    const [sideIn, setSideIn] = useState(false);



    const { user } = useAuth();
    return (
        <>
            <FiMenu
                onClick={() => setSideIn(true)}

                className={`fixed text- bg-blue-200 text-5xl rounded-2xl m-2 p-2 hover:scale-110 transition-all cursor-pointer`} />


            <div className={`max-w-[300px] shadow  bg-blue-100 flex flex-col justify-between items-center  h-screen fixed top-0 z-50 transition-all  ${sideIn ? "left-0 " : "-left-full"}  `}>

                <div className='m-2'>
                    <div className='flex items-center justify-center'> 

                        {
                            sideIn &&  <FiArrowLeft onClick={()=>{setSideIn(!sideIn)}}
                            className='text-4xl p-2 bg-gray-300 rounded-2xl fixed left-0 hover:scale-110 transition-all' />
                        }
                        <h1 className=' text-violet-400 font-bold text-xl p-4 '>Chat-Bot</h1></div>
                    <p className=' capitalize text-stone-800 font-semibold'>enjoy to chat with ai</p>
                </div>



                <div>

                    {user ? (
                        <div className='flex  flex-col items-center mb-4'>
                            <p className='text-violet-400 text-md font-semibold p-4'>Welcome, {user.displayName || user.email}</p>
                            <button className=' cursor-pointer shadow text-sm p-2 px-4  rounded-2xl bg-blue-300  hover:bg-blue-400 transition-colors font-semibold' onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <p className='text-lg font-semibold text-gray-800'>Please <span className=' text-violet-400'>Log In</span> </p>
                    )}
                </div>


            </div>

        </>
    )
}

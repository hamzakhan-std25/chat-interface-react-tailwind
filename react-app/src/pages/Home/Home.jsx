import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className=' bg-stone-300 p-8  text-center mb-4'>
      <h1 className='text-2xl font-bold text-cyan-600 shadow p-4 bg-cy'>Welcome to my Chat Bot website...</h1>
      <p className='p-4 text-lg '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque est illo amet itaque consequuntur dolorem maiores ullam, dolorum voluptatum ea? Neque explicabo quidem pariatur repudiandae obcaecati dolorum, eveniet praesentium magnam.</p>

      <div className='flex gap-4 justify-center items-center'>

        <Link to="/login">
          <div className=' inline-block bg-lime-600 p-2 px-6 cursor-pointer hover:bg-lime-700 transition-colors text-white font-bold  rounded-2xl'>
            Log In
          </div>
        </Link>
        <Link to="/signup">
          <div className=' inline-block bg-lime-600 p-2 px-6 cursor-pointer hover:bg-lime-700 transition-colors text-white font-bold  rounded-2xl'>
            Sign Up
          </div>
        </Link>
      </div>

    </div>
  )




}
 
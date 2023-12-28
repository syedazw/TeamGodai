import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


const Navbar = () => {
  return (
    <>
    <div className='h-12 my-8 flex items-center justify-center '>
    <div><Image src='/logo-ma.png'  width={100}
      height={100} 
      alt="Picture of the author"></Image></div>
   </div>
    <div className='text-lg text-white flex gap-10 items-center justify-center '>
      <Link className='hover:text-gray-300' href="/Home"> Home </Link>
      <Link className='hover:text-gray-300' href="/Service"> Services </Link>
      <Link className='hover:text-gray-300' href="/About"> About </Link>
      <Link className='hover:text-gray-300' href="/Contact"> Contact Us </Link>
    </div>
     
    </>
  )
}

export default Navbar

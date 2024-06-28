import React from 'react'
import { Link } from 'react-router-dom'

const Navbar_main = () => {
  return (
    <section className='relative z-10 text-white bg-gray-900'>
      <div className='w-full'>
        <div className='flex items-center justify-between mx-5 sm:mx-10 lg:mx-20'>
          {/* Logo 누르면 메인페이지로 이동 */}
          <div className='flex items-center text-xl h-14'>
            <Link to="/">아이조</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Navbar_main

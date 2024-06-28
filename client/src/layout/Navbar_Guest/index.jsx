import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NavItem from './Sections/NavItem';

const Navbar_Guest = () => {
  const [menu, setMenu] = useState(false);

  // useState가 false면 true로, true면 false로 -> toggle
  const handleMenu = () => {
    setMenu(!menu);
  }

  return (
    <section className='relative z-10 text-white bg-gray-900'>
      <div className='w-full'> {/* full로 사용 */}
        <div className='flex items-center justify-between mx-5 sm:mx-10 lg:mx-20'>
          {/* Logo 누르면 메인페이지로 이동 */}
          <div className='flex items-center text-xl h-14'>
            <Link to="/">아이조</Link>
          </div>

          {/* Menu 버튼 */}
          <div className='text-2xl sm:hidden'>
            <button onClick={handleMenu}>
              {menu ? "-" : "+"}
            </button>
          </div>

          {/* 큰 사이즈 화면일 때 */}
          {/* 원래는 hidden(기본값)이다가 사이즈가 small보다 클 때 block으로 바뀌고 NavItem들을 보여줌 */}
          <div className='hidden sm:block'>
            <NavItem />
          </div>

        </div>

        {/* 작은 사이즈 화면일 때 */}
        {/* 원래는 blcok인데 사이즈가 small보다 클 때 hidden으로 바뀌고 NavItem들을 보여줌 */}
        {/* menu가 true일 때만("+"를 눌렀을 때만!!) 보여줌 */}
        <div className='block sm:hidden'>
          {menu && <NavItem mobile />}
        </div>

      </div>
    </section>
  )
}

export default Navbar_Guest
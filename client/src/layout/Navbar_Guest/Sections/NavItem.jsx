import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../redux_store/thunkFunc';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const routes = [
  {to: '/login', name: '로그인', auth: false},
  {to: '/register', name: '회원가입', auth: false},
  {to: '', name: '로그아웃', auth: true}, // 로그인 된 사람만 볼 수 있음
  {
    to: '/user/cart', name:'카트', auth: true,
    icon:<AiOutlineShoppingCart style={{ fontsize: '1.4rem' }} />
  },
  {to: '/history', name: '예약조회', auth: true}
]

const NavItem = ({ mobile }) => {
  const isAuth = useSelector(state => state.user?.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () =>{
    dispatch(logoutUser()) // thukfunc
      .then(() => {
        navigate('/login'); // 로그아웃하면 로그인페이지로 이동
      }) 
  }

  return (
    <ul className={`text-md justify-center w-full flex gap-4 ${mobile && "flex-col bg-gray-900 h-full"} items-center`}>
      {/* map()을 이용해서 하나씩 순회시키면서 하나씩 조건에 맞는 것을 랜더링 */}
      {/* destructing해서 위에서 to, name, auth 가져옴 */}
      {routes.map(({to, name, auth, icon }) => {
        if (isAuth !== auth) return null;

        {/* 리액트에서는 map 매소드로 하나씩 순회를 할 때, unique한 key값이 있어야 함 */}
        if(name === '로그아웃') {
          return <li key={name} className='py-2 text-center border-b-4 cursor-pointer'>
            <Link
              onClick={handleLogout}
            >
              {name}
            </Link>
          </li>
        } else if (icon) { // (카트)icon이 있을 때
          return <li className='relative py-2 text-center border-b-4 cursor-pointer'>
            <Link to={to}>
              {icon}
              <span className='absolute top-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -right-3'>
                {1}
              </span>
            </Link>
          </li>

        } else {
          return <li key={name} className='py-2 text-center border-b-4 cursor-pointer'>
          <Link to={to}>
            {name}
          </Link>
        </li>
        }
      })}

    </ul>
  )
}

export default NavItem
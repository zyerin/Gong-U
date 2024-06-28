import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// 로그인 안 한 사람이 로그인된 사람만 들어갈 수 있는 페이지에 들어갈 때, 못 들어가게 함
const LoginUserRoutes = ({ isAuth }) => {
  // isAuth가 true(로그인o) 라면 Outlet을 이용
  // isAuth가 false(로그인x) 라면 /login 으로 이동하게 함 -> Navigate to
  return (
    isAuth ? <Outlet /> : <Navigate to={'/login'} />
  )
}

export default LoginUserRoutes
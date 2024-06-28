import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// 로그인이 된 사람(isAuth = true)이 회원가입이나 로그인 페이지에 들어가려고 할 때 '/'로 리다이렉트 -> Navigate to 이용
// 로그인 안한 사람(isAuth = false)라면 Outlet 이용
const NotAuthRoutes = ({ isAuth }) => {
  return (
    isAuth ? <Navigate to={'/'} /> : <Outlet />
  )
}

export default NotAuthRoutes
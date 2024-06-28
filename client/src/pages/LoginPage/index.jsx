import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../redux_store/thunkFunc'
import logo from '../../images/logo.jpg';
import { LuUserCheck } from "react-icons/lu";

const LoginPage = () => {
  
  const{
    register, 
    handleSubmit, 
    formState: {errors}, 
    reset
  } = useForm({mode: 'onChange'})

  // useDispatch 위에서 import 해줌줌
  const dispatch = useDispatch(); // useDispatch 객체를 dispatch로 재선언하여 사용

  // onSubmit는 로그인 버튼 누르면 호출됨
  // 로그인 할 때는 이메일, 비밀번호만 받아서 백앤드로 보내주면 됨
  const onSubmit = ({email, password}) => {
    const body = {
      email,
      password
    };

    // function 형태의 action을 dispatch 통해 호출하고, store에 전달, 상태 업데이트 해줌
    // thuck함수: loginUser() -> thunkFunc.js에서 호출
    dispatch(loginUser(body));
    
    reset();
  }

// 유효성 체크
const userEmail = {
  required:"필수 요소입니다."
}

const userPassword = {
  required:"필수 요소입니다.",
  minLength:{
    value: 5,
    message: "최소 5자입니다."
  }
}

// <h1 className='flex justify-center mb-5'><div className='text-2xl'></div><div className='text-md font-light ml-2'>Welcome! Please log in.</div></h1>
return (
  <section className='flex flex-col justify-center items-center mt-20 max-w-md mx-auto'>
    <div className='p-10 bg-white rounded-xl shadow-xl'>
    <div className='flex justify-center'>
        <img src={logo} alt='아이조 로고' className='w-40 h-10 mb-6 object-contain' />
    </div>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-sm font-semibold text-gray-800 mb-2'
          >Email</label>
          <input
            type='email'
            id='email'
            className='w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500'
            {...register('email', userEmail)}
          />
          {
            errors?.email &&
            <div className='mt-0'>
              <span className='text-red-500 text-xs'>
                {errors.email.message}
              </span>
            </div>
          }
        </div>

        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-sm font-semibold text-gray-800 mb-2'
          >Password</label>
          <input
            type='password'
            id='password'
            className='w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500'
            {...register('password', userPassword)}
          />
          {
            errors?.password &&
            <div className='mt-0'>
              <span className='text-red-500 text-xs'>
                {errors.password.message}
              </span>
            </div>
          }
        </div>

        <div className='mt-6'>
          <button type='submit' className='w-full mt-2 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200'>
            로그인
          </button>
        </div>

        <p className='mt-8 text-xs font-light text-center text-gray-800'>
          아이디가 없다면?{" "}
          <a
            href='/register'
            className='font-normal text-gray-800 hover:text-black hover:font-semibold underline transition duration-200'
          >
            회원가입
          </a>
        </p>
      </form>
    </div>
  </section>
)
}

export default LoginPage
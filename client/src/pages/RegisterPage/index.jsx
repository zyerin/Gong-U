import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux_store/thunkFunc';
import { CiWallet } from "react-icons/ci";
import logo from '../../images/logo.jpg';


const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ mode: 'onChange' })

  const dispatch = useDispatch();

  const [walletAddress, setWalletAddress] = useState('');

  // 회원가입 버튼 누르면 호출됨
  const onSubmit = ({ email, password, name }) => {
    const body = {
      email,
      password,
      name,
      image: `https://via.placeholder.com/600x400?text=no+user+image`,
      wallet: walletAddress,
    };
    dispatch(registerUser(body));

    // 회원가입 완료 후 필드 초기화
    reset();
    setWalletAddress(''); 
  };

  // Kaikas 지갑 연결
  const connectKaikasWallet = async () => {
    if (window.klaytn) {
      try {
        await window.klaytn.enable();
        const wallet = window.klaytn.selectedAddress;
        setWalletAddress(wallet || ''); // wallet이 undefined일 경우 빈 문자열로 설정
      } catch (error) {
        console.error('Error connecting to Kaikas:', error);
      }
    } else {
      console.error('Kaikas wallet is not installed.');
    }
  };

  // 유효성 체크
  const userEmail = {
    required: "필수 필드입니다."
  }
  const userName = {
    required: "필수 필드입니다."
  }
  const userPassword = {
    required: '필수 필드입니다.',
    minLength: {
      value: 6,
      message: "최소 6자입니다."
    }
  }
  


  return (
    <section className='flex flex-col justify-center mt-2 max-w-[400px] m-auto'>
      <div className='p-6 bg-white rounded-md shadow-md'>
      <div className='flex justify-center'>
        <img src={logo} alt='아이조 로고' className='w-40 h-10 mb-6 object-contain' />
      </div>
        <form className='mt-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label htmlFor='email' className='text-sm font-semibold text-gray-800 mb-2'>Email</label>
            <input
              type='email'
              id='email'
              className='w-full px-4 py-2 mt-2 bg-gray-50 border rounded-md'
              {...register('email', userEmail)}
            />
            {errors?.email && <div><span className='text-red-500 text-sm'>{errors.email.message}</span></div>}
          </div>

          <div className='mb-2'>
            <label htmlFor='name' className='text-sm font-semibold text-gray-800 mb-2'>Nick Name</label>
            <input
              type='text'
              id='name'
              className='w-full px-4 py-2 mt-2 bg-gray-50 border rounded-md'
              {...register('name', userName)}
            />
            {errors?.name && <div><span className='text-red-500 text-sm'>{errors.name.message}</span></div>}
          </div>

          <div className='mb-2'>
            <label htmlFor='password' className='text-sm font-semibold text-gray-800 mb-2'>Password</label>
            <input
              type='password'
              id='password'
              className='w-full px-4 py-2 mt-2 bg-gray-50 border rounded-md'
              {...register('password', userPassword)}
            />
            {errors?.password && <div><span className='text-red-500 text-sm'>{errors.password.message}</span></div>}
          </div>

          <div className='mb-2'>
            <label htmlFor='wallet' className='text-sm font-semibold text-gray-800 mb-2'>Wallet Address</label>
            <div className='flex'>
              <input
                type='text'
                id='wallet'
                className='w-full px-4 py-2 mt-2 bg-gray-50 border rounded-md'
                value={walletAddress}
                readOnly
                {...register('wallet', { required: '필수 필드입니다.' })}
              />
              <button
                type='button'
                className='ml-2 px-4 py-2 mt-2 bg-white text-black rounded-md flex items-center justify-center'
                onClick={connectKaikasWallet}
              >
                <CiWallet size={30} /> {/* 지갑 아이콘 추가 */}
              </button>
            </div>
            {errors?.wallet && <div><span className='text-red-500 text-sm'>{errors.wallet.message}</span></div>}
          </div>

          <div className='mt-6'>
            <button type='submit' className='w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 duration-200'>
              회원가입
            </button>
          </div>

          <p className='mt-8 text-xs font-light text-center text-gray-800'>
            아이디가 있다면?{" "}
            <a href='/login' className='font-normal text-gray-800 hover:text-black hover:font-semibold underline transition duration-200'>로그인</a>
          </p>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;

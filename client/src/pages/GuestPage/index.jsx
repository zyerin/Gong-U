import React from 'react';
import { Link } from 'react-router-dom';

const GuestPage = () => {
  return (
    <div className='text-3xl font-semibold text-center'>
      <div className="flex justify-between items-center">
        <div className='mt-8 flex flex-col items-center'>
            <div className="text-5xl font-bold">
                <span>로고</span>
            </div>
            <Link to="/login" className="text-sm font-light text-black hover:underline mt-4">
            게스트 로그인하러가기
            </Link>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <Link to="/reservation/page1" className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4">
            Place
          </Link>
          <Link to="/qna" className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4">
            Q&A
          </Link>
          <Link to="/mypage" className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4">
            Mypage
          </Link>
          <Link to="/" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full w-20 flex justify-center items-center mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestPage;

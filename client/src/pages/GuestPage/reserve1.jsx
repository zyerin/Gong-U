import React from 'react';
import { Link } from 'react-router-dom';

const ReservePage1 = () => {
  return (
    <div className='text-3xl font-semibold text-center mt-16'>
      <div className="grid grid-cols-4 gap-4">
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          서울
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          여수
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          제주도
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          경주
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          부산
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          경기도
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          인천
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          속초
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          강릉
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          대전
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          대구
        </Link>
        <Link to="/reservation/page2" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center">
          전주
        </Link>
      </div>
    </div>
  );
};

export default ReservePage1;

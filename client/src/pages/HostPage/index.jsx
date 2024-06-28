import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowCircleLeft } from "react-icons/hi";
import axiosInstance from './../../utils/axios';
import './styles.css'; // styles.css 파일을 import

const HostPage = () => {
  const [showText, setShowText] = useState(false);
  const [userName, setUserName] = useState(""); // 사용자 이름 상태 추가

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        if (response.data) {
          setUserName(response.data.user.name);
          console.log('Host name', userName);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const textAnimationTimeout = setTimeout(() => {
      setShowText(true);
    }, 300); // 1초 후에 텍스트가 나타남

    fetchUserInfo(); // 사용자 정보를 가져오는 함수 호출

    return () => clearTimeout(textAnimationTimeout);
  }, []);

  return (
    <div className="min-h-screen mt-40 flex-col items-center justify-center bg-white text-center py-12">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-12">
        <span className={`inline-block animate-fadeInCustom ${showText ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
          {userName ? `${userName} 님, 안녕하세요!` : "땡땡땡 Host님, 안녕하세요!"}
        </span>
      </h1>
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
        <Link to="/host/option1" className="group">
          <button className="px-8 py-4 w-55 bg-[#f9e7f4] text-gray-800 text-xl border-none rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white hover:-translate-y-2 hover:shadow-2xl">
            숙소 등록하기
          </button>
        </Link>
        <Link to="/mypage" className="group">
          <button className="px-8 py-4 w-55 bg-[#f9e7f4] text-gray-800 text-xl border-none rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white hover:-translate-y-2 hover:shadow-2xl">
            내 숙소 보러가기
          </button>
        </Link>
      </div>

      <div className="fixed bottom-0 left-0 mb-8 ml-8">
        <Link to="/">
          <HiOutlineArrowCircleLeft size={64} className="transition-transform duration-300 ease-in-out transform hover:scale-110" />
        </Link>
      </div>
    </div>
  );
};

export default HostPage;

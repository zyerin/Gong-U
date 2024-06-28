import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineArrowCircleLeft, HiOutlineArrowCircleRight, HiOutlineHome } from "react-icons/hi";
import './styles.css'; // styles.css 파일을 import

const HostPageOption1 = () => {
  const location = useLocation(); // useLocation hook 추가
  const [product, setProduct] = useState({
    type: '',
    location: '',
    address: '',
    realAddress: '',
    title: '',
    maxPeople: 1,
    roomNum: 1,
    password: '',
    minPrice: 0,
    minTime: 0,
    price: 0,
    description: '',
    guestMessage: '',
    option: [],
    images: [],
  });

  // 경고 메시지를 위한 상태
  const [warning, setWarning] = useState('');

  // 리덕스에서 로그인 한 사용자 정보 가져옴
  const userData = useSelector(state => state.user?.userData); // 유저가 있으면 userData 가져옴
  const navigate = useNavigate(); // 페이지 이동을 위해

  // 상품 유형 변경 핸들러
  const handleTypeChange = (newType) => {
    setProduct((prevState) => ({
      ...prevState,
      type: newType,
    }));
    setWarning(''); // 선택 시 경고 메시지 초기화
    setBounce(true); // 버튼이 선택되면 bounce 효과 설정
  };

  // 다음 페이지로 이동
  const handleNext = () => {
    if (!product.type) {
      setWarning('유형을 선택하세요.'); // 경고 메시지 설정
      return; // 선택되지 않으면 함수 종료
    }
    navigate('/host/option1/option2', 
    {state:{product}}); // 다음 페이지로 이동 (여기서는 location 선택 페이지로 설정)
  };

  // 이전 페이지로 이동
  const handleBack = () => {
    navigate('/host'); // 이전 페이지로 이동
  };

  // 텍스트 애니메이션을 위한 상태
  const [showText, setShowText] = useState(false);

  // 다음 버튼 bounce 효과를 위한 상태
  const [bounce, setBounce] = useState(false);

  // 텍스트 애니메이션 설정
  useEffect(() => {
    const textAnimationTimeout = setTimeout(() => {
      setShowText(true);
    }, 300); // 1초 후에 텍스트가 나타남

    return () => clearTimeout(textAnimationTimeout);
  }, []);

  // 페이지가 로드될 때 상태 초기화
  useEffect(() => {
    if (location.state && location.state.product) {
      setProduct(location.state.product);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen mt-30 flex-col items-center justify-center bg-white text-center py-12">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-12">
        <span className={`inline-block animate-fadeInCustom ${showText ? "" : "invisible"} flex justify-center`}>
          <HiOutlineHome className="mr-3" />
          유형을 선택하세요.
        </span>
      </h1>
      <div className='text-sm font-light text-center mb-10 '>
        다음 중 공간을 잘 설명하는 유형은 무엇인가요?
      </div>
      <div className="flex flex-col font-normal items-center space-y">
        <button
          className={`py-5 px-8 w-40 ${
            product.type === 'house' ? 'bg-[#f9e7f4]' : 'bg-[#ebebeb]'
          } text-gray-800 text-xl border-none rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white hover:-translate-y-1 hover:shadow-2xl`}
          onClick={() => handleTypeChange('house')}
        >
          주택
        </button>
        <button
          className={`py-5 px-8 w-40 ${
            product.type === 'apartment' ? 'bg-[#f9e7f4]' : 'bg-[#ebebeb]'
          } text-gray-800 text-xl border-none rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white hover:-translate-y-1 hover:shadow-2xl`}
          onClick={() => handleTypeChange('apartment')}
        >
          아파트
        </button>
        <button
          className={`py-5 px-8 w-40 ${
            product.type === 'office' ? 'bg-[#f9e7f4]' : 'bg-[#ebebeb]'
          } text-black text-xl border-none rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white hover:-translate-y-1 hover:shadow-2xl`}
          onClick={() => handleTypeChange('office')}
        >
          사무실
        </button>
        <button
          className={`py-5 px-8 w-40 ${
            product.type === 'other' ? 'bg-[#f9e7f4]' : 'bg-[#ebebeb]'
          } text-gray-800 text-xl border-none rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white hover:-translate-y-1 hover:shadow-2xl`}
          onClick={() => handleTypeChange('other')}
        >
          기타
        </button>
      </div>

      {warning && <p className="text-gray-500 mt-4">{warning}</p>}

      {/* 이전 페이지 이동 버튼 */}
      <div className="fixed bottom-0 left-0 mb-8 ml-8">
        <button onClick={handleBack}>
          <HiOutlineArrowCircleLeft size={64} className="transition-transform duration-300 ease-in-out transform hover:scale-110" />
        </button>
      </div>

      {/* 다음 페이지 이동 버튼 */}
      <div className="fixed bottom-0 right-0 mb-8 mr-8">
        <button onClick={handleNext}>
          <HiOutlineArrowCircleRight 
            size={64} 
            className={`transition-transform duration-300 ease-in-out transform hover:scale-110 ${bounce ? "animate-bounce" : ""}`} 
          />
        </button>
      </div>
    </div>
  );
};

export default HostPageOption1;

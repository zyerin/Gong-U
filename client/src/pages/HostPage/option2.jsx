import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineArrowCircleLeft, HiOutlineArrowCircleRight, HiOutlineMap } from "react-icons/hi";

const HostPageOption2 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // state에서 product를 추출하고, 전달된 product를 초기 상태로 설정
  const initialProduct = state?.product || {}; // 전달된 product가 없을 경우 빈 객체로 초기화
  const [product, setProduct] = useState(initialProduct);
  console.log('HostPageOption2 product:', product);

  const [selectedLocation, setSelectedLocation] = useState(product.location || ''); // 지역 선택 상태
  const [warning, setWarning] = useState(''); // 경고 메시지를 위한 상태

  // 지역 선택 핸들러
  const handleLocationClick = (location) => {
    setSelectedLocation(location); // 선택된 지역을 상태로 설정
    setProduct((prevState) => ({
      ...prevState,
      location: location, // product.location을 업데이트
    }));
    setWarning(''); // 선택 시 경고 메시지 초기화
    setBounce(true);
  };

  // '다음' 버튼 클릭 시 다음 페이지로 이동
  const handleNext = () => {
    if (!selectedLocation) {
      setWarning('위치를 선택하세요.'); // 경고 메시지 설정
      return; // 선택되지 않으면 함수 종료
    }
    navigate('/host/option1/option2/option3', {
      state: { product }, // 업데이트된 product 전달
    });
  };

  const handleBack = () => {
    navigate('/host/option1', {state:{product}});
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

  return (
    <div className="min-h-screen mt-30 flex-col items-center justify-center bg-white text-center py-12">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-12">
        <span className={`inline-block animate-fadeInCustom ${showText ? "" : "invisible"} flex justify-center`}>
          <HiOutlineMap className="mr-3" />
          위치를 선택하세요.
        </span>
      </h1>
      <div className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {['서울', '여수', '제주도', '경주', '부산', '경기도', '인천', '속초', '강릉', '대전', '대구', '전주'].map((location) => (
            <button
              key={location}
              className={`py-5 px-6 w-full text-black text-xl font-normal border border-gray-400 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white hover:-translate-y-1 hover:shadow-2xl ${
                selectedLocation === location ? 'bg-[#f9e7f4]' : 'bg-[#ebebeb]'
              }`}
              onClick={() => handleLocationClick(location)}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {warning && <p className="text-gray-500 mt-6">{warning}</p>}

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

export default HostPageOption2;

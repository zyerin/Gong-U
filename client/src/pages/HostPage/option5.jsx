import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdBathtub, MdOutlinePets, MdOutlineLocalLaundryService } from 'react-icons/md';
import { FaSwimmingPool, FaCar, FaPumpSoap  } from 'react-icons/fa';
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { HiOutlineArrowCircleLeft, HiOutlineArrowCircleRight, HiCheck, HiWifi } from "react-icons/hi";
import { LuMicrowave, LuParkingCircle, LuBaggageClaim , LuTrain, LuDoorOpen   , LuSiren, LuWifi, LuTv, LuProjector , LuHaze, LuUtensils, LuCigarette, LuBedDouble, LuBath, LuRefrigerator , LuAirVent, LuAccessibility , LuFan, LuDog, LuCigaretteOff , LuLampDesk, LuWind } from "react-icons/lu";
import { TbSmokingNo, TbBeach , TbToolsKitchen3, TbWashDry2, TbFirstAidKit, TbIroningSteam  } from "react-icons/tb";
import { IoFastFoodOutline } from "react-icons/io5";
import { FaWheelchair, FaFire, FaFireExtinguisher } from "react-icons/fa6";
import hairdryer from '../../images/hairdryer.png';
import kitchen from '../../images/kitchen.png';
import shampoo from '../../images/shampoo.png';
import soap from '../../images/soap.png';
import towel from '../../images/towel.png';
import bathtowel from '../../images/bathtowel.png';
import fire from '../../images/fire.png';

const HostPageOption5 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialProduct = state?.product || {}; // 전달된 product가 없을 경우 빈 객체로 초기화
  const [product, setProduct] = useState(initialProduct);
  console.log('HostPageOption4 product:', product);

  // 옵션 목록 및 선택된 옵션 상태
  const options = [
    // 중요
    { label: '무선 인터넷', icon: <LuWifi size={40} /> },
    { label: '침구', icon: <LuBedDouble  size={40} /> },
    { label: '주방', icon: <img src={kitchen} alt="주방" style={{ width: '40px', height: '40px' }} /> },
    { label: '냉장고', icon: <LuRefrigerator  size={40} /> },
    { label: '샴푸/바디워시', icon: <img src={soap} alt="샴푸/바디워시" style={{ width: '40px', height: '40px' }} /> },
    { label: '세탁기', icon: <TbWashDry2 size={40} /> },
    { label: '에어컨/난방', icon: <LuAirVent   size={40} /> },
    { label: '업무 공간', icon: <LuLampDesk size={40} /> },
    { label: '티비', icon: <LuTv size={40}/> },
    { label: '드라이기', icon: <img src={hairdryer} alt="드라이기" style={{ width: '40px', height: '40px' }} /> },
    { label: '다리미', icon: <TbIroningSteam size={40}/> },
    { label: '주차공간', icon: <LuParkingCircle  size={40} /> },

    // 특징
    { label: '해변가', icon: <TbBeach  size={40} /> },
    { label: '중심가', icon: <LuTrain   size={40} /> },

    { label: '수영장', icon: <FaSwimmingPool size={40} /> },
    { label: '전자레인지', icon: <LuMicrowave size={40} /> },
    { label: '욕조', icon: <LuBath  size={40} /> },
    { label: '수건', icon: <img src={bathtowel} alt="수건" style={{ width: '40px', height: '40px' }} /> },
    { label: '반려동물', icon: <LuDog size={40} /> },
    { label: '빔 프로젝터', icon: <LuProjector  size={40} /> },
    { label: '금연구역', icon: <LuCigaretteOff  size={40} /> },
    { label: '흡연가능', icon: <LuCigarette   size={40} /> },
    { label: '짐 보관', icon: <LuBaggageClaim   size={40} /> },
    { label: '셀프체크인', icon: <LuDoorOpen    size={40} /> },

    { label: '취식가능', icon: <LuUtensils  size={40} /> },
    { label: '휠체어', icon: <LuAccessibility  size={40} /> },

    // 안전
    { label: '구급상자', icon: <TbFirstAidKit size={40} /> },
    { label: '화재 경보기', icon: <LuSiren  size={40} /> },
    { label: '소화기', icon: <img src={fire} alt="소화기" style={{ width: '34px', height: '36px' }} /> },
  ];

  // 선택된 옵션을 추적하기 위한 상태
  const [selectedOptions, setSelectedOptions] = useState(product.option || []);
  const [warning, setWarning] = useState(''); // 경고 메시지를 위한 상태

  // 옵션 클릭 핸들러
  const handleOptionClick = (label) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.includes(label);
      if (isSelected) {
        return prev.filter((item) => item !== label); // 선택된 경우 제거
      }
      return [...prev, label]; // 선택되지 않은 경우 추가
    });
    setBounce(true); // 버튼이 선택되면 bounce 효과 설정
  };

  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      option: selectedOptions, // selectedOptions의 최신 값으로 product.option 업데이트
    }));
  }, [selectedOptions]); // selectedOptions 변경 시 실행

  const handleNext = () => {
    if (selectedOptions.length === 0) {
      setWarning('옵션을 최소 하나 이상 선택하세요.'); // 경고 메시지 설정
      return; // 선택되지 않으면 함수 종료
    }
    setWarning(''); // 선택된 경우 경고 메시지 제거
    navigate('/host/option1/option2/option3/option4/option5/option6', {
      state: { product }, // 업데이트된 product 전달
    });
  };

  const handleBack = () => {
    navigate('/host/option1/option2/option3/option4', {state:{product}}); // 이전 페이지로 이동
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
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8">
        <span className={`inline-block animate-fadeInCustom ${showText ? "" : "invisible"} flex justify-center`}>
          <HiCheck className="mr-3" />
          옵션을 선택하세요.
        </span>
      </h1>
      <div className='text-sm font-light text-center mb-1 '>
        공간에 갖춰져진 편의시설 정보를 선택하여, 이 공간의 매력을 돋보이게 하세요.
      </div>
      <div className='text-sm font-light text-center mb-8'>
        이후에 수정이 가능하니 걱정하지 마세요!
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {options.map((option) => (
          <button
            key={option.label}
            className={`py-4 px-4 flex flex-col items-center justify-center font-semibold border-black rounded-xl cursor-pointer transition duration-300 ease-in-out transform hover:bg-[#f9e7f4] hover:text-black hover:-translate-y-1 hover:shadow-2xl ${
              selectedOptions.includes(option.label) ? 'bg-[#ebebeb] text-black' : 'bg-[#ffffff] hover:bg-[#f9e7f4] text-black'
            }`}
            onClick={() => handleOptionClick(option.label)}
          >
            <div className="mb-2">
              {option.icon}
            </div>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
      {warning && <p className="text-gray-500 mt-5 mb-10">{warning}</p>}

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

export default HostPageOption5;

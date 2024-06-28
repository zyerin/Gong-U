import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from './../../utils/axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './style.css';
import { HiOutlineEye, HiOutlineArrowCircleLeft, HiOutlineArrowCircleRight, HiCheck, HiWifi } from "react-icons/hi";
import { FaSwimmingPool, FaCar, FaPumpSoap  } from 'react-icons/fa';
import { LuMicrowave, LuParkingCircle , LuBaggageClaim , LuTrain, LuDoorOpen   , LuSiren, LuWifi, LuTv, LuProjector , LuHaze, LuUtensils, LuCigarette, LuBedDouble, LuBath, LuRefrigerator , LuAirVent, LuAccessibility , LuFan, LuDog, LuCigaretteOff , LuLampDesk, LuWind } from "react-icons/lu";
import { TbSmokingNo, TbBeach , TbToolsKitchen3, TbWashDry2, TbFirstAidKit, TbIroningSteam  } from "react-icons/tb";
import { MdBathtub , MdOutlinePets, MdOutlineLocalLaundryService  } from 'react-icons/md';
import { FaWheelchair, FaFireExtinguisher, FaFire } from "react-icons/fa6";
import { IoFastFoodOutline } from "react-icons/io5";
import hairdryer from '../../images/hairdryer.png';
import kitchen from '../../images/kitchen.png';
import shampoo from '../../images/shampoo.png';
import soap from '../../images/soap.png';
import towel from '../../images/towel.png';
import bathtowel from '../../images/bathtowel.png';
import fire from '../../images/fire.png';
import { BiChevronsRight  } from "react-icons/bi";


const PlaceDetail = () => {
  const { id } = useParams(); // URL 파라미터에서 id 추출
  const [place, setPlace] = useState(null); // 숙소 정보 상태 변수
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    // 숙소 정보 가져오기
    const fetchPlaceDetail = async () => {
      try {
        // 서버로부터 숙소 정보를 가져오는 API 요청
        const response = await axiosInstance.get(`/place/${id}`);
        setPlace(response.data[0]); // 가져온 데이터로 상태 변수 업데이트
        
      } catch (error) {
        console.error('Error fetching place detail:', error);
      }
    };

    // 페이지가 처음 렌더링될 때 숙소 정보 가져오기
    fetchPlaceDetail();
  }, [id]);

  console.log(place);

  if (!place) {
    return <div className='container mx-auto p-6'>Loading...</div>; // 데이터 로딩 중이면 로딩 표시
  }

  const availableOptions = [
    { label: '무선 인터넷', icon: <LuWifi /> },
    { label: '침구', icon: <LuBedDouble /> },
    { label: '주방', icon: <img src={kitchen} alt="주방" style={{ width: '15px', height: '15px' }} /> },
    { label: '냉장고', icon: <LuRefrigerator /> },
    { label: '샴푸/바디워시', icon: <img src={soap} alt="샴푸/바디워시" style={{ width: '15px', height: '15px' }} /> },
    { label: '세탁기', icon: <TbWashDry2 /> },
    { label: '에어컨/난방', icon: <LuAirVent /> },
    { label: '업무 공간', icon: <LuLampDesk  /> },
    { label: '티비', icon: <LuTv /> },
    { label: '드라이기', icon: <img src={hairdryer} alt="드라이기" style={{ width: '15px', height: '15px' }} /> },
    { label: '다리미', icon: <TbIroningSteam /> },
    { label: '주차공간', icon: <LuParkingCircle /> },

    { label: '해변가', icon: <TbBeach  /> },
    { label: '중심가', icon: <LuTrain  /> },

    { label: '수영장', icon: <FaSwimmingPool  /> },
    { label: '전자레인지', icon: <LuMicrowave /> },
    { label: '욕조', icon: <LuBath  /> },
    { label: '수건', icon: <img src={bathtowel} alt="수건" style={{ width: '14px', height: '14px' }} /> },
    { label: '반려동물', icon: <LuDog /> },
    { label: '빔 프로젝터', icon: <LuProjector /> },
    { label: '금연구역', icon: <TbSmokingNo /> },
    { label: '흡연가능', icon: <LuCigarette  /> },
    { label: '짐 보관', icon: <LuBaggageClaim  /> },
    { label: '셀프체크인', icon: <LuDoorOpen  /> },

    { label: '취식가능', icon: <LuUtensils /> },
    { label: '휠체어', icon: <LuAccessibility /> },

    { label: '구급상자', icon: <TbFirstAidKit /> },
    { label: '화재 경보기', icon: <LuSiren /> },
    { label: '소화기', icon: <img src={fire} alt="소화기" style={{ width: '13px', height: '15px' }} /> },

  ];

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-7'>{place.title}</h1>

    <div className='border border-gray-300 shadow rounded-md p-6 mt-4'>
      <div className='grid grid-cols-2'>
        <div className='text-center ml-20 mr-32'>
            {/* 이미지 슬라이드 */}
            {place.images.length > 0 && (
                <Carousel showArrows={true} showThumbs={true} showStatus={false} className='carousel-container'>
                {place.images.map((image, index) => (
                    <div key={index} className='carousel-image-wrapper'>
                    <img src={`${import.meta.env.VITE_SERVER_URL}/${image}`} alt={`place-${index}`} className='carousel-image' />
                    </div>
                ))}
                </Carousel>
                
            )}
        </div>
        <div>
          <div className='mb-4 items-center'>
            <span className='font text-md mr-1'>유형 |</span><span className='ml-1'>{place.type}</span>
          </div>
          <div className='mb-4 items-center'>
            <span className='font text-md mr-1'>위치 |</span><span className='ml-1'>{place.location}</span>
          </div>
          <div className='mb-4 items-center'>
            <span className='font text-md mr-1'>주소 |</span><span className='ml-1'>{place.realAddress}</span>
          </div>
          <div className='mb-4 items-center'>
            <span className='font text-md mr-1'>최대인원 |</span><span className='ml-1'>{place.maxPeople}</span>
          </div>
          <div className='mb-4 items-center'>
            <span className='font text-md mr-1'>방 개수 |</span><span className='ml-1'>{place.roomNum}</span>
          </div>
          <div className='mb-4 items-center'>
            <span className='font text-md mr-1'>출입 비밀번호 |</span><span className='ml-1'>{place.password}</span>
          </div>
          <div className='mb-4 items-center'>
            <span className='font text-md mr-1'>기본요금/시간 |</span><span className='ml-1'>{place.minPrice}/{place.minTime}</span>
          </div>
          <div className='mb-4 items-center'>
            <span className='font text-md mr-1'>시간 당 가격 |</span><span className='ml-1'>{place.price}</span>
          </div>
        </div>
      </div>
      <div >
        <div className='border border-gray-300 shadow rounded-md p-4'>
          <h2 className='text-lg font-semibold mb-4'>옵션</h2>
          <div className='grid grid-cols-3 gap-4'>
            {availableOptions.filter(option => place.option.includes(option.label)).map((option, index) => (
              <div key={index} className='flex items-center'>
                {option.icon}
                <span className='ml-2'>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='border border-gray-300 shadow rounded-md mt-6 p-4'>
            <h2 className='text-lg font-semibold mb-4'>상세 설명</h2>
            <p>{place.description}</p>
        </div>
      </div>
    </div>
      <div className='mt-10'>
        <h2 className='text-2xl font-semibold mb-4'>호스트가 전하는 말</h2>
        <p>{place.guestMessage}</p>
      </div>

      <div className='flex justify-end mt-10 mb-10'>
        {/* 호스트와 채팅하기 버튼 */}
        <Link to={`/chat/${place.writer._id}/${id}`} className="py-2 px-4 bg-gray-500 text-white rounded-lg text-md hover:bg-gray-600">
          호스트와 채팅하기
        </Link>
      </div>
    </div>
  );
};

export default PlaceDetail;

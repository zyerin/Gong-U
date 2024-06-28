import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineArrowCircleLeft, HiOutlineArrowCircleRight, HiOutlineLocationMarker } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { PiQuestionLight } from "react-icons/pi";
import '../HostPage/styles.css';

const HostPageOption3 = () => {
  const { state } = useLocation(); // 전달된 state에서 product 추출
  const navigate = useNavigate();

  const initialProduct = state?.product || {}; // 전달된 product가 없을 경우 빈 객체로 초기화
  const [product, setProduct] = useState(initialProduct);

  // 주소 입력을 위한 상태
  const [addressInfo, setAddressInfo] = useState({
    streetAddress: initialProduct.streetAddress || "", // 도로명 주소
    detailedAddress: initialProduct.detailedAddress || "", // 상세 주소
    postalCode: initialProduct.postalCode || "", // 우편번호
  });

  // 경고 메시지를 위한 상태
  const [warning, setWarning] = useState('');

  // 입력 필드 업데이트 핸들러
  const handleInputChange = (event) => {
    const { name, value } = event.target; // 입력 필드의 name과 value 가져오기
    setAddressInfo((prev) => ({
      ...prev,
      [name]: value, // 입력 필드에 따른 상태 업데이트
    }));
    setBounce(true);
  };

  useEffect(() => {
    // 주소 정보를 문자열로 결합
    const completeAddress = `${addressInfo.postalCode} ${addressInfo.streetAddress} ${addressInfo.detailedAddress}`;

    setProduct((prev) => ({
      ...prev,
      address: addressInfo.streetAddress,
      realAddress: completeAddress, // product.realAddress에 결합된 문자열 저장
    }));


    // Kakao 지도에 주소 위치 표시
    if (window.kakao && addressInfo.streetAddress) {
      // 주소로 좌표를 검색합니다
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(addressInfo.streetAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const map = new window.kakao.maps.Map(document.getElementById('map'), {
            center: coords,
            level: 3
          });
          // 마커를 생성하고 지도에 표시합니다
          const marker = new window.kakao.maps.Marker({
            position: coords,
            map: map
          });
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
        } else {
          console.error('주소로 좌표를 검색하는 데 실패했습니다.', status);
        }
      });
    }
  }, [addressInfo]);

  const handleNext = () => {
    // 모든 필수 입력 필드가 입력되었는지 확인
    if (!addressInfo.streetAddress || !addressInfo.detailedAddress || !addressInfo.postalCode) {
      setWarning('모든 필수 주소를 입력하세요.');
      return; // 입력되지 않은 필드가 있으면 함수 종료
    }
    navigate('/host/option1/option2/option3/option4', {
      state: { product }, // 업데이트된 product 전달
    });
  };

  const handleBack = () => {
    navigate('/host/option1/option2', {state:{product}});
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

  const handlePostalCodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        setAddressInfo((prev) => ({
          ...prev,
          streetAddress: data.roadAddress,
          postalCode: data.zonecode,
        }));
      }
    }).open();
  };

  useEffect(() => {
    // Kakao 지도 API가 로드될 때 호출되는 콜백 함수
    const initMap = () => {
      // 지도 API가 로드된 후에 지도 객체 생성
      const mapContainer = document.getElementById('map');
      const mapOptions = {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOptions);

      // 마커가 표시될 위치입니다
      const markerPosition = new window.kakao.maps.LatLng(37.566826, 126.9786567);

      // 마커를 생성합니다
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);
    };

    // Kakao 지도 API 로드
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=bd39644e20015bfa9db32f2781d91dac&libraries=services&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(initMap);
    };
    document.head.appendChild(script);

    return () => {
      // 컴포넌트가 언마운트될 때 스크립트 제거
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen mt-30 flex-col items-center justify-center bg-white text-center py-12">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-10">
        <span className={`inline-block animate-fadeInCustom ${showText ? "" : "invisible"} flex justify-center relative`}>
          <HiOutlineLocationMarker className="mr-3" />
          숙소 주소를 입력하세요.
        </span>
      </h1>
      <div className="w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={handlePostalCodeSearch}
          className="flex text-md mb-4 ml-36 bg-[#f9e7f4] text-gray-600 py-2 px-4 rounded-full hover:bg-gray-800 hover:text-white transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
        >
          <IoSearchOutline className=' mr-1 text-2xl'/>주소 검색하기
        </button>
        
        
        <div className="mb-4">
          <label className="block text-gray-700 text-left mb-1">도로명 주소</label>
          <input
            type="text"
            name="streetAddress"
            value={addressInfo.streetAddress}
            readOnly // 사용자 입력 비활성화
            className="w-full px-3 py-2 border rounded bg-gray-50 border-gray-300"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-left mb-1">우편번호</label>
          <div className="flex items-center">
            <input
              type="text"
              name="postalCode"
              value={addressInfo.postalCode}
              onChange={handleInputChange}
              readOnly // 사용자 입력 비활성화
              className="w-full px-3 py-2 border rounded bg-gray-50 border-gray-300"
            />
          </div>
        </div>

        <div className="mb-8">
        <label className="flex justify-left text-gray-700 mb-1">상세 주소
          <span className="tooltip">
            <PiQuestionLight className="question-icon ml-2" />
            <span className="tooltiptext text-small">상세주소는 예약이 확정된 게스트에게만 보여집니다.</span>
          </span>
        </label>
          <input
            type="text"
            name="detailedAddress"
            value={addressInfo.detailedAddress}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded bg-gray-50 border-gray-300"
          />
        </div>
      </div>


      {/* 경고 메시지 표시 */}
      {warning && <p className="text-gray-500 text-sm mb-4">{warning}</p>}

      {/* Kakao 지도 */}
      <div className='flex justify-center'>
        <div id="map" style={{ width: '60%', height: '400px' }}>
        </div>
      </div>
      
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

export default HostPageOption3;

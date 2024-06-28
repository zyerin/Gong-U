import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from './../../utils/axios';
import { HiOutlineEye, HiOutlineEyeOff , HiCheck, HiWifi } from "react-icons/hi";
import { AiOutlineWifi, AiOutlineCheck } from 'react-icons/ai';
import { CiCircleList, CiUser, CiCalendarDate, CiHome, CiCircleCheck, CiTextAlignLeft, CiImageOn,
    CiUnlock, CiCreditCard1, CiBullhorn, CiSettings, CiLocationOn, CiMap, CiSearch, CiText, CiShop } from "react-icons/ci";
import { MdBathtub , MdOutlinePets } from 'react-icons/md';
import { FaSwimmingPool, FaCar, FaPumpSoap  } from 'react-icons/fa';
import { LuMicrowave, LuParkingCircle,LuBaggageClaim , LuTrain, LuDoorOpen   , LuSiren, LuWifi, LuTv, LuProjector , LuHaze, LuUtensils, LuCigarette, LuBedDouble, LuBath, LuRefrigerator , LuAirVent, LuAccessibility , LuFan, LuDog, LuCigaretteOff , LuLampDesk, LuWind } from "react-icons/lu";
import { TbSmokingNo, TbBeach , TbToolsKitchen3, TbWashDry2, TbFirstAidKit, TbIroningSteam  } from "react-icons/tb";
import { IoFastFoodOutline, IoSearchOutline } from "react-icons/io5";
import { FaWheelchair, FaFire, FaFireExtinguisher } from "react-icons/fa6";
import hairdryer from '../../images/hairdryer.png';
import shampoo from '../../images/shampoo.png';
import fire from '../../images/fire.png';
import towel from '../../images/towel.png';
import laundry from '../../images/laundry.png';

const EditPage = () => {
  const { id } = useParams(); // URL에서 숙소의 ID를 가져옵니다.
  const [place, setPlace] = useState(null); // 숙소 상태 변수, 초기값은 null로 설정합니다.
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    location: '',
    address: '',
    realAddress: '',
    maxPeople: '',
    roomNum: '',
    password: '',
    price: '',
    option: [],
  });
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기/숨기기 상태

  // 주소 입력을 위한 상태
  const [addressInfo, setAddressInfo] = useState({
    streetAddress:  "", // 도로명 주소
    detailedAddress:  "", // 상세 주소
    postalCode:  "", // 우편번호
  });

  useEffect(() => {
    // 숙소 정보 불러오기
    const fetchPlaceInfo = async () => {
      try {
        const response = await axiosInstance.get(`/place/${id}`);
        setPlace(response.data[0]);
        setFormData({
          title: response.data[0].title,
          type: response.data[0].type,
          location: response.data[0].location,
          address: response.data[0].address,
          realAddress: response.data[0].realAddress,
          maxPeople: response.data[0].maxPeople,
          roomNum: response.data[0].roomNum,
          password: response.data[0].password,
          minPrice: response.data[0].minPrice,
          minTime: response.data[0].minTime,
          price: response.data[0].price,
          option: response.data[0].option,
        });
      } catch (error) {
        console.error('Error fetching place information:', error);
      }
    };

    fetchPlaceInfo();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
    // 주소 정보를 문자열로 결합
    const completeAddress = `${addressInfo.streetAddress} ${addressInfo.detailedAddress} ${addressInfo.postalCode}`;

    setFormData({
      ...formData,
      realAddress: completeAddress, // product.realAddress에 결합된 문자열 저장
    });

  }, [addressInfo]);

  const handleOptionChange = (e) => {
    const { value } = e.target;
    const index = formData.option.indexOf(value);
    if (index === -1) {
      setFormData({
        ...formData,
        option: [...formData.option, value],
      });
    } else {
      const newOptions = [...formData.option];
      newOptions.splice(index, 1);
      setFormData({
        ...formData,
        option: newOptions,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/place/${id}`, formData);
      alert('수정이 완료되었습니다.');
    } catch (error) {
      console.error('Error updating place information:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!place) return null;

  return (
    <div className="mt-10 mx-auto max-w-4xl p-6 bg-white rounded-lg shadow-lg ">
      <h2 className="text-4xl font-semibold mb-6 flex items-center gap-4"><CiCircleList />Place 정보 수정</h2>
      <div className="bg-gray-100 p-6 border border-gray-300 rounded-lg">
        <form onSubmit={handleSubmit}>

         <div className='mb-4 flex items-center'>
            <label htmlFor='title' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiText className='mr-2 text-lg'/>제목
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
            />
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='type' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
                <CiHome className='mr-2 text-lg' />유형
            </label>
            <select
                id='type'
                name='type'
                value={formData.type}
                onChange={handleChange}
                className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
            >
                <option value=''>유형 선택</option>
                <option value='house'>집</option>
                <option value='apartment'>아파트</option>
                <option value='office'>사무실</option>
                <option value='others'>기타</option>
            </select>
           </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='location' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiMap className='mr-2 text-lg'/>지역
            </label>
            <select
              id='location'
              name='location'
              value={formData.location}
              onChange={handleChange}
              className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
            >
              <option value=''>지역 선택</option>
              <option value='서울'>서울</option>
              <option value='여수'>여수</option>
              <option value='제주도'>제주도</option>
              <option value='경주'>경주</option>
              <option value='부산'>부산</option>
              <option value='경기도'>경기도</option>
              <option value='인천'>인천</option>
              <option value='속초'>속초</option>
              <option value='강릉'>강릉</option>
              <option value='대전'>대전</option>
              <option value='대구'>대구</option>
              <option value='전주'>전주</option>
            </select>
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='address' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiLocationOn className='mr-2 text-lg'/>주소(도/구)
            </label>
            <input
              type='text'
              id='address'
              name='address'
              value={formData.address}
              onChange={handleChange}
              className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
            />
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='realAddress' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiLocationOn className='mr-2 text-lg'/>상세주소
            </label>
            <button
              type="button"
              onClick={handlePostalCodeSearch}
              className="flex text-sm ml-6 mr-2  py-2 px-4 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-800 hover:text-white transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
            >
              <IoSearchOutline className='text-lg'/>
            </button>
            <input
              type='text'
              id='realAddress'
              name='realAddress'
              value={formData.realAddress}
              onChange={handleChange}
              className='mt-1 p-2 w-11/12 border border-gray-300 rounded-sm'
            />
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='maxPeople' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiUser className='mr-2 text-lg'/>최대 인원
            </label>
            <input
              type='number'
              min={1}
              id='maxPeople'
              name='maxPeople'
              value={formData.maxPeople}
              onChange={handleChange}
              className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
            />
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='roomNum' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiShop className='mr-2 text-lg'/>방 개수
            </label>
            <input
              type='text'
              id='roomNum'
              name='roomNum'
              value={formData.roomNum}
              onChange={handleChange}
              className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
            />
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='password' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiUnlock className='mr-2 text-lg'/>비밀번호
            </label>
            <div className='flex items-center'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
              />
              <button
                type='button'
                className='ml-2 focus:outline-none'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='price' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiCreditCard1 className='mr-2 text-lg'/>기본요금
            </label>
            <input
              type='number'
              min={0}
              id='minPrice'
              name='minPrice'
              value={formData.minPrice}
              onChange={handleChange}
              className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
            />
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='price' className='text-sm font-semibold text-gray-700 flex items-start w-1/5'>
            <CiCreditCard1 className='mr-2 text-lg'/>기본요금 적용 시간
            </label>
            <input
              type='number'
              min={0}
              id='minTime'
              name='minTime'
              value={formData.minTime}
              onChange={handleChange}
              className='mt-1 p-2 w-4/5 border border-gray-300 rounded-sm'
            />
          </div>

          <div className='mb-4 flex items-center'>
            <label htmlFor='price' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiCreditCard1 className='mr-2 text-lg'/>시간 당 가격
            </label>
            <input
              type='number'
              min={0}
              id='price'
              name='price'
              value={formData.price}
              onChange={handleChange}
              className='mt-1 p-2 w-5/6 border border-gray-300 rounded-sm'
            />
          </div>
          <div className='mb-4 flex items-center'>
            <label htmlFor='option' className='text-sm font-semibold text-gray-700 flex items-start w-1/6'>
            <CiSettings className='mr-2 text-lg'/>옵션
            </label>
            <div className='grid grid-cols-4 gap-4 mt-1'>
              {[
                { label: '무선 인터넷', icon: <LuWifi /> },
                { label: '침구', icon: <LuBedDouble /> },
                { label: '주방', icon: <LuUtensils /> },
                { label: '냉장고', icon: <LuRefrigerator /> },
                { label: '샴푸/바디워시', icon: <FaPumpSoap /> },
                { label: '세탁기', icon: <TbWashDry2 /> },
                { label: '에어컨/난방', icon: <LuAirVent /> },
                { label: '업무 공간', icon: <LuLampDesk  /> },
                { label: '티비', icon: <LuTv /> },
                { label: '드라이기', icon: <img src={hairdryer} alt="드라이기" style={{ width: '16px', height: '16px' }} /> },
                { label: '다리미', icon: <TbIroningSteam /> },
                { label: '주차공간', icon: <LuParkingCircle /> },
            
                { label: '해변가', icon: <TbBeach  /> },
                { label: '중심가', icon: <LuTrain  /> },

                { label: '수영장', icon: <FaSwimmingPool  /> },
                { label: '전자레인지', icon: <LuMicrowave /> },
                { label: '욕조', icon: <LuBath  /> },
                { label: '수건', icon: <img src={towel} alt="수건" style={{ width: '14px', height: '14px' }} /> },
                { label: '반려동물', icon: <LuDog /> },
                { label: '빔 프로젝터', icon: <LuProjector /> },
                { label: '금연구역', icon: <TbSmokingNo /> },
                { label: '흡연가능', icon: <LuCigarette  /> },
                { label: '짐 보관', icon: <LuBaggageClaim  /> },
                { label: '셀프체크인', icon: <LuDoorOpen  /> },

                { label: '취식가능', icon: <IoFastFoodOutline /> },
                { label: '휠체어', icon: <LuAccessibility /> },
            
                { label: '구급상자', icon: <TbFirstAidKit /> },
                { label: '화재 경보기', icon: <LuSiren /> },
                { label: '소화기', icon: <img src={fire} alt="소화기" style={{ width: '13px', height: '15px' }} /> },
                
              ].map((option, index) => (
                <label key={index} className='flex items-center'>
                  <input
                    type='checkbox'
                    name='option'
                    value={option.label}
                    checked={formData.option.includes(option.label)}
                    onChange={handleOptionChange}
                    className='mr-2'
                  />
                  <div className='flex items-center'>
                    {option.icon}
                    <span className='ml-2'>{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>
      <div className='flex justify-center mt-4'>
        <button
          type='submit'
          onClick={handleSubmit}
          className='py-2 px-4 bg-gray-400 text-white rounded-md text-sm hover:bg-gray-600'
        >
          저장하기
        </button>
        <Link
          to={`/place/${id}`}
          className='ml-4 py-2 px-4 bg-gray-400 text-white rounded-md text-sm hover:bg-gray-400'
        >
          보러가기
        </Link>
      </div>
    </div>
  );
};

export default EditPage;
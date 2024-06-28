import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineArrowCircleLeft, HiOutlineArrowCircleRight, HiOutlinePencilAlt, HiOutlineKey } from "react-icons/hi";
import { CiText, CiUser, CiShop, CiUnlock, CiDollar, CiTextAlignLeft, CiBullhorn } from "react-icons/ci";

const HostPageOption4 = () => {
  const { state } = useLocation(); // 전달된 state에서 product 추출
  const navigate = useNavigate();

  const initialProduct = state?.product || {}; // 전달된 product가 없을 경우 빈 객체로 초기화
  const [product, setProduct] = useState(initialProduct);
  console.log('HostPageOption3 product:', product);

  // 입력 필드 업데이트 핸들러
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setBounce(true);
    setWarning(''); // 입력 시 경고 메시지 초기화
  }

  const handleBack = () => {
    navigate('/host/option1/option2/option3', { state: { product } }); // 이전 페이지로 이동
  };

  // 다음 페이지로 이동
  const handleNext = () => {
    const { title, maxPeople, roomNum, password, minPrice, minTime, price, description, guestMessage } = product;
    if (!title || !maxPeople || !roomNum || !password || !minPrice || !minTime ||!price || !description || !guestMessage) {
      setWarning('모든 필드를 입력하세요.');
      return; // 필드가 비어있으면 함수 종료
    }
    navigate('/host/option1/option2/option3/option4/option5', { state: { product } }); // 다음 페이지로 이동 (여기서는 location 선택 페이지로 설정)
  };

  // 텍스트 애니메이션을 위한 상태
  const [showText, setShowText] = useState(false);

  // 텍스트 애니메이션 설정
  useEffect(() => {
    const textAnimationTimeout = setTimeout(() => {
      setShowText(true);
    }, 300); // 1초 후에 텍스트가 나타남

    return () => clearTimeout(textAnimationTimeout);
  }, []);

  const [bounce, setBounce] = useState(false);
  const [warning, setWarning] = useState(''); // 경고 메시지를 위한 상태

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 font-roboto">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-10">
        <span className={`inline-block animate-fadeInCustom ${showText ? "" : "invisible"} flex justify-center relative`}>
          <HiOutlinePencilAlt className="mr-3" />
          기본정보를 입력하세요.
        </span>
      </h1>
      {warning && <p className="text-gray-500 mt-2">{warning}</p>}
      <div className="p-10 rounded-lg shadow-xl w-auto bg-white">
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiText /></div>이름을 지어주세요. (이름은 짧을수록 좋습니다.)</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
        </div>
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiUser /></div>최대 인원</label>
          <input
            type="number"
            min={1}
            name="maxPeople"
            value={product.maxPeople}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
        </div>
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiShop /></div>방 개수 (일반적으로 침실의 개수입니다.)</label>
          <input
            type="number"
            min={0}
            name="roomNum"
            value={product.roomNum}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
        </div>
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiUnlock /></div>출입 비밀번호 (예약이 확정된 게스트에게만 보여집니다.)</label>
          <input
            type="text"
            name="password"
            value={product.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
        </div>
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiDollar /></div>기본요금을 설정해주세요.</label>
          <input
            type="number"
            min={0}
            name="minPrice"
            value={product.minPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
        </div>
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiDollar /></div>기본요금이 책정될 시간을 정해주세요. (예를 들어, 5시간까지 위에서 설정한 기본요금이 적용됩니다.)</label>
          <input
            type="number"
            min={1}
            name="minTime"
            value={product.minTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
        </div>
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiDollar /></div>시간 당 가격 (기본요금 이후 책정되는 가격입니다.)</label>
          <input
            type="number"
            min={0}
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
        </div>
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiTextAlignLeft /></div>상세 설명 (이 공간은 어떤 곳인가요? 특징과 장점이 잘 드러나도록 작성해주세요. 구체적일수록 좋습니다.)</label>
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
        </div>
        <div className="mb-4">
          <label className="flex text-left text-gray-800 text-md font-md"><div className='mr-2 text-xl'><CiBullhorn /></div>예약 완료 시 게스트에게 알려줄 전달사항 (오시는 길, 유의사항, 출입 비밀번호 안내 등)</label>
          <input
            type="text"
            name="guestMessage"
            value={product.guestMessage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-[#d9aad9] mb-3"
          />
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

export default HostPageOption4;

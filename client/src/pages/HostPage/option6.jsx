import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageUpload from '../../components/ImageUpload'; // FileUpload 컴포넌트 임포트
import { HiOutlineArrowCircleLeft, HiOutlineArrowCircleRight, HiOutlinePhotograph, HiWifi } from "react-icons/hi";

const HostPageOption6 = () => {
  const { state } = useLocation(); // 전달된 state에서 product 추출
  const navigate = useNavigate();

  const initialProduct = state?.product || {}; // 전달된 product가 없을 경우 빈 객체로 초기화
  const [product, setProduct] = useState(initialProduct);
  const [error, setError] = useState('');

  console.log('HostPageOption5 product:', product);

  const handleImageChange = (newImages) => {
    setProduct((prevState) => ({
      ...prevState,
      images: newImages
    }))
    setBounce(newImages.length >= 5); // 이미지가 5장 이상이면 bounce 활성화
  }

  const handleNext = () => {
    if (product.images && product.images.length >= 5) {
      navigate('/host/option1/option2/option3/option4/option5/option6/option7', {
        state: { product }, // 업데이트된 product 전달
      });
    } else {
      setError('이미지를 5장 이상 등록해주세요.');
    }
  };

  const handleBack = () => {
    navigate('/host/option1/option2/option3/option4/option5', {state:{product}});
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
        <HiOutlinePhotograph className="mr-3" />이미지를 5장 이상 등록해주세요.
        </span>
      </h1>

      <div className='text-sm font-light text-center mb-1 '>
        공간을 등록하려면 최소 사진 5장을 제출하셔야 합니다.
      </div>
      <div className='text-sm font-light text-center mb-8'>
        아래에서 클릭하거나 끌어다 놓아 사진을 업로드 하실 수 있습니다. 가져온 사진을 클릭하시면 삭제할 수 있습니다.
      </div>

      <ImageUpload images={product.images} onImageChange={handleImageChange} /> {/* ImageUpload 적용 */}
      
      {/* 에러 메시지 표시 */}
      {error && <p className="text-gray-500 mt-4">{error}</p>}

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

export default HostPageOption6;


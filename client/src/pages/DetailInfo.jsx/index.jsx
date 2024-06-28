import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

const DetailInfoPage = () => {
 
  // useParams를 이용해서 컴포넌트에서 placeId를 가져올 수 있음(라우트 경로에 적혀있는 placeId)
  const { placeId } = useParams(); // 라우트 파라미터에서 destructing 해서 placeId를 개별 변수로 사용
  const [place, setPlace] = useState(null);

  // Detail 페이지에서 보여줄 데이터들을 백엔드에 요청을 보내서 가져옴
  useEffect(() => {
    // 비동기이므로 fetchProduct 함수 먼저 생성
    async function fetchProduct() {
      try {
        // placeId 상품에 따라서 dynamic하게 바뀜
        const response = await axiosInstance.get(`/place/${placeId}?type=single`);
        //console.log(response);

        setPlace(response.data[0]); // 백엔드에서 response 받음
      } catch (error) {
        console.error(error);
      }
    }
    // 함수 호출
    fetchProduct();
  }, [placeId]) // placeId가 바뀔 때마다 호출 ... Dependency


  if (!place) return null;


  return (
    <section className="content-container">
    <div className='text-center'>
        <h1 className='p-4 mb-4 text-3xl font-semibold'>{place.title}</h1>
    </div>
    <div className='flex flex-col gap-4'>
        <div className='w-full'>
            <ProductImage place={place} />
        </div>
        <div className='w-full'>
            <ProductInfo place={place} />
        </div>
    </div>
    </section>
  )
}


export default DetailInfoPage
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

const DetailProductPage = () => {
  // useParams를 이용해서 컴포넌트에서 placeId를 가져올 수 있음(라우트 경로에 적혀있는 placeId)
  const { productId } = useParams(); // destructing 해서 placeId를 개별 변수로 사용
  const [product, setProduct] = useState(null);

  // Detail 페이지에서 보여줄 데이터들을 백엔드에 요청을 보내서 가져옴
  useEffect(() => {
    // 비동기이므로 fetchProduct 함수 먼저 생성
    async function fetchProduct() {
      try {
        // productId 상품에 따라서 dynamic하게 바뀜
        const response = await axiosInstance.get(`/products/${productId}?type=single`);
        console.log(response);

        setProduct(response.data[0]); // 백엔드에서 response 받음
      } catch (error) {
        console.error(error);
      }
    }
    // 함수 호출
    fetchProduct();
  }, [productId]) // placeId가 바뀔 때마다 호출 ... Dependency

  if (!product) return null;

  return (
    <section>
      <div className='text-center'>
        <h1 className='p-4 text-2xl'>{product.title}</h1>
      </div>

      <div className='flex gap-4'>
        <div className='w-1/2'>
          {/* ProductImage...product를 props로 내려줌*/}
          <ProductImage product={product} />
        </div>
        <div className='w-1/2'>
          {/* ProductInfo */}
          <ProductInfo product={product} />
        </div>
      </div>

    </section>
  )
}

export default DetailProductPage
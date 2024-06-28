import React, { useState } from 'react'
import axiosInstance from './../../utils/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../../components/FileUpload';


const continents = [
  { key: 1, value: '서울' },
  { key: 2, value: '여수' },
  { key: 3, value: '제주도' },
  { key: 4, value: '경주' },
  { key: 5, value: '부산' },
  { key: 6, value: '경기도' },
  { key: 7, value: '인천' },
  { key: 8, value: '속초'},
  { key: 9, value: '강릉'},
  { key: 10, value: '대전'},
  { key: 11, value: '대구'},
  { key: 12, value: '전주'},

 
]

const UploadProductPage = () => {

  // useState 이용하여 state 생성 -> 사용자가 폼에 입력한 값 저장해줄 state
  const [product, setProduct] = useState({
    title: '',
    description: '', 
    price: 0,
    continents: 1, 
    images: []
  })

  // 리덕스에서 로그인 한 사용자 정보 가져옴
  const userData = useSelector(state => state.user?.userData); // 유저가 있으면 userData 가져옴
  const navigate = useNavigate()

  // State 업데이트를 위한 핸들러 함수 생성
  // -> name에 value(사용자가 입력한 값)을 넣어줌
  const handleChange = (event) => { // event 객체 받아옴
    const { name, value } = event.target; // name은 return에서 <input>의 name
    setProduct((prevState) => ({ // prevState는 원래 있던 State 값을 가져옴
      ...prevState, // ...(spread operator)이용해서 원래 있던 것을 하나씩 펼쳐줌
      // 원래 있던 객체에 값을 넣어주는 것(override)!!
      [name]: value // 현재 바꾸는 name의 input 값(value)을 넣어주는 부분. 즉, 원래 있던 것에서 새로운 것으로 덮어줌
    }))
  }

  // handleImages 함수를 호출할 때 새로운 이미지 데이터들을 넣어줌
  // 함수를 이용해서 product.images 배열을 업데이트 해줌
  const handleImages = (newImages) => {
    setProduct((prevState) => ({
      ...prevState,
      images: newImages
    }))
  }

  // ‘업로드하기’ 버튼을 누르면 폼에서 Submit 이벤트 발생 ... 이때 handleSubmit 함수 호출
  const handleSubmit = async(event) => {
    event.preventDefault(); // 버튼 눌렀을 때 페이지 리프레쉬 되는 것 막음

    // const { title, description, price, images, continents } = product; // destructing 해서 개별 변수로 사용할 수 있게
    
    /* State에 업데이트한 값을 기반으로 백엔드에 요청을 보냄 
      -> 백엔드는 요청을 받아 클라이언트에서 보내준 name, description, price, loaction을 데이터베이스에 저장 */

    const body = { // body에 writer와 사용자가 폼에 입력한 값들 저장
      // writer란 product를 생성하는 사람이 누구인지? -> Product 모델에 저장해야함
      writer: userData._id, // 현재 로그인 한 사람이 product 생성 ... 리덕스에서 사용자 정보 가져옴
      ...product // ,title, description, price, images, continents 대신 ...product
    }

    try {
      // body 넣어서 Post 요청 보냄 -> 이걸 받아주는 router가 필요!!(서버에서 받아주고 DB에 저장) 
      // -> routes/products.js 생성하여 router 만들기
      await axiosInstance.post('/products', body); // await 사용하려면 async로 감싸줘야함
      navigate('/'); // navigate 이용해서 메인페이지로 이동
    } catch (error) {
      console.error(error);
    }
  }
  

  // handleChange 핸들러 함수는 change event가 발생했을 때 호출 -> onChange={handleChange}
  // handleSubmit 핸들러 함수는 submit evenet가 발생했을 때 호출
  return (
    <section>
      <div className='text-center m-7'>
        <h1>상품 업로드</h1>
      </div>

      <form className='mt-6' onSubmit={handleSubmit}>

        <FileUpload images={product.images} onImageChange={handleImages} />


        <div className='mt-4'>
          <label htmlFor='title'>이름</label>
          <input
            className='w-full px-4 py-2 bg-white border rounded-md'
            name="title" id="title" onChange={handleChange} value={product.title}
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='description'>설명</label>
          <input
            className='w-full px-4 py-2 bg-white border rounded-md'
            name="description" id="description" onChange={handleChange} value={product.description}
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='price'>가격</label>
          <input
            className='w-full px-4 py-2 bg-white border rounded-md'
            type="number" name="price" id="price" onChange={handleChange} value={product.price}
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='continents'>지역</label>
          <select
            className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
            name='continents' id='continents' onChange={handleChange} value={product.continents}
          >
            {continents.map(item => (
              <option key={item.key} value={item.key}>{item.value}</option>
            ))}
          </select>
        </div>

        <div className='mt-4'>
          <button
            type='submit'
            className='w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700'>
            업로드하기
          </button>
        </div>

      </form>
    </section>
  )
}

export default UploadProductPage
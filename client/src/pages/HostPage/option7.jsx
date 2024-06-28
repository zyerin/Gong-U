import React, { useState } from 'react'
import axiosInstance from './../../utils/axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { VscChecklist, VscCheck, VscCheckAll, VscChevronRight  } from "react-icons/vsc";
import { LiaCheckSquareSolid } from "react-icons/lia";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { CiCircleList, CiUser, CiCalendarDate, CiHome, CiCircleCheck, CiTextAlignLeft, CiImageOn,
    CiUnlock, CiCreditCard1, CiBullhorn, CiSettings, CiLocationOn, CiMap, CiDollar, CiTimer, CiSearch, CiText, CiShop } from "react-icons/ci";



const HostPageOption7 = () => {
    const { state } = useLocation();
  
    const initialProduct = state?.product || {}; // 전달된 product가 없을 경우 빈 객체로 초기화
    const [product, setProduct] = useState(initialProduct);
    // 리덕스에서 로그인 한 사용자 정보 가져옴
    const userData = useSelector(state => state.user?.userData); // 유저가 있으면 userData 가져옴
    const navigate = useNavigate()

    const handleYes = async(event) => {
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
            await axiosInstance.post('/place', body); // await 사용하려면 async로 감싸줘야함
            navigate('/host/completion'); // navigate 이용해서 등록 완료 페이지로 이동
        } catch (error) {
            console.error(error);
        }

        console.log('숙소 등록:', userData._id, product);
    };
  
    const handleNo = () => {
      navigate('/host/option1/option2/option3/option4/option5/option6'); // 이전 페이지로 이동
    };
  
    return (
      <div className="mt-10 mx-auto max-w-4xl p-6 bg-white rounded-lg shadow-lg ">
        <h2 className="text-4xl font-semibold mb-6 flex items-center gap-4"><CiCircleList />숙소 정보 확인</h2>
        <div className="bg-gray-100 p-6 border border-gray-300 rounded-lg">
          
          {/* 아이콘을 정보 앞에 배치 */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiHome /><strong>유형</strong><VscChevronRight/>{product.type}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiMap /><strong>위치</strong><VscChevronRight/>{product.location}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiLocationOn /> <strong>주소</strong><VscChevronRight/>{product.address}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiText /> <strong>제목</strong><VscChevronRight/>{product.title}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiUser /> <strong>최대 인원</strong><VscChevronRight/>{product.maxPeople}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiShop /> <strong>방 개수</strong><VscChevronRight/>{product.roomNum}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiUnlock /> <strong>비밀번호</strong><VscChevronRight/>{product.password}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiDollar /> <strong>기본요금</strong><VscChevronRight/>{product.minPrice}<light>클레이</light>
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiTimer /> <strong>기본요금 적용 시간</strong><VscChevronRight/>{product.minTime}<light>시간</light>
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiCreditCard1 /> <strong>시간 당 가격</strong><VscChevronRight/>{product.price}<light>클레이</light>
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiTextAlignLeft /> <strong>상세 설명</strong><VscChevronRight/>{product.description}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiBullhorn /> <strong>게스트 전달사항</strong><VscChevronRight/>{product.guestMessage}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiSettings /> <strong>옵션</strong><VscChevronRight/>{product.option.join(', ')} {/* 옵션 배열을 문자열로 표시 */}
            </div>
            <div className="bg-white p-4 border rounded-lg flex items-center gap-2">
              <CiImageOn /><strong>이미지</strong><VscChevronRight/>
              <div className="flex overflow-x-scroll gap-4 mt-2">
                {product.images.map((image, index) => (
                  <div key={index} className="w-40 h-40">
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}/${image}`} // 이미지 URL
                      alt={`Image ${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  
        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={handleYes} // 숙소 등록
            className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
          >
            제출하기
          </button>
          <button
            onClick={handleNo} // 이전 페이지로 이동
            className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
          >
            수정하기
          </button>
        </div>
      </div>
    );
  };
  
  export default HostPageOption7;
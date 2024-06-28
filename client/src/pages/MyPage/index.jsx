import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import '../../styles/Mypage.css';
import { VscAccount } from "react-icons/vsc";
import { CiCalendarDate, CiLocationOn, CiUser , CiEdit , CiEraser, CiLink, CiShop, CiSliderHorizontal, CiDollar, CiCreditCard1  } from "react-icons/ci";

const MyPage = () => {
  const [selectedTab, setSelectedTab] = useState('guest'); // 'host' 또는 'guest'로 초기화
  const [hostHistory, setHostHistory] = useState([]); // 호스트 내역 상태 변수
  const [guestHistory, setGuestHistory] = useState([]); // 게스트 예약 내역 상태 변수
  const [cancelHistory, setCancelHistory] = useState([]); // 취소 요청 내역 상태 변수
  const [accountInfo, setAccountInfo] = useState(null); // 계정 정보 상태 변수 (초기값을 null로 설정)
  const [editAccountInfo, setEditAccountInfo] = useState(null); // 수정 가능한 계정 정보 상태 변수 (초기값을 null로 설정)
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 호스트 내역 가져오기
  useEffect(() => {
    const fetchHostHistory = async () => {
      try {
        // 호스트 내역을 가져오는 API 요청
        const response = await axiosInstance.get('/place/history/host');
        setHostHistory(response.data); // 가져온 데이터로 상태 변수 업데이트
      } catch (error) {
        console.error('Error fetching host history:', error);
      }
    };

    // 페이지가 처음 렌더링될 때 호스트 내역 가져오기
    fetchHostHistory();
  }, []);

  // 게스트 예약 내역 가져오기
  useEffect(() => {
    const fetchGuestHistory = async () => {
      try {
        // 게스트 예약 내역을 가져오는 API 요청
        const response = await axiosInstance.get('/place/history/guest');
        setGuestHistory(response.data); // 가져온 데이터로 상태 변수 업데이트
      } catch (error) {
        console.error('Error fetching guest history:', error);
      }
    };

    // 페이지가 처음 렌더링될 때 게스트 예약 내역 가져오기
    fetchGuestHistory();
  }, []);

  // 취소 요청 내역 가져오기
  useEffect(() => {
    const fetchCancelHistory = async () => {
      try {
        // 취소 요청 내역을 가져오는 API 요청
        const response = await axiosInstance.get('/place/cancel/history');
        setCancelHistory(response.data); // 가져온 데이터로 상태 변수 업데이트
      } catch (error) {
        console.error('Error fetching cancel history:', error);
      }
    };

    // 페이지가 처음 렌더링될 때 취소 요청 내역 가져오기
    fetchCancelHistory();
  }, []);

  // 계정 정보 가져오기
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        // 계정 정보를 가져오는 API 요청
        const response = await axiosInstance.get('/users/me');
        console.log(response.data);
        setAccountInfo(response.data.user); // 가져온 데이터로 상태 변수 업데이트
        setEditAccountInfo(response.data); // 수정 가능한 데이터로도 설정
      } catch (error) {
        console.error('Error fetching account info:', error);
      } finally {
        setLoading(false); // 데이터 로드 완료 후 로딩 상태 변경
      }
    };

    // 페이지가 처음 렌더링될 때 계정 정보 가져오기
    fetchAccountInfo();
  }, []);

  // 계정 정보 업데이트
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!accountInfo) return;
      const id = accountInfo._id;
      await axiosInstance.put(`/users/account/${id}`, accountInfo);
      alert('수정이 완료되었습니다.');
    } catch (error) {
      console.error('Error updating User Account information:', error);
    }
  };

  // 계정 정보 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });
  };
  
  // 호스트 내역 테이블 생성
  const renderHostTable = () => (
    <table className='w-full text-left text-sm text-gray-500 table-auto'>
      <thead className='border-b border-gray-300'>
        <tr>
          <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiShop /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Place</div></th>
          <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiLocationOn /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Location</div></th>
          <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiDollar /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Price/Hour</div></th>
          <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiEdit /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Upload Date</div></th>
          <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiEraser /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Last Edit</div></th>
          <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiSliderHorizontal /></div></th>        
        </tr>
      </thead>
      <tbody>
        {hostHistory.map((item) => (
          <tr key={item._id} className='border-b border-gray-200 hover:bg-gray-100'>
            <td className='p-3 text-center'>{item.title}</td> {/* 숙소 제목 표시 */}
            <td className='p-3 text-center'>{item.address}</td>
            <td className='p-3 text-center'>{item.price}</td>
            <td className='p-3 text-center'>{new Date(item.createdAt).toLocaleDateString()}</td>
            <td className='p-3 text-center'>{new Date(item.updatedAt).toLocaleDateString()}</td>
            <td className='p-3 text-center'>
              <Link to={`/place/edit/${item._id}`} className='text-gray-500 hover:underline mr-4'>
                수정하기
              </Link>
              <Link to={`/place/guests/${item._id}`} className='text-gray-500 hover:underline mr-4'>
                예약현황
              </Link>
              <Link to={`/place/cancel/${item._id}`} className='text-gray-500 hover:underline'>
                취소요청목록
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

 // 게스트 내역 테이블 생성
const renderGuestTable = () => (
  <table className='w-full text-left text-sm text-gray-500 table-auto'>
    <thead className='border-b border-gray-300'>
      <tr>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiShop /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Place</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiLocationOn /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Location</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCalendarDate /></div><div className='text-xs mt-1 text-gray-500 font-normal'>CheckIn</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCalendarDate /></div><div className='text-xs mt-1 text-gray-500 font-normal'>CheckOut</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiDollar /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Reserved Date</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiSliderHorizontal /></div></th>
      </tr>
    </thead>
    <tbody>
      {guestHistory.map((reservation) => (
        <tr key={reservation._id} className='border-b border-gray-200 hover:bg-gray-100'>
          <td className='p-3 text-center'>{reservation.title}</td>
          <td className='p-3 text-center'>{reservation.location}</td>
          <td className='p-3 text-center'>{formatDateTime(reservation.checkInDate)}</td>
          <td className='p-3 text-center'>{formatDateTime(reservation.checkOutDate)}</td>
          <td className='p-3 text-center'>{new Date(reservation.createdAt).toLocaleDateString()}</td>
          <td className='p-3 text-center'>
            <Link to={`/place/reserved/${reservation.place?._id}`} className='text-gray-500 hover:underline mr-4'>
              자세히 보기
            </Link>
            <button onClick={() => handleCancelReservation(reservation._id, reservation.place?._id)} className='text-gray-500 hover:underline'>
              예약 취소하기
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// 취소 요청 내역 테이블 생성
const renderCancelTable = () => (
  <table className='w-full text-sm text-left text-gray-500 table-auto'>
    <thead className='border-b border-gray-300'>
      <tr>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiShop /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Place</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiLocationOn /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Location</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCalendarDate /></div><div className='text-xs mt-1 text-gray-500 font-normal'>CheckIn</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCalendarDate /></div><div className='text-xs mt-1 text-gray-500 font-normal'>CheckOut</div></th>
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiDollar /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Total Price</div></th>          
        <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiLink /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Approved</div></th>
      </tr>
    </thead>
    <tbody>
      {cancelHistory.map((cancelRequest) => (
        <tr key={cancelRequest._id} className='border-b border-gray-200 hover:bg-gray-100'>
          <td className='p-3 text-center'>{cancelRequest.title}</td>
          <td className='p-3 text-center'>{cancelRequest.location}</td>
          <td className='p-3 text-center'>{formatDateTime(cancelRequest.checkInDate)}</td>
          <td className='p-3 text-center'>{formatDateTime(cancelRequest.checkOutDate)}</td>
          <td className='p-3 text-center'>{cancelRequest.price}</td>
          <td className='p-3 text-center'>{cancelRequest.status === 'accepted' ? '승인됨' : '대기 중'}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ISO 형식의 날짜를 포맷팅하여 시간까지 표시
const formatDateTime = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

// 계정 정보 테이블 생성
const renderAccountTable = () => (
  <div className='w-full'>
    <div className='mb-6'>
      <label className='block mb-2 text-sm font-medium text-gray-900'>이름</label>
      <input
        type='text'
        name='name'
        value={accountInfo?.name || ''} // accountInfo가 null일 경우 빈 문자열 사용
        onChange={handleInputChange}
        className='block w-full p-2 border border-gray-300 rounded'
      />
    </div>
    <div className='mb-6'>
      <label className='block mb-2 text-sm font-medium text-gray-900'>이메일</label>
      <input
        type='email'
        name='email'
        value={accountInfo?.email || ''} // accountInfo가 null일 경우 빈 문자열 사용
        onChange={handleInputChange}
        className='block w-full p-2 border border-gray-300 rounded'
      />
    </div>
    <div className='mb-6'>
      <label className='block mb-2 text-sm font-medium text-gray-900'>비밀번호</label>
      <input
        type='password'
        name='password'
        value={accountInfo?.password || ''} // accountInfo가 null일 경우 빈 문자열 사용
        onChange={handleInputChange}
        className='block w-full p-2 border border-gray-300 rounded'
      />
    </div>
    <div className='mb-6'>
      <label className='block mb-2 text-sm font-medium text-gray-900'>지갑 주소</label>
      <input
        type='text'
        name='wallet'
        value={accountInfo?.wallet || ''} // accountInfo가 null일 경우 빈 문자열 사용
        onChange={handleInputChange}
        className='block w-full p-2 border border-gray-300 rounded'
      />
    </div>
    <button
      onClick={handleSubmit}
      className='px-4 py-2 bg-gray-400 text-sm text-white rounded hover:bg-gray-800'
    >
      수정하기
    </button>
  </div>
);

// 예약 취소 요청을 처리
const handleCancelReservation = async (reservationId, placeId) => {
  try {
    // 환불 요청 API 호출
    await axiosInstance.post(`/place/cancel/${placeId}/${reservationId}`);
    alert('환불 요청이 성공적으로 전송되었습니다.');
    
  } catch (error) {
    console.error('Error requesting refund:', error);
    alert(error.response.data.message);
  }
};

if (loading) {
  return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
}

return (
  <div className='container mx-auto p-6'>
    {/* 호스트와 게스트를 선택할 수 있는 탭 */}
    <div className='mb-6'>
      <button
        className={`mr-4 py-2 px-4 rounded-full ${
          selectedTab === 'host' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
        onClick={() => setSelectedTab('host')}
      >
        호스트
      </button>
      <button
        className={`mr-4 py-2 px-4 rounded-full ${
          selectedTab === 'guest' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
        onClick={() => setSelectedTab('guest')}
      >
        게스트
      </button>
      <button
        className={`mr-4 py-2 px-4 rounded-full ${
          selectedTab === 'cancel' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
        onClick={() => setSelectedTab('cancel')}
      >
        취소내역
      </button>
      <button
        className={`py-2 px-4 rounded-full ${
          selectedTab === 'account' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
        onClick={() => setSelectedTab('account')}
      >
        내 계정
      </button>
    </div>
    {/* 선택된 탭에 따라 해당 내역을 표시하는 테이블을 렌더링 */}
    <div>
      {selectedTab === 'host' && renderHostTable()}
      {selectedTab === 'guest' && renderGuestTable()}
      {selectedTab === 'cancel' && renderCancelTable()}
      {selectedTab === 'account' && renderAccountTable()}
    </div>
  </div>
);
};

export default MyPage;

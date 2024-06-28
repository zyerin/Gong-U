import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { CiViewList, CiUser, CiCalendarDate, CiChat1, CiBookmarkCheck  } from "react-icons/ci";

const ViewGuests = () => {
  const { id } = useParams();
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axiosInstance.get(`/place/guests/${id}`);
        setGuests(response.data);
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };
    fetchGuests();
  }, [id]);

  console.log(guests);

  // 함수: ISO 형식의 날짜를 포맷팅하여 시간까지 표시
  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="flex text-2xl font-semibold text-gray-700 mb-6"><CiBookmarkCheck className='mr-2 text-4xl text-gray-700'/>게스트 예약현황</h1>
      {guests.length === 0 ? (
        <p>예약현황이 없습니다.</p>
      ) : (
        <table className='w-full text-left text-sm text-gray-500 table-auto'>
        <thead className='border-b border-gray-300'>
            <tr>
              <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiViewList /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Reservation ID</div></th>
              <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiUser /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Guest NickName</div></th>
              <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCalendarDate /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Check-In</div></th>
              <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiCalendarDate /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Check-Out</div></th>
              <th className='p-3 text-3xl text-center'><div className='flex justify-center'><CiChat1 /></div><div className='text-xs mt-1 text-gray-500 font-normal'>Chatting Room</div></th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest._id} className='border-b border-gray-200 hover:bg-gray-100'>
                <td className="p-3 text-center">{guest._id}</td>
                <td className="p-3 text-center">{guest.guest.name}</td>
                <td className="p-3 text-center">{formatDateTime(guest.checkInDate)}</td>
                <td className="p-3 text-center">{formatDateTime(guest.checkOutDate)}</td>
                <td className="p-3 text-center">
                  <Link to={`/chat/guest/${id}/${guest.guest._id}`} className="text-gray-500 hover:underline">
                    채팅방 이동
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewGuests;

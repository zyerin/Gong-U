import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const ReservePage2 = () => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState('10:00');
  const [checkOutTime, setCheckOutTime] = useState('12:00');

  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold mb-4">여행일정</h2>
      <div className="flex justify-center items-center">
        <div className="mr-4">
          <p>가는 날</p>
          <DatePicker
            selected={checkInDate}
            onChange={date => setCheckInDate(date)}
            dateFormat="yyyy/MM/dd"
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <p>돌아오는 날</p>
          <DatePicker
            selected={checkOutDate}
            onChange={date => setCheckOutDate(date)}
            dateFormat="yyyy/MM/dd"
            className="border border-gray-300 p-2 rounded"
          />
        </div>
      </div>
      <div className="flex justify-center items-center mt-4">
        <div className="mr-4">
          <p>체크인</p>
          <TimePicker
            onChange={time => setCheckInTime(time)}
            value={checkInTime}
            className="border border-gray-300 p-2 rounded"
            step={60} // 한 시간 간격으로 설정
          />
        </div>
        <div>
          <p>체크아웃</p>
          <TimePicker
            onChange={time => setCheckOutTime(time)}
            value={checkOutTime}
            className="border border-gray-300 p-2 rounded"
            step={60} // 한 시간 간격으로 설정
          />
        </div>
      </div>
      <div className="mt-8">
        <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Next</button>
      </div>
    </div>
  );
};

export default ReservePage2;

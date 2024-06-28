import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiSearch } from 'react-icons/fi';
import { CiLocationOn, CiUser, CiCalendarDate } from 'react-icons/ci';
import CardItem from './Sections/CardItem';
import axiosInstance from '../../utils/axios';
import TimePickerModal from './Sections/TimePicker'; // Import the modal
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchConditions } from '../../redux_store/thunkFunc';
import FilterModal from './Sections/FilterModal';
import { LuAlignHorizontalDistributeCenter } from "react-icons/lu";


const GuestReservePage1 = () => {
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State to manage filter modal

  const [searchTerm, setSearchTerm] = useState(''); // 검색 기능에서 검색하는 값(입력값) 기억하기 위해 state 생성
  const [place, setPlace] = useState([]); // products 데이터들을 가지고있는(기억하고 있는) 배열
  const [skip, setSkip] = useState(0); // 처음에는 0부터 시작 이후에 +4
  const [hasMore, setHasMore] = useState(false); // 더 가져올 데이터가 있을 때만 더보기 버튼 보여줌
  const [filters, setFilters] = useState({
    type: [],
    options: [],
  });

  const dispatch = useDispatch();

  //const checkIn = `${checkInDate?.toISOString().split('T')[0]} ${checkInTime}`; // Convert date to ISO string with time
  //const checkOut = `${checkOutDate?.toISOString().split('T')[0]} ${checkOutTime}`;// Convert date to ISO string with time
  //console.log(checkIn, checkOut);
  
  const handleSearch = () => {
    console.log(checkInDate);
    //console.log(checkInDate.toISOString());
    const utcCheckIn = checkInDate ? new Date(checkInDate.getTime() - (checkInDate.getTimezoneOffset() * 60000)).toISOString() : null;
    console.log(utcCheckIn);
    const utcCheckOut = checkInDate ? new Date(checkOutDate.getTime() - (checkOutDate.getTimezoneOffset() * 60000)).toISOString() : null;
    console.log(utcCheckOut);
    // 날짜/시간 값이 null인지 확인
    const checkIn = checkInDate && checkInTime ? `${utcCheckIn.split('T')[0]} ${checkInTime}` : null;
    const checkOut = checkOutDate && checkOutTime ? `${utcCheckOut.split('T')[0]} ${checkOutTime}` : null;
    
    const body = {
        location,
        guests,
        checkIn,
        checkOut,
        skip, // 처음 가져온 4개의 product는 skip ... 이후 skip 계속 누적
        //limit, // limit=4로 고정(더보기 누르면 4개씩 보여줌)
        filters,
        searchTerm
    }
    console.log(checkIn, checkOut);
    console.log("검색", body);

    dispatch(setSearchConditions(body));

    fetchProducts(body);
    
  };

  const { navigate } = useNavigate();

  const handleCardClick = (placeId) => {
    // 카드 클릭 시 `DetailInfo`로 이동하면서 필요한 데이터를 함께 전달
    navigate(`/place/${placeId}`);
  };
  
  // 처음에 보여줄 product 데이터들을 가져오기 ... How?
  // useEffect로 처음에 데이터를 가져오기 위해서, fetchProducts 라는 함수를 생성
  useEffect(() => {
    fetchProducts({ skip }); // skip=0, limit=4 보냄
  }, []) // DependencyArray에 빈 값을 넣어서 한 번만 랜더링이 될 수 있게!!


  const fetchProducts = async ({ location="", guests='', checkIn='', checkOut='', skip, loadMore = false, filters = {}, searchTerm = "" }) => {
    // 요청 보낼 때 params 같이 보냄
    const params = {
        location, 
        guests,
        checkIn,
        checkOut,
        skip,
        filters,
        searchTerm
    }
    console.log("fetchProduct", params);

    try {
        // 백앤드에게 get 요청 보냄
        const response = await axiosInstance.get('/place', { params }) // products.js의 '/ '경로로 요청 보냄
        
        // 백앤드에서 받아오는 response를 product state에 하나씩 넣어줌 -> Card 나열 가능
        if (loadMore) {
            // 원래 있던 product에 새로 추가된 product 더해줌
            setPlace([...place, ...response.data.place]);
            
        } else {
            // 함수가 loadMore=false로 params 받아옴
            // -> loadMore이 false라는 것은 처음에 랜딩페이지 들어왔을 때!
            setPlace(response.data.place); // 이때는 product를 추가로 더해주는게 아니라 그냥 업데이트
        }
        //hasMore state 업데이트
        // product 아직 더 가져올게 남아있으면 true, 없으면 false
        setHasMore(response.data.hasMore);
    } catch (error) {
        console.error(error);
    }
  }


  useEffect(() => {
    console.log('Filters updated:', filters);
    handleSearch();
  }, [filters]);

  const handleFilterApply = (selectedFilters) => {
    console.log(selectedFilters);
    setFilters({
      type: selectedFilters.type, 
      options: selectedFilters.options
    });
    console.log('Filters', filters);
    setIsFilterModalOpen(false);
    
  };


  return (
    <section>
      {/* Search Bar */}
      <div className="flex flex-row gap-4 items-center bg-white rounded-full p-4 shadow-lg relative"> {/* Ensure elements are in a row */}
        {/* Location Select */}
        <div className="flex items-center">
          <CiLocationOn className="text-3xl text-gray-600" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border rounded-full"
          >
            <option value="">지역</option>
            <option value="서울">서울</option>
            <option value="여수">여수</option>
            <option value="제주도">제주도</option>
            <option value="경주">경주</option>
            <option value="부산">부산</option>
            <option value="경기도">경기도</option>
            <option value="인천">인천</option>
            <option value="속초">속초</option>
            <option value="강릉">강릉</option>
            <option value="대전">대전</option>
            <option value="대구">대구</option>
            <option value="전주">전주</option>
          </select>
        </div>

        {/* Number of Guests */}
        <div className="flex items-center w-1/12">
          <CiUser className="text-4xl text-gray-600" />
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3 py-2 border rounded-full"
          />
        </div>

        {/* Date and Time Selection */}
        <div className="flex flex-row gap-4 items-center"> {/* Separate dates with spacing */}
          {/* Check-in Date */}
          <div className="flex flex-row items-center relative z-50">
            <CiCalendarDate className="text-3xl text-gray-600 mr-1" />
            <DatePicker
              selected={checkInDate}
              onChange={(date) => {
                setCheckInDate(date);
                setIsCheckInModalOpen(true); // Open modal when date is selected
              }}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="체크인"
              className="w-full px-3 py-2 border rounded-full relative z-50"
              calendarClassName="relative z-50"
            />
            <div
              className="flex justify-center items-center bg-gray-100 rounded-full p-2 shadow-sm cursor-pointer ml-2 relative z-50"
              onClick={() => setIsCheckInModalOpen(true)}
            >
              {checkInTime || '00:00'} {/* Display selected time */}
            </div>

            <TimePickerModal
              isOpen={isCheckInModalOpen}
              selectedTime={checkInTime}
              onSelect={(time) => {
                setCheckInTime(time); // Set selected time
                setIsCheckInModalOpen(false); // Close modal after selection
              }}
              onRequestClose={() => setIsCheckInModalOpen(false)}
            />
          </div>

          {/* Check-out Date */}
          <div className="flex flex-row items-center relative z-50">
            <CiCalendarDate className="text-3xl text-gray-600 mr-1" />
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => {
                setCheckOutDate(date);
                setIsCheckOutModalOpen(true); // Open modal when date is selected
              }}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="체크아웃"
              className="w-full px-3 py-2 border rounded-full relative z-50"
              calendarClassName="relative z-50"
            />
            <div
              className="flex justify-center items-center bg-gray-100 rounded-full p-2 shadow-sm cursor-pointer ml-2 relative z-50"
              onClick={() => setIsCheckOutModalOpen(true)}
            >
              {checkOutTime || '00:00'} {/* Display selected time */}
            </div>

            <TimePickerModal
              isOpen={isCheckOutModalOpen}
              selectedTime={checkOutTime}
              onSelect={(time) => {
                setCheckOutTime(time); // Set selected time
                setIsCheckInModalOpen(false); // Close modal after selection
              }}
              onRequestClose={() => setIsCheckOutModalOpen(false)}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex gap-2 relative z-50">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-gray-500 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-600 transition duration-200"
          >
            <FiSearch className="text-lg" />
          </button>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 bg-gray-500 text-white py-2 px-4
            rounded-full hover:bg-gray-600 transition duration-200"
          >
            <LuAlignHorizontalDistributeCenter className="mr-0" />Filter
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleFilterApply}
          currentFilters={filters}
        />
      )}
        

      {/* Product Cards */}
      <div className="grid grid-cols-2 gap-7 sm:grid-cols-4 mt-12 mb-5"> {/* CardItem과 간격 추가 */}
        {place.map((place) => (
          <CardItem key={place._id} place={place} onClick={() => handleCardClick(place._id)}/>
        ))}
      </div>
    </section>
  );
};

export default GuestReservePage1;

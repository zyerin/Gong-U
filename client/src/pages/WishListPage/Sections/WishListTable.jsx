import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiLocationOn, CiUser, CiTrash, CiImageOn, CiShop, CiSliderHorizontal, CiDollar } from "react-icons/ci";

const WishListTable = ({ places, onRemoveItem, onBulkRemove }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (selectedItems.length === places.length && places.length > 0) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedItems, places]);

  const handleSelectItem = (placeId) => {
    setSelectedItems(prevState =>
      prevState.includes(placeId) ? prevState.filter(id => id !== placeId) : [...prevState, placeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === places.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(places.map(place => place._id));
    }
  };

  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0];
      return `${import.meta.env.VITE_SERVER_URL}/${image}`;
    }
  };

  const handleBulkRemove = () => {
    onBulkRemove(selectedItems);
    setSelectedItems([]); // 삭제 후 선택 항목 초기화
  };

  const renderItems = (
    places.length > 0 && places.map(place => (
      <tr key={place._id}>
        <td className='p-3 text-center'>
          <input
            type="checkbox"
            checked={selectedItems.includes(place._id)}
            onChange={() => handleSelectItem(place._id)}
          />
        </td>
        <td>
          <img className='w-[70px]' alt='place' src={renderCartImage(place.images)} />
        </td>
        <td className='p-3 text-center'>{place.title}</td>
        <td className='p-3 text-center'>{place.location}</td>
        <td className='p-3 text-center'>{place.maxPeople} 명</td>
        <td className='p-3 text-center'>{place.price} 원</td>
        <td className='p-3 text-center'>
          <Link to={`/place/${place._id}`}>예약하러가기</Link>
        </td>
        <td className='p-3 text-center text-xl'>
          <button onClick={() => {
            onRemoveItem(place._id);
            setSelectedItems(prevState => prevState.filter(id => id !== place._id)); // 삭제 후 선택 항목에서 제거
          }}>
            <CiTrash />
          </button>
        </td>
      </tr>
    ))
  );

  return (
    <div className='relative'>
      <table className='w-full text-sm text-left text-gray-500 table-auto'>
        <thead className='border-[1px]'>
          <tr>
            <th className='p-3 text-4xl text-center'>
              <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
            </th>
            <th className='p-3 text-3xl text-center'>
              <div className='flex justify-center'><CiImageOn /></div>
              <div className='text-xs mt-1 text-gray-600 font-thin'>Images</div>
            </th>
            <th className='p-3 text-3xl text-center'>
              <div className='flex justify-center'><CiShop /></div>
              <div className='text-xs mt-1 text-gray-600 font-thin'>Place</div>
            </th>
            <th className='p-3 text-3xl text-center'>
              <div className='flex justify-center'><CiLocationOn /></div>
              <div className='text-xs mt-1 text-gray-600 font-thin'>Location</div>
            </th>
            <th className='p-3 text-3xl text-center'>
              <div className='flex justify-center'><CiUser /></div>
              <div className='text-xs mt-1 text-gray-600 font-thin'>Max People</div>
            </th>
            <th className='p-3 text-3xl text-center'>
              <div className='flex justify-center'><CiDollar /></div>
              <div className='text-xs mt-1 text-gray-600 font-thin'>Price/hour</div>
            </th>
            <th className='p-3 text-3xl text-center'>
              <div className='flex justify-center'><CiSliderHorizontal /></div>
            </th>
            <th className='p-3 text-3xl text-center'>
              <div className='flex justify-center'><CiSliderHorizontal /></div>
            </th>
          </tr>
        </thead>

        <tbody>
          {renderItems}
        </tbody>
      </table>
      <div className='flex justify-end mt-5 mr-5'>
        <button
          className={`px-4 py-2 text-white text-sm rounded-lg ${selectedItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'}`}
          onClick={handleBulkRemove}
          disabled={selectedItems.length === 0}
        >
          선택 항목 삭제
        </button>
      </div>
    </div>
  );
};

export default WishListTable;

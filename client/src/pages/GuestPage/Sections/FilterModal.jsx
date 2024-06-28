import React, { useState, useEffect } from 'react';
import { FiX, FiFilter } from 'react-icons/fi';
import { LuAlignHorizontalDistributeCenter } from "react-icons/lu";

const FilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [typeFilters, setTypeFilters] = useState(currentFilters.type);
  const [optionsFilters, setOptionsFilters] = useState(currentFilters.options);

  useEffect(() => {
    setTypeFilters(currentFilters.type);
    setOptionsFilters(currentFilters.options);
  }, [currentFilters]);

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTypeFilters([...typeFilters, value]);
    } else {
      setTypeFilters(typeFilters.filter((type) => type !== value));
    }
  };

  const handleOptionsChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setOptionsFilters([...optionsFilters, value]);
    } else {
      setOptionsFilters(optionsFilters.filter((option) => option !== value));
    }
  };

  const handleApplyFilters = () => {
    const selectedFilters = {
      type: typeFilters,
      options: optionsFilters,
    };
    console.log('Modal Select', selectedFilters);
    onApply(selectedFilters);
  };

  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="relative bg-white p-6 rounded-lg w-96">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-600 hover:text-gray-800"
          style={{ outline: 'none' }} // 버튼 포커스 스타일 제거
        >
          <FiX className="text-2xl" />
        </button>
        <h3 className="text-md mb-5 text-center flex items-center justify-center">
          <LuAlignHorizontalDistributeCenter className="mr-2" /> 필터 선택
        </h3>

        {/* House, Apartment, Office, Other */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Type</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="house"
              checked={typeFilters.includes('house')}
              onChange={handleTypeChange}
              className="mr-2"
            />
            집
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="apartment"
              checked={typeFilters.includes('apartment')}
              onChange={handleTypeChange}
              className="mr-2"
            />
            아파트
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="office"
              checked={typeFilters.includes('office')}
              onChange={handleTypeChange}
              className="mr-2"
            />
            사무실
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="other"
              checked={typeFilters.includes('other')}
              onChange={handleTypeChange}
              className="mr-2"
            />
            기타
          </label>
        </div>

        {/* Parking, Non-smoking, Pets */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Options</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="주차공간"
              checked={optionsFilters.includes('주차공간')}
              onChange={handleOptionsChange}
              className="mr-2"
            />
            주차공간
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="금연구역"
              checked={optionsFilters.includes('금연구역')}
              onChange={handleOptionsChange}
              className="mr-2"
            />
            금연구역
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="업무 공간"
              checked={optionsFilters.includes('업무 공간')}
              onChange={handleOptionsChange}
              className="mr-2"
            />
            업무 공간
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="반려동물"
              checked={optionsFilters.includes('반려동물')}
              onChange={handleOptionsChange}
              className="mr-2"
            />
            반려동물
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="휠체어"
              checked={optionsFilters.includes('휠체어')}
              onChange={handleOptionsChange}
              className="mr-2"
            />
            휠체어
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              value="해변가"
              checked={optionsFilters.includes('해변가')}
              onChange={handleOptionsChange}
              className="mr-2"
            />
            해변가
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleApplyFilters}
            className="bg-gray-500 text-sm text-white py-2 px-4 rounded-md mr-2 hover:bg-gray-700 transition duration-200"
          >
            적용
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

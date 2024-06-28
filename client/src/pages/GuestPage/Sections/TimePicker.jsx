import React from 'react';
import Modal from 'react-modal';
import { FiClock, FiX  } from 'react-icons/fi';
import { LuTimer } from "react-icons/lu";
import { CgCloseR } from "react-icons/cg";

// 애플리케이션의 최상위 요소를 설정
Modal.setAppElement('#root'); // 'root'는 React 앱의 루트 요소입니다.

const TimePickerModal = ({ isOpen, onRequestClose, selectedTime, onSelect }) => {
  const times = Array.from({ length: 24 }, (_, i) => {
    const timeStr = `${i < 10 ? '0' : ''}${i}:00`;
    return {
      label: timeStr,
      value: timeStr,
    };
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex justify-center items-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{
        content: {
          outline: 'none' // 기본 포커스 스타일 제거
        }
      }}
    >
      <div className="relative bg-white p-6 rounded-lg w-96">
        <button
          onClick={onRequestClose}
          className="absolute top-2 left-2 text-gray-600 hover:text-gray-800"
          style={{ outline: 'none' }} // 버튼 포커스 스타일 제거
        >
          <FiX className="text-2xl" />
        </button>
        <h3 className="text-md mb-5 text-center flex items-center justify-center">
          <FiClock className="mr-2" /> 시간을 선택해주세요
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {times.map((time) => (
            <button
              key={time.value}
              className={`text-center p-2 bg-gray-100 rounded-full ${
                selectedTime === time.value ? 'bg-gray-300' : 'hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => {
                onSelect(time.value);
                onRequestClose(); // Close modal when time is selected
              }}
              style={{ outline: 'none' }} // 버튼 포커스 스타일 제거
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default TimePickerModal;

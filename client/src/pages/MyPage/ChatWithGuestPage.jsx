// ChatWithGuestPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axiosInstance from './../../utils/axios';

const socket = io('http://localhost:4001');

const ChatWithGuestPage = () => {
  const { placeId, guestId } = useParams();
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        if (response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    // 게스트 정보 가져오기
    const fetchGuestInfo = async () => {
      try {
        const response = await axiosInstance.get(`/users/${guestId}`);
        if (response.data) {
          setGuest(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching guest info:', error);
      }
    };

    // 이전 채팅 기록 가져오기
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/chat/${guestId}?place=${placeId}`);
        if (response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUserInfo();
    fetchGuestInfo();
    fetchMessages();
  }, [placeId, guestId]);

  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        sender: user._id,
        receiver: guest._id,
        place: placeId, // place 필드 추가
        content: message,
      };
      socket.emit('sendMessage', newMessage);
      setMessage('');
    }
  };

  if (!user || !guest) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-7">{guest.name} 님과의 대화</h1>
      <div className="chat-box bg-gray-100 p-4 rounded-lg shadow-lg h-96 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className={`message flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`p-3 rounded-lg shadow ${msg.sender === user._id ? 'bg-blue-400 text-white' : 'bg-gray-300 text-black'}`}>
              <span className="block font-semibold">{msg.sender === user._id ? '' : msg.senderName}</span>
              <span>{msg.content}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="input-box mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="w-full p-2 border rounded-l-lg"
        />
        <button onClick={sendMessage} className="bg-gray-400 text-white p-2 rounded-r-lg">
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatWithGuestPage;
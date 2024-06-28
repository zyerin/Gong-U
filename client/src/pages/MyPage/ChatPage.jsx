import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axiosInstance from './../../utils/axios';

const socket = io('http://localhost:4001');

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

const ChatPage = () => {
  const { hostId, placeId } = useParams();
  const [user, setUser] = useState(null);
  const [host, setHost] = useState(null);
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

    // 호스트 정보 가져오기
    const fetchHostInfo = async () => {
      try {
        const response = await axiosInstance.get(`/users/${hostId}`);
        if (response.data) {
          setHost(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching host info:', error);
      }
    };

    // 이전 채팅 기록 가져오기
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/chat/${hostId}?place=${placeId}`);
        if (response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUserInfo();
    fetchHostInfo();
    fetchMessages();
  }, [hostId, placeId]);

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
        receiver: host._id,
        place: placeId, // 추가된 place 필드
        content: message,
      };
      socket.emit('sendMessage', newMessage);
      setMessage(''); // 메시지를 보낸 후 입력창을 비웁니다.
    }
  };

  if (!user || !host) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-7">{host.name} 님과의 대화</h1>
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

export default ChatPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadComplete = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const navigateToMyPage = () => {
    navigate('/mypage')
  };

  
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  card: {
    backgroundColor: '#fff',
    padding: '50px', // 위아래 여백
    borderRadius: '5px',
    boxShadow: '2px 5px 5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width : '80%',
    maxWidth: '1000px',
    border: '4px solid #ccc', // 사각형 테두리
    borderRadius: '20px', // 둥근 모서리
  },
  header: {
    margin: '0 0 10px',
    fontSize: '25px',
    color: '#333',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: isHovered ? '#ebebeb' : '#f9e7f4',
    color: '#000',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'backgroundColor 0.3s',
  },
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>등록이 완료되었습니다!</h2>
        <p style={styles.message}>저희 서비스를 이용해 주셔서 감사합니다.</p>
        {/* 마이페이지 코드 삽입 */}
        <button style={styles.button} onClick={navigateToMyPage}
        onMouseEnter={()=> setIsHovered(true)}
        onMouseLeave={()=> setIsHovered(false)}
        on
        >마이페이지으로 이동</button>
      </div>
    </div>
  );

};

export default UploadComplete;


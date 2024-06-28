const express = require('express'); // Express 모듈 불러오기
const path = require('path'); // 절대경로 사용
const app = express(); // 새로운 Express 어플 생성
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io'); // socket.io 추가
const PORT =  process.env.PORT || 8080; // Express 서버를 위한 포트 설정
const mongoose = require('mongoose');
const Chat = require('./models/Chat');
const dotenv = require('dotenv');

dotenv.config();

const server = http.createServer(app); // http 서버 생성
// socket.io 서버 생성
const io = new Server(server, {
  cors: {
      origin: ['http://localhost:5173', 'http://localhost:8080', 'https://027a-61-254-29-21.ngrok-free.app'],  // 허용할 출처에 ngrok 도메인 추가
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
  }
});


app.use(cors());
app.use(express.json()); 


// app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('연결 완료');
    })
    .catch(err => {
        console.error(err);
    })

/*
app.get('/', (req, res) => {
    res.send('Hello World');
}); // '/' 이 경로로 요청이 들어오면 Hello World를 결과값으로 전달
*/

app.post('/', (req, res) => {
    // 클라이언트에서 요청을 보내면
    console.log(req.body); 
    // 이 body를 parsing 해서 
    // req.body 안에다가 클라이언트에서 보내준 body를 넣어주면 됨
    // 그러기 위해 express.json 미들웨어 등록

    res.json(req.body);
})

/*
// thunkFunctions.js에서 /users/register 이 경로로 요청을 보내면 여기서 요청을 받음
app.post('/users/register', (req, res) => {
    // 데이터베이스에 유저 데이터 저장 -> user 모델을 이용해서 저장
    // app.post 여러개 만들지 말고 routes의 user.js에 유저에 관한 요청 만듦

})
*/

// thunkFunctions.js에서 /users/.. 이 경로로 요청을 보내면 라우터를 전달
app.use('/users', require('./routes/users')); // users.js 파일에서 응답하게 됨
app.use('/products', require('./routes/products')) // /products/.. 이 경로로 요청이 오면 products.js 파일에서 응답
app.use('/place', require('./routes/place')) // /place/.. 이 경로로 요청이 오면 place.js 파일에서 응답
app.use('/chat', require('./routes/chat'))
app.use('/pay', require('./routes/pay'))

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send(error.message || '서버에서 에러가 났습니다.');
})

// uploads 폴더 안에 있는 정적인 파일들을 제공해줌
app.use(express.static(path.join(__dirname, '../uploads')));


// express app을 실행하는 listen
app.listen(PORT, () => {
        console.log('8080번에서 실행 되었습니다.')
}); // 해당 포트와 호스트에서 HTTP 서버를 시작

io.on('connection', (socket) => {
    console.log('새로운 클라이언트가 연결되었습니다.');
  
    socket.on('sendMessage', async (message) => {
      const { sender, receiver, content, place } = message;
      const newMessage = new Chat({
        sender,
        receiver,
        content,
        place
      });
      await newMessage.save();
      io.emit('receiveMessage', newMessage);
    });
  
    socket.on('disconnect', () => {
      console.log('클라이언트 연결이 끊어졌습니다.');
    });
  });
  

const PORT_SERVER = 4001;
io.listen(PORT_SERVER);
console.log(`Socket.io 서버 실행 중 - 포트: ${PORT_SERVER}`);
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 미들웨어 auth에서는?
// 1. 요청에서 넘어온 토큰이 올바른지 확인
// 2. 토큰이 올바르다면, 토큰 안에 유저 아이디가 들어있으므로 이 토큰을 복호화하면 payload(유저아이디)를 가질 수 있음
// **참고) login router에서 토큰을 생성할 때 payload에 유저 아이디를 넣어서 보내줌
// 3. 유저 아이디를 이용해서 DB에서 해당 userId를 가진 유저의 데이터를 다 가져옴
// 4. 가져온 유저의 데이터를 req.user에 넣어줌

let auth = async (req, res, next) => {
    // 토큰을 request headers에서 가져오기
    const authHeader = req.headers['authorization']; // authorization 전체를 가져옴

    // authorization 전체에서
    // authHeader를 가져올 때 Bearer 부분을 제외하고 뒤에만 가져오기 위해 split 사용하여 배열로 리턴해줌
    // ' '(스페이스)를 이용 -> Bearer(인덱스[0]으로 들어감)와 Token(인덱스[1])을 나눠줌
    const token = authHeader && authHeader.split(' ')[1]; // [1]을 가져와서 토큰만 가져옴
    if(token === null) return res.sendStatus(401);

    try {
        //1. 토큰이 유효한 토큰인지 확인
        const decode = jwt.verify(token, process.env.JWT_SECRET); // 2. 복호화
        const user = await User.findOne({ "_id": decode.userId }); // 3. DB에서 해당 유저 찾음
        if(!user){
            return res.status(400).send('없는 유저입니다.');
        }

        // 3. 유저가 있으면 req.user property에 유저 데이터를 넣어줌
        // router/user.js에서 auth 미들웨어를 통과하면 req.user에 유저 데이터를 넣어주고, 그리고 다시 router/users.js로 감
        req.user = user; 
        next();
    } catch(error){
        next(error);
    }
}

module.exports =  auth ;
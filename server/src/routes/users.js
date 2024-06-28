const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const Place = require('../models/Place');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const async = require('async');



/* router는 index.js에서 꼭 등록해줘야함! */

// endpoint /auth로 요청 들어오면 다음을 수행
// get 요청 받음
// ** 중간에 미들웨어로 auth 들어감
router.get('/auth', auth, async(req, res, next) => { 
    // console.log("router의 /auth 들어옴");
    // json을 client에게 reponse로 다시 보내줌
    // 여기에 유저 인증이 되어있는 유저의 데이터가 담겨있음
    // 그럼 이 데이터들은 어디에서 가져오는가?? -> 미들웨어 auth!! 에서 해줌 (middleware/auth.js)
    // 미들웨어에서는 토큰이 올바른지
    return res.json({ // json 형식으로 client에게 응답 보냄
        // 아래의 req.user property에는 user의 데이터들이 이미 다 들어있음 -> middleware/auth.js 통과했기 때문에 
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        wishlist: req.user.wishlist,
        history: req.user.history,
        
    })
})

// thunkFunctions.js에서 /register 이 경로로 요청을 보내면 여기서 요청을 받음
router.post('/register', async (req, res, next) => {
    // 데이터베이스에 유저 데이터 저장 -> user 모델을 이용해서 저장
    // app.post 여러개 만들지 말고 routes의 user.js에 유저에 관한 요청 만듦

    try{
        const user = new User(req.body);
        await user.save(); // 비동기 요청 끝날때까지 기다림
        return res.sendStatus(200);
    } catch(error){
        next(error);
    }

})

// /login(endpoint) 이 경로로 요청을 보내면 여기서 받음
router.post('/login', async (req, res, next) => {
    // req.body: password, emial (유저가 입력하는거)
    try{ 
        // 1. 존재하는 유저인지 체크
        // 이메일이랑 패스워드 보내주는걸 이용해서 해당 이메일에 맞는 유저가 데이터베이스에 있는지
        const user = await User.findOne({ email: req.body.email }); // 몽고디비에서 하나의 row에 유저가 있는지 찾음
        // "User"는 생성한 모델 불러온거고, 여기서 "user"는 User 모델에서 해당 user를 찾아서 저장한 것
        if (!user){    
            return res.status(400).send("Auth failed, email not found");
        }

        // 2. 유저는 존재, 비밀번호가 올바른지 체크
        // comparePassword 메소드는 user model(/models/User.js)에 생성
        const isMatch = await user.comparePassword(req.body.password); // true 아니면 false 반환됨
        if (!isMatch){ // 만약 false이면
            return res.status(400).send("Wrong Password!!");
        } 

        const payload = { // payload에 userId 넣어줌
            // 몽고디비의 아이디는 오브젝트로 되어있기 때문에
            userId: user._id.toHexString() // user에서 id를 가져와서
        }

        // token을 생성!!
        // 토큰 생성 후에 유저와 토큰 데이터 응답으로 client에게 보내주기
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'})
        console.log(accessToken);
        return res.json({ user, accessToken }) 
        // 클라이언트에게 유저 정보와 토큰을 보내줌
        // 얘내는 userSlice의 action.payload 부분이 된다.

    } catch (error){
        next(error);
    }
});

// thunkFunc.js에서 /logout 경로로 요청을 보내면 여기서 요청을 받음
router.post('/logout', auth, async (req, res, next) => { // auth 미들웨어 통과 -> 올바른 유저인지 체크
    try{
        return res.sendStatus(200);
    } catch(error){
        next(error);
    }

})

// thuckfunc의 addToCart에서 요청을 보냄
router.post('/cart', auth, async (req, res, next) => {
    try {

        // 먼저 User Collection에서 해당 유저의 정보를 가져오기 
        const userInfo = await User.findOne({ _id: req.user._id }) 

        // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
        let duplicate = false;
        userInfo.cart.forEach((item) => {
            if (item.id === req.body.productId) { // body -> { productId: product._id }
                duplicate = true;
            }
        })

        // 1. duplicate = true
        // 상품이 이미 있을 때 -> 유저 디비에서 cartd의 quantity (상품 개수)를 1개 더해주기
        if (duplicate) {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.body.productId }, // 같은 id 먼저 찾은 다음에,
                { $inc: { "cart.$.quantity": 1 } }, // cart id가 같은 object의 quantity에 1씩 increment해줌
                { new: true } // quantity가 업데이트 된 데이터를 리턴해줌
            )

            return res.status(201).send(user.cart); // 클라이언트에게 다시 응답 보내줌 -> action payload
        }


        // 2. 
        // 상품이 이미 있지 않을 때 -> 유저 디비의 cart에 필요한 상품 정보, 상품 ID, 개수 1, 날짜 정보 다 넣어줘야 함
        else {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id }, // 같은 아이디 먼저 찾음
                {
                    $push: { // 새롭게 데이터 넣어줌
                        cart: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true }
            )

            return res.status(201).send(user.cart); // 클라이언트에게 response 보냄 -> action payload
        }


    } catch (error) {
        next(error)
    }
})

// thuckfunc의 addToWishList에서 요청을 보냄
router.post('/wishlist', auth, async (req, res, next) => {
    try {

        // 먼저 User Collection에서 해당 유저의 정보를 가져오기 
        const userInfo = await User.findOne({ _id: req.user._id }) 

        // 가져온 정보에서 위시리스트에다 넣으려 하는 상품이 이미 들어 있는지 확인
        let duplicate = false;
        userInfo.wishlist.forEach((item) => {
            if (item.id === req.body.placeId) { // body -> { placeId: place._id }
                duplicate = true;
            }
        })

        // 1. duplicate = true
        // 상품이 이미 있을 때 -> 유저 디비에서 cartd의 quantity (상품 개수)를 1개 더해주기
        if (duplicate) {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id, "wishlist.id": req.body.placeId }, // 같은 id 먼저 찾은 다음에,
                { $inc: { "wishlist.$.quantity": 1 } }, // wishlist id가 같은 object의 quantity에 1씩 increment해줌
                { new: true } // quantity가 업데이트 된 데이터를 리턴해줌
            )

            return res.status(201).send(user.wishlist); // 클라이언트에게 다시 응답 보내줌 -> action payload
        }


        // 2. 
        // 상품이 이미 있지 않을 때 -> 유저 디비의 cart에 필요한 상품 정보, 상품 ID, 개수 1, 날짜 정보 다 넣어줘야 함
        else {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id }, // 같은 아이디 먼저 찾음
                {
                    $push: { // 새롭게 데이터 넣어줌
                        wishlist: {
                            id: req.body.placeId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true }
            )

            return res.status(201).send(user.wishlist); // 클라이언트에게 response 보냄 -> action payload
        }


    } catch (error) {
        next(error)
    }
})

// 장바구니 삭제 요청 ... removeCartItem thuck 함수에서
router.delete('/cart', auth, async (req, res, next) => {
    try {
        // 1) 데이터베이스에서 지움
        // 먼저 cart에서 지우려고 한 상품을 지워주기 ... pull 이용
        const userInfo = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                "$pull":
                    { "cart": { "id": req.query.productId } }
            },
            { new: true } // 삭제 반영
        )

        // userInfo.cart에는 지워진 상품 제외하고 남아있음
        const cart = userInfo.cart;
        const array = cart.map(item => {
            return item.id
        })

        // product 모델에서 현재 남아있는 상품들(array의 id에 해당하는)의 정보 가져오기
        const productInfo = await Product
            .find({ _id: { $in: array } })
            .populate('writer')

        // client에게 response로 전달 -> 2) 리덕스에서 지움
        return res.json({
            productInfo, // cart에 담긴 모든 상품들의 데이터
            cart
        })

    } catch (error) {
        next(error);
    }
})

// 위시리스트 삭제 요청 ... removeWishlistItem thuck 함수에서
router.delete('/wishlist', auth, async (req, res, next) => {
    try {
        // 1) 데이터베이스에서 지움
        // 먼저 cart에서 지우려고 한 상품을 지워주기 ... pull 이용
        const userInfo = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                "$pull":
                    { "wishlist": { "id": req.query.placeId } }
            },
            { new: true } // 삭제 반영
        )

        // userInfo.cart에는 지워진 상품 제외하고 남아있음
        const wishlist = userInfo.wishlist;
        const array = wishlist.map(item => {
            return item.id
        })

        console.log(wishlist);

        // product 모델에서 현재 남아있는 상품들(array의 id에 해당하는)의 정보 가져오기
        const placeInfo = await Place
            .find({ _id: { $in: array } })
            .populate('writer');

        
        // client에게 response로 전달 -> 2) 리덕스에서 지움
        return res.json({
            placeInfo, // cart에 담긴 모든 상품들의 데이터
            wishlist
        })

    } catch (error) {
        next(error);
    }
})


// 결제 기능 요청
router.post('/payment', auth, async (req, res) => {

    /* 데이터들 생성 */
    let history = [];
    let transactionData = {};

    // 1) User 모델의 History 필드 안에 간단한 결제 정보 넣어주기
    // 요청으로 받은 cartDetail을 forEach로 하나씩 돌면서 history 빈 배열에다가 push 메소드로 넣어줌
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: new Date().toISOString(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: crypto.randomUUID(), // 랜덤 값 생성해서 unique한 값
        })
    })

    // 2) Payment Collection 안에 들어갈 결제 정보들
    transactionData.user = { // 누가 구매했는지
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.product = history; // product(구매한 상품)에 대한 정보 -> history에 있음


    /* 데이터베이스에 저장하기 */
    // 1) user collection에 history 정보 저장
    await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: { $each: history } }, $set: { cart: [] } }, // 결제를 하면 cart는 비워줌

        // $each가 있어야지 history 배열 안에 object들(객체)로 들어가게 됨
        // 만약 { $push: { history: { history } } 이렇게 하면 배열 안에 배열 자체로 들어감
    )

    // 2) payment collection에  transactionData 정보 저장
    const payment = new Payment(transactionData);
    const paymentDocs = await payment.save();

    let products = [];
    paymentDocs.product.forEach(item => {
        products.push({ id: item.id, quantity: item.quantity })
    })

    // product 여러 개에 대해 하나씩 sold를 올려주기 위해 async.eachSeries 통해 순환하면서 올려줌
    async.eachSeries(products, async (item) => {
        await Product.updateOne(
            { _id: item.id },
            {
                $inc: {
                    "sold": item.quantity
                }
            }
        )
    },
        (err) => {
            if (err) return res.status(500).send(err)
            return res.sendStatus(200)
        })

})

router.post('/reserve', auth, async (req, res) => {

    try {
        // 클라이언트로부터 받은 데이터
        const { placeId, title, location, checkInDate, checkOutDate, guests, wallet, price } = req.body;

        //checkInDate = new Date(checkInDate).toISOString().slice(0, 16).replace('T', ' '); // "YYYY-MM-DD HH:mm" 형식으로 변환
        // console.log(checkInDate);

        // 현재 로그인된 사용자의 ID
        const guestId = req.user._id;

        // user 모델의 reserved에 저장할 데이터 생성
        const reserved = {
            place: placeId,
            title,
            location,
            checkInDate,
            checkOutDate,
            guests,
            price,
        };

        // Reservation 모델에 저장할 데이터 생성
        const reservationData = {
            place: placeId,
            title,
            location,
            checkInDate,
            checkOutDate,
            guests,
            guest: guestId,
            price,
        };

        console.log(checkInDate, checkOutDate);

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // 이미 예약된 항목 중에서 겹치는 예약이 있는지 확인
        const existingReservations = await Reservation.find({
            place: placeId,
            $or: [
                //{ checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
                //{ checkOutDate: { $gt: checkInDate }, checkInDate: { $lt: checkOutDate } },
                { 
                    checkInDate: { $lt: new Date(checkOut.getTime() + 3600000) }, // 체크인 시간을 한 시간 늦춘다
                    checkOutDate: { $gt: new Date(checkIn.getTime() - 3600000) } // 체크아웃 시간을 한 시간 늦춘다
                },
                { 
                    checkOutDate: { $gt: new Date(checkIn.getTime() - 3600000) }, // 체크아웃 시간을 한 시간 늦춘다
                    checkInDate: { $lt: new Date(checkOut.getTime() + 3600000) } // 체크인 시간을 한 시간 늦춘다
                },
            ],
        });

        console.log(existingReservations);
        // 겹치는 예약이 있는지 확인
        if (existingReservations.length > 0) {
            return res.status(400).json({ message: '이미 해당 날짜와 시간에 예약이 있습니다.' });
        } else{
            // 겹치는 예약이 없으면 예약 저장
            const reservation = new Reservation(reservationData); // 1) reservation 모델에 저장
            await reservation.save();

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $push: { reserved: reserved }}, // 2) user 모델의 reserved에 예약정보 저장
            )
            
            // 클라이언트에게 응답
            res.status(201).json({ reservation });

        }

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '예약에 실패했습니다.' });
    }
});

// 예약 가능 여부 체크
router.post('/check', auth, async (req, res) => {
    try {
        // 클라이언트로부터 받은 데이터
        const { placeId, checkInDate, checkOutDate } = req.body;

        console.log(checkInDate, checkOutDate);

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // 이미 예약된 항목 중에서 겹치는 예약이 있는지 확인
        const existingReservations = await Reservation.find({
            place: placeId,
            $or: [
                { 
                    checkInDate: { $lt: new Date(checkOut.getTime() + 3600000) }, // 체크인 시간을 한 시간 늦춘다
                    checkOutDate: { $gt: new Date(checkIn.getTime() - 3600000) } // 체크아웃 시간을 한 시간 늦춘다
                },
                { 
                    checkOutDate: { $gt: new Date(checkIn.getTime() - 3600000) }, // 체크아웃 시간을 한 시간 늦춘다
                    checkInDate: { $lt: new Date(checkOut.getTime() + 3600000) } // 체크인 시간을 한 시간 늦춘다
                },
            ],
        });

        if (existingReservations.length > 0) {
            return res.status(400).json({ message: '이미 해당 날짜와 시간에 예약이 있습니다.' });
        } else {
            return res.status(200).json({ message: '예약 가능' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '예약 가능 여부를 확인하는 데 실패했습니다.' });
    }
});

// 현재 로그인된 사용자 정보 가져오기
router.get('/me', auth, async (req, res) => {
    res.send({ user: req.user });
});
  
// 특정 사용자 정보 가져오기 (호스트 정보)
router.get('/:id', auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.send({ user });
    } catch (error) {
      res.status(500).send({ error: 'Server error' });
    }
});  

// 게스트 지갑 주소 가져오기
router.get('/:guestId/wallet', auth, async (req, res) => {
    const { guestId } = req.params;

    try {
        const guest = await User.findById(guestId);
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        res.status(200).json({ walletAddress: guest.wallet });
    } catch (error) {
        console.error('Error fetching guest wallet address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 사용자 계정 정보 수정 라우트
router.put('/account/:id', auth, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send(user);
    } catch (err) {
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });

module.exports = router;
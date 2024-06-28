const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Place = require('../models/Place');
const multer = require('multer');
const Reservation = require('../models/Reservation');
const Cancel = require('../models/Cancel');
const User = require('../models/User');

// router는 index.js에서 꼭 등록해줘야함!
const storage = multer.diskStorage({
    destination: function (req, file, cb){ // 저장할 경로 지정
        cb(null, 'uploads/') // uploads 폴더에 이미지를 넣어줌
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`) // Date.now로 고유한 파일 이름 만들어줌
    }
})

const upload = multer({ storage: storage}).single('file') // 'file'이 FileUpload.jsx에서 append 해주는 이름이랑 같아야 함

router.post('/image', auth, async(req, res, next) => {
    upload(req, res, err => {
        if (err) {
            return req.status(500).send(err);
        }
        return res.json({ fileName: res.req.file.filename})
    })
})

// Detail 페이지에서 보여줄 데이터들을 요청 받아서 보내주는 라우트
router.get('/:id', auth, async (req, res, next) => { // 로그인 된 사람만 접근 가능 -> auth

    const type = req.query.type;
    let placeIds = req.params.id; // axiosInstance.get(`/place/${placeId}?type=single`); -> placeId가 req.params.id이므로


    if(type === 'array') { // 요청 type이 array라면
        // cartItme들 가져오기 위해...여러 개의 상품 id가 배열로 바꿔줌
    
        let ids = placeIds.split(','); // id=32423423423,345345345345345,345345345 이거를 
        placeIds = ids.map(item => { // productIds = ['32423423423', '345345345345345345', '345345345345345'] 이런 식으로 바꿔주기
            return item
        })
    }

    // placeIds 이용해서 DB에서 placeId와 같은 상품의 정보를 가져옴
    try {
        // single로 보내면 하나의 아이디만 같으면 되지만, 여러 개의 아이디와 같을 수 있게 $in 사용
        const place = await Place //여러 개의 place id -> 여러 개의 상품 가져옴 (arrray로 보내면)
            .find({ _id: { $in: placeIds } }) // id가 같은 상품들만 가져옴
            .populate('writer');

        return res.status(200).send(place);

    } catch (error) {
        next(error);
    }

})


// 랜딩페이지!!!
router.get('/', async (req, res, next) => {
    const order = req.query.order ? req.query.order : 'desc'; // localhost:4000/product?order=desc
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id'; // 아이디 이용하여 정렬
    // const limit = req.query.limit ? Number(req.query.limit) : 20;
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const location = req.query.location || null; // 쿼리 파라미터 가져오기
    const guests = req.query.guests ? Number(req.query.guests) : 1;
    const { checkIn, checkOut } = req.query;
    const { filters } = req.query;

    console.log('Filters:', filters); // 필터 조건 확인용 로그
    
    try {
        
        // const placeInfo = await User.findOne({ _id: req.palce._id })

        let query = {}; // 기본적으로 빈 쿼리 객체

        // 지역 선택 필터링
        if (location) {
            query.location = location; // location이 있을 경우 필터링
        } 

        // 제한인원 필터링
        query.maxPeople = { $gte: guests }; // maxPeople이 guests보다 크거나 같아야 함
        
        // 겹치는 예약 제거
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            console.log(checkInDate, checkOutDate);
            // 주어진 범위에 겹치는 예약 찾기
            const overlappingReservations = await Reservation.find({
            $or: [
                //{ checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
                //{ checkOutDate: { $gt: checkInDate }, checkInDate: { $lt: checkOutDate } },
                { 
                    checkInDate: { $lt: new Date(checkOutDate.getTime() + 3600000) }, // 체크인 시간을 한 시간 늦춘다
                    checkOutDate: { $gt: new Date(checkInDate.getTime() - 3600000) } // 체크아웃 시간을 한 시간 늦춘다
                },
                { 
                    checkOutDate: { $gt: new Date(checkInDate.getTime() - 3600000) }, // 체크아웃 시간을 한 시간 늦춘다
                    checkInDate: { $lt: new Date(checkOutDate.getTime() + 3600000) } // 체크인 시간을 한 시간 늦춘다
                },
            ],
            });
    
            const overlappingPlaceIds = overlappingReservations.map((res) => res.place);
    
            // 겹치는 숙소를 제외
            query._id = { $nin: overlappingPlaceIds }; // 겹치는 숙소 제외

            
        }
        
        
        if (filters && filters.type) {
          query.type = { $in: filters.type };
        }
    
        if (filters && filters.options) {
          query.option = { $all: filters.options };
        }
        
        console.log('Query:', query); // 최종 쿼리 확인용 로그

        // 최종 숙소를 필터링
        const place = await Place.find(query) // 겹치지 않는 숙소만 검색
            .populate("writer") // 작성자 정보를 함께 가져옴
            .sort([[sortBy, order]]) // 정렬 기준
            .skip(skip); // 페이징
               
        
        const placeTotal = await Place.countDocuments( query ); // 총 숙소 개수

        /* const hasMore = skip + limit < placeTotal; // 더 가져올 수 있는지 여부 */

        return res.status(200).json({
            place,
        
    });
    }catch (error){
        next(error);
    }
})

// HostPageOption7에서 /place로 post 요청 ... endpoint가 '/'
// Place 모델에 저장
router.post('/', auth, async(req, res, next) => { // 로그인 된 사람만 업로드 가능하므로 -> auth 미들웨어 통과시킴
    try {
        // 1. 인스턴스 객체 생성
        const place = new Place(req.body);   // req.body에 writer, title, description, price, images, location 들어있음!!

        // 2. save 메소드 이용해서 DB에 저장
        place.save();
        return res.sendStatus(201);
    } catch(error){
        next(error);
    }
    
})

// 호스트의 거래 내역을 반환
router.get('/history/host', auth, async (req, res) => {
    try {
        const hostHistory = await Place.find({ writer: req.user._id })
            .populate('writer')
            .sort({ createdAt: -1 })
            .exec();
        
        return res.json(hostHistory);
    } catch (err) {
        console.error('Error fetching host history:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 숙소 정보 수정 라우트
router.put('/:id', auth, async (req, res) => {
    try {
      const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!place) {
        return res.status(404).send({ message: 'Place not found' });
      }
      res.send(place);
    } catch (err) {
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });

// 숙소를 예약한 게스트 정보 가져오는 라우트
router.get('/guests/:id', auth, async (req, res) => {
    try {
      const reservations = await Reservation.find({ place: req.params.id }).populate('guest');
      res.send(reservations);
    } catch (err) {
      res.status(500).send({ message: 'Internal Server Error' });
    }
});
  
// 유저의 예약 내역을 가져오는 라우트
router.get('/history/guest', auth, async (req, res) => {
    try {
      // 로그인된 사용자의 게스트 예약 내역을 가져오기
      const reservations = await Reservation.find({ guest: req.user._id }).populate('place');
      res.json(reservations);
    } catch (err) {
      console.error('Error fetching guest reservations:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 게스트의 취소 요청
router.post('/cancel/:placeId/:reservationId', auth, async (req, res) => {
    const { placeId, reservationId } = req.params;
    const guestId  = req.user._id;
    try {
      // 게스트 예약 조회
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      // 이미 취소 요청이 있는지 확인
      const existingCancelRequest = await Cancel.findOne({ guestReservationId: reservationId });
      if (existingCancelRequest) {
          return res.status(400).json({ message: '이미 예약 취소를 요청하셨습니다. 호스트가 요청을 승인할 때까지 기다려주십시오.' });
      }

      // 게스트 정보 조회
      const guest = await User.findById(guestId);
      if (!guest) {
        return res.status(404).json({ message: 'Guest not found' });
      }
      
      // 환불 요청 생성
      const newCancel = new Cancel({
        guestReservationId: reservationId,
        placeId: placeId,
        guestId: guestId,
        guestName: guest.name,
        title: reservation.title,
        location: reservation.location,
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        price: reservation.price,

      });
      await newCancel.save();
      
      res.status(201).json(newCancel);
    } catch (error) {
      console.error('Error creating refund request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});
  
// 호스트의 취소 요청 목록 조회
router.get('/cancel/host/:id', auth, async (req, res) => {
    const { id } = req.params;
    const hostId = req.user._id; 
    try {
      const refundRequests = await Cancel.find({ placeId: id }).populate('guestReservationId');
      res.status(200).json(refundRequests);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});
  
// PUT: 환불 요청 승인
router.put('/refundRequests/:refundRequestId/accept', async (req, res) => {
    const { refundRequestId } = req.params;
    try {
      const refundRequest = await Cancel.findByIdAndUpdate(refundRequestId, { status: 'accepted' }, { new: true });
      res.status(200).json(refundRequest);
    } catch (error) {
      console.error('Error accepting refund request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// PUT: 환불 요청 거절
router.put('/refundRequests/:refundRequestId/reject', async (req, res) => {
    const { refundRequestId } = req.params;
    try {
      const refundRequest = await Cancel.findByIdAndUpdate(refundRequestId, { status: 'rejected' }, { new: true });
      res.status(200).json(refundRequest);
    } catch (error) {
      console.error('Error rejecting refund request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

// 예약 삭제
router.delete('/:reservationId/cancel', auth, async (req, res) => {
    const { reservationId } = req.params;

    try {
        const reservation = await Reservation.findByIdAndDelete(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '예약이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('예약 삭제 중 오류 발생:', error);
        res.status(500).json({ message: '예약 삭제 중 오류가 발생했습니다.' });
    }
});

// 취소 요청 내역 가져오기
router.get('/cancel/history', auth, async (req, res) => {
    try {
      const cancelRequests = await Cancel.find({ guestId: req.user._id }).populate('guestReservationId');
      res.status(200).json(cancelRequests);
    } catch (error) {
      console.error('취소 요청 내역 가져오기 중 오류 발생:', error);
      res.status(500).json({ message: '취소 요청 내역을 가져오는 중 오류가 발생했습니다.' });
    }
  });

module.exports = router;
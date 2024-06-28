const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');

/* router는 index.js에서 꼭 등록해줘야함! */

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
    let productIds = req.params.id; // axiosInstance.get(`/place/${placeId}?type=single`); -> placeId가 req.params.id이므로

    if(type === 'array') { // 요청 type이 array라면
        // cartItme들 가져오기 위해...여러 개의 상품 id가 배열로 바꿔줌
    
        let ids = productIds.split(','); // id=32423423423,345345345345345,345345345 이거를 
        productIds = ids.map(item => { // productIds = ['32423423423', '345345345345345345', '345345345345345'] 이런 식으로 바꿔주기
            return item
        })
    }

    // productIds 이용해서 DB에서 productId와 같은 상품의 정보를 가져옴
    try {
        // single로 보내면 하나의 아이디만 같으면 되지만, 여러 개의 아이디와 같을 수 있게 $in 사용
        const product = await Product //여러 개의 place id -> 여러 개의 상품 가져옴 (arrray로 보내면)
            .find({ _id: { $in: productIds } }) // id가 같은 상품들만 디비에서 가져옴
            .populate('writer');

        return res.status(200).send(product);

    } catch (error) {
        next(error);
    }

})

// getProduct 라우트
// 'product/' 경로로 요청 들어오면!
router.get('/', async (req, res, next) => { // 데이터 가져오므로 get 메소드, 아무나 가져올 수 있으므로(상품 구경 가능) auth 미들웨어 제외
    // asc 오름차순  , desc 내림차순
    // query: 요청 옵션
    const order = req.query.order ? req.query.order : 'desc'; // localhost:4000/product?order=desc
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id'; // 아이디 이용하여 정렬
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const term = req.query.searchTerm;

    let findArgs = {};
    for (let key in req.query.filters) { // key=continents 또는 prices
        if (req.query.filters[key].length > 0) { // 여러 개의 필터들의 키(continents/prices 배열에서 id의 값)
            if (key === "price") {
                findArgs[key] = { // 객체에 키를 property로 해서 넣어줌

                    // 몽고 디비에서 조건에 맞게 그 가격 안에 있는 product들을 가져와야 함!!
                    // [200, 249] 에서 200이 [0], 249가 [1]에 해당

                    //Greater than equal
                    $gte: req.query.filters[key][0],
                    //Less than equal
                    $lte: req.query.filters[key][1]
                }
            } else { // continents 
                findArgs[key] = req.query.filters[key];
            }
        }
    }

    // 검색기능
    // findArgs: 몽고디비에서 제공
    if (term) { // 작성한 값(=term)이 있다면
        findArgs["$text"] = { $search: term }; // term을 search property의 값으로 넣어줌
    }

    console.log(findArgs);


    try {
        const products = await Product.find(findArgs)
            .populate('writer') // writer에는 유저 id가 들어가있음, // populate 메소드는 데이터를 가지고 올 때, 해당 유저의 모든 정보를 가져옴
            .sort([[sortBy, order]]) // 어떻게 정렬을 할 것인지 ... 예) id를 통해서? order(먼저 생성한 것을 위로/아래로)?
            .skip(skip)
            .limit(limit)

        // 조건에 맞는 product의 count가 몇 개 있는지 총 total 가져옴
        // 현재 더 가져올게 있는지 없는지 (있다면 더보기 버튼 보여줘야하므로) 판단하기 위해 total 필요
        const productsTotal = await Product.countDocuments(findArgs); // 몽고디비에서 row의 역할 = documents
        const hasMore = skip + limit < productsTotal ? true : false; // 가져와야할 총 개수보다 작을 경우 hasMore=true 아니면 false

        return res.status(200).json({ // client에게 보내줌
            products,
            hasMore // hasMore 값 response로 전달해주어서 더 보기 버튼 보여줄건지 없앨건지 판단해주면 됨
        })

    } catch (error) {
        next(error);
    }
})

// UploadProductPage에서 /products로 post 요청 ... endpoint가 '/'
// Product 모델에 저장
router.post('/', auth, async(req, res, next) => { // 로그인 된 사람만 업로드 가능하므로 -> auth 미들웨어 통과시킴
    try {
        // 1. 인스턴스 객체 생성
        const product = new Product(req.body);   // req.body에 writer, title, description, price, images, location 들어있음!!

        // 2. save 메소드 이용해서 DB에 저장
        product.save();
        return res.sendStatus(201);
    } catch(error){
        next(error);
    }
    
})




module.exports = router;
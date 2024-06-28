const{default: mongoose, Schema} = require("mongoose");

const placeSchema = mongoose.Schema({
    writer: { // 이 product를 생성한 사람이 누구인지 저장
        type: Schema.Types.ObjectId,
        ref: 'User' // User 모델의 Id(objecId)를 참조 ... 
    },
    type: {
        type: String,
        maxLength: 30
    },
    location: {
        type: String,
        required: true, // 지역은 필수
    },
    address: {
        type: String,
        required: true, // 주소는 필수
    },
    realAddress: {
        type: String,
        required: true, // 주소는 필수
    },
    title: {
        type: String,
        required: true, // 제목은 필수
    },
    maxPeople: {
        type: Number,
        default: 1, // 최대 인원
    },
    roomNum: {
        type: Number,
        default: 1, // 방 개수
    },
    password: {
        type: String,
        required: true, // 패스워드는 필수
    },
    minPrice: {
        type: Number,
        required: true, // 가격은 필수
    },
    minTime: {
        type: Number,
        required: true, // 가격은 필수
    },
    price: {
        type: Number,
        required: true, // 가격은 필수
    },
    description: {
        type: String,
    },
    guestMessage: {
        type: String,
    },
    option: {
        type: Array,
        default: []
    },
    images: {
        type: Array,
        default: []
    },
    }, {
      timestamps: true, // 생성 및 업데이트 시간 자동 생성
});


// 모델도 몽구스를 이용해 생성
const Place = mongoose.model("Place", placeSchema);

// 다른 모듈에서 이 User 모델을 사용해서 데이터베이스 데이터 조작 가능
module.exports = Place;
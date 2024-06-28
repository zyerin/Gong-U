const{default: mongoose, model} = require("mongoose");

const paymentSchema = mongoose.Schema({
    user: { // 구매한 사람
        type: Object,
    },
    data: { // 결제 정보들 (ex. 메타마스크를 이용하여 구매한 정보)
        type: Array,
        default: [],
    },
    product: { // 구매한 상품 정보들
        type: Array,
        default: []
    }
}, {timestamps: true})

// 모델도 몽구스를 이용해 생성
const Payment = mongoose.model("Payment", paymentSchema);

// 다른 모듈에서 이 User 모델을 사용해서 데이터베이스 데이터 조작 가능
module.exports = Payment;
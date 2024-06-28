const{default: mongoose, Schema} = require("mongoose");

const productSchema = mongoose.Schema({
    writer: { // 이 product를 생성한 사람이 누구인지 저장
        type: Schema.Types.ObjectId,
        ref: 'User' // User 모델의 Id(objecId)를 참조 ... 
    },
    title: {
        type: String,
        maxLength: 30
    },
    description: {
        type: String,
    },
    price: {
        type:  Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: { // 얼마나 팔렸는지
        type: Number,
        default: 0
    },
    continents:{ // 어느 지역인지
        type: Number,
        default: 1
    },
    views: { // 이 상품을 몇 번이나 봤는지
        type: Number,
        default: 0
    }

})

// Search 기능을 가능하게 하기 위해서 Product Schema에 index를 추가로 생성해야 함!!
productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights: { // 타이틀의 중요도를 더 높게 줌
        title: 5, 
        description: 1
    }
})

// 모델도 몽구스를 이용해 생성
const Product = mongoose.model("Product", productSchema);

// 다른 모듈에서 이 User 모델을 사용해서 데이터베이스 데이터 조작 가능
module.exports = Product;
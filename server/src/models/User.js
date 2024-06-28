const{default: mongoose, model} = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50, // 50자 이내로 제한
        unique: true // 유일
    },
    email: {
        type: String,
        trim: true, // 빈칸 없애줌(space)
        unique: true // 유일
    },
    password: {
        type: String,
        minLength: 5, // 비밀번호 최소 5자 이상
    },
    wallet: {
        type: String,
        unique: true,
        trim: true,
    },
    role: {
        type: Number,
        default: 0 // 일반 유저 '0'(디폴트), admin 유저 '1'
    },
    cart: {
        type: Array,
        default: []
    },
    wishlist: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    reserved: {
        type: Array,
        default: []
    },
    image: String
})

// 모델 생성하기 전에 미들웨어 거침(비밀번호 암호화)
userSchema.pre('save', async function(next){
    let user = this;

    if(user.isModified('password')){ // 사용자 이름같이 다른거 바꿀 때는 비밀번호 암호화X -> 암호화는 비밀번호 생성 + 변경 시에만 해주도록
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash; // 해쉬된 패스워드로 넣어줌
 
    }
    
    next(); // next해줘야 미들웨어에 갇히지 않고 넘어감 
})

// plainpassword랑 hasedpassword가 같은지 확인하는 메소드
userSchema.methods.comparePassword = async function (plainPassword) {
    let user = this; // 데이터베이스의 유저의 정보가 this에 들어있음
    console.log(user);
    // 암호화된 비밀번호는 복호화 불가
    // plainPassword를 암호화하여 현재 암호화되어있는 user.password와 비교
    const match = await bcrypt.compare(plainPassword, user.password);
    return match; // 같다면 true, 다르면 false 리턴
}

// 모델도 몽구스를 이용해 생성
const User = mongoose.model("User", userSchema);

// 다른 모듈에서 이 User 모델을 사용해서 데이터베이스 데이터 조작 가능
module.exports = User;
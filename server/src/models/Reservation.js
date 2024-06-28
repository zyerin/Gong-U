const{default: mongoose, Schema} = require("mongoose");

const ReservationSchema = new Schema({
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place', // 예약된 숙소
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true, 
    },
    checkInDate: {
        type: Date,
        required: true // 체크인 날짜
    },
    checkOutDate: {
        type: Date,
        required: true // 체크아웃 날짜
    },
    guests: {
        type: Number,
        required: true // 예약한 인원수
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'User', // 예약을 요청한 게스트
        required: true
    },
    price: { // 송금할 클레이
        type: Number,
        required: true
    },
}, {
    timestamps: true // 생성 및 업데이트 시간 자동 생성
});

const Reservation = mongoose.model("Reservation", ReservationSchema);

module.exports = Reservation;

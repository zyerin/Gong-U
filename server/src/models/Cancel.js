const{default: mongoose, Schema} = require("mongoose");

const CancelRequestSchema = new Schema({
    guestReservationId: { // 예약정보
      type: Schema.Types.ObjectId,
      ref: 'Reservation', 
      required: true,
    },
    placeId: { // place 정보
      type: Schema.Types.ObjectId,
      ref: 'Place', 
      required: true,
    },
    guestId: { // 게스트 정보
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    guestName: {
        type: String,
        required: true,
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
    price: { // 송금할 클레이
        type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Cancel = mongoose.model('Cancel', CancelRequestSchema);
  
  module.exports = Cancel;

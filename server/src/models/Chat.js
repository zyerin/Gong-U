const{default: mongoose, Schema} = require("mongoose");

const chatSchema = new mongoose.Schema({

    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiver: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    place: { 
        type: Schema.Types.ObjectId,  
        ref: 'Place', 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
  });
  
  const Chat = mongoose.model('Chat', chatSchema);

  module.exports = Chat;
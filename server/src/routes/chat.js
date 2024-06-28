const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Place = require('../models/Place');
const multer = require('multer');
const Reservation = require('../models/Reservation');
const Chat = require('../models/Chat');

// 게스트가 호스트랑 채팅
router.get('/:hostId', auth, async (req, res) => {
    const { hostId } = req.params;
    const { place } = req.query;
    const userId = req.user._id; // 인증된 사용자 ID
  
    try {
      const messages = await Chat.find({
        place: place,
        $or: [
          { sender: hostId, receiver: userId },
          { sender: userId, receiver: hostId }
        ]
      }).sort('timestamp');
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching messages' });
    }
  });
  
// 호스트가 게스트랑 채팅
router.get('/:guestId', async (req, res) => {
    const { guestId } = req.params;
    const { place } = req.query;
    const userId = req.user._id; // 인증된 사용자 ID
  
    try {
        const messages = await Chat.find({
            place: place,
            $or: [
                { sender: guestId, receiver: userId },
                { sender: userId, receiver: guestId }
            ]
        }).sort('timestamp');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

  
// 메시지 저장
router.post('/', auth, async (req, res) => {
    const { receiver, content, place } = req.body;
  
    try {
      const message = new Chat({
        sender: req.user._id,
        receiver,
        content,
        place // 필수 필드로 포함
      });
      await message.save();
      res.json(message);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  });
  


module.exports = router;
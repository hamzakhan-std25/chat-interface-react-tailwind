const express = require('express');
const router = express.Router();
const { saveMessage, getMessages } = require('../services/chatService')
// Define routes on the router object
router.get('/', (req, res) => {
  res.status(200).json({ massage: 'chats are not available' });
});


// Define routes on the router object
router.get('/getMessages/:id', async (req, res) => {
  const sessionId = req.params.id;
  const response = await getMessages(sessionId);
  res.status(200).json({ massage: "response from getMessages and id :", response });
});

// Define routes on the router object
router.post('/addMessage', async (req, res) => {


  const newMessage = await saveMessage({
    user_id: "firebase_uid_123",
    user_name: "Hamza",
    session_id: "550e8400-e29b-41d4-a716-446655440000",
    role: "user",
    message_text: "Hello AI!"
  });
  console.log("Saved:", newMessage);

  res.status(200).json({ massage: "save message in database  :", newMessage });
});



module.exports = router;
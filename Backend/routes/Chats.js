    const express = require('express');
    const router = express.Router();

    // Define routes on the router object
    router.get('/', (req, res) => {
      res.status(200).json({massage : 'chats are not available'});
    });
 

    router.get('/:id', (req, res) => {
      res.status(200).json({chatId:`Chat ID: ${req.params.id} and chats are not available`});
    });

    module.exports = router;
const express = require('express')
const multer = require('multer');
const upload = multer();

const router = express.Router();    


router.post('/', upload.single('file'), (req, res) => {

    console.log('upload requisting...')


    // if (!req.file) {
    //     return res.status(400).send('No file uploaded.');
    // }
    // // req.file.buffer contains the ArrayBuffer as a Node.js Buffer
    // const buffer = req.file.buffer;
    // console.log(buffer);
    // Process the buffer (e.g., save to disk, process image)
    res.send('Blob received and processed.');

});

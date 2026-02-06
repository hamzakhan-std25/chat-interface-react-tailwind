const express = require('express')
const multer = require('multer');
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const router = express.Router();


const upload = multer({ dest: "uploads/" });

// 🔹 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ check status using get request
router.get('/', (req, res) => {
  console.log('upload call as get request... ')
  res.status(200).json({ message: "upload rount is working and post request will process..." })
});

// ✅ check status using get request
router.get('/', (req, res) => {
  console.log('upload call as get request... ')
  res.status(200).json({ message: "upload rount is working and post request will process..." })
});


// ✅ Upload audio to Cloudinary
router.post("/", upload.single("audio"), async (req, res) => {
  console.log('upload call as post request... ')

  try {

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "voices" }, // video type also supports audio
      (error, uploaded) => {

        if (error) {
          console.log('Error in upload: ', error.message)
          return res.status(500).json({ error });
        }
        console.log('Upload success. URL:', uploaded.secure_url);
        res.json({ url: uploaded.secure_url });
      }
    );

    // Create a read stream from the file path and pipe to Cloudinary
    const stream = fs.createReadStream(req.file.path);
    stream.pipe(result);
    // result.end(req.file.path);

  } catch (err) {
    console.log('error in catch : ', err)
    res.status(500).json({ error: err.message });
  }
});


//------------------------------------------------------------------

// tracribe voice to text ...


router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    console.log('/upload/transcribe route is call.....')

    // req.body is now a Buffer
    const audioBuffer = req.body;

    console.log("Received buffer length:", audioBuffer.length);
    res.json({ text: "buffer is Transcibing... " });


  } catch (err) {
    console.error('error occur while creating transcript: ', err);
    res.status(500).json({ error: "Transcription failed :" + err });
  }
});



module.exports = router;








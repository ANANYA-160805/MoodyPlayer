const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const router = express.Router();
const SongModel = require("../models/song.model");




const upload = multer({storage: multer.memoryStorage()});

router.post('/songs',upload.single('audio'),async (req,res)=>{
    
    console.log(req.body);
    console.log(req.file);
    const fileData = await uploadFile(req.file);
     console.log(fileData);

     const Song = await SongModel.create({
  title: req.body.title,
  artist: req.body.artist,
  audio: fileData.url,
  mood: req.body.mood.toLowerCase().trim()
});
    res.status(201).json({
        message:"Song created successfully",
        song:Song
    })
})


router.get('/songs', async (req, res) => {
  try {

    const mood = req.query.mood;

    if (!mood) {
      return res.status(400).json({
        message: "Mood query is required"
      });
    }

    const songs = await SongModel.find({
      mood: mood.toLowerCase().trim()
    });

    res.status(200).json({
      message: "Songs retrieved successfully",
      songs
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});










module.exports = router;
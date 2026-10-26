const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const { uploadFile } = require('../services/storage.service');
const jwt = require('jsonwebtoken');

async function createMusic(req, res) {
    const { title } = req.body;
    
    const musicFile = req.files?.music ? req.files.music[0] : null;
    const coverFile = req.files?.cover ? req.files.cover[0] : null;

    if (!musicFile) {
        return res.status(400).json({ message: "Music file is required" });
    }

    // 1. Audio upload karein
    const musicResult = await uploadFile(musicFile.buffer.toString('base64'));

    // 2. Agar cover file aayi hai toh use bhi upload karein
    let coverUrl = "";
    if (coverFile) {
        const coverResult = await uploadFile(coverFile.buffer.toString('base64'));
        coverUrl = coverResult.url;
    }

    // 3. Database mein save karein
    const music = await musicModel.create({
        url: musicResult.url,
        title,
        cover: coverUrl, 
        artist: req.user.id,
    });

    res.status(201).json({
        message: "Music created successfully",
        music: {
            _id: music._id, // MongoDB ki standard _id
            id: music._id,   // Backup ke liye id field
            url: music.url,
            title: music.title,
            cover: music.cover, 
            artist: music.artist,
        }
    });
}

async function createAlbum(req, res) {
    const { title, musics } = req.body;

    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics: musics
    })

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics,
        }
    })
}

async function getAllMusics(req, res) {
    const musics = await musicModel
        .find()
        .limit(5)
        .populate("artist", "username email")

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics,
    })
}

async function getAllAlbums(req, res) {
    const albums = await (await albumModel.find().select("title artist").populate("artist", "username eamil"))

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums,
    })
}

async function getAlbumById(req, res) {
    const albumId = req.params.albumId;

    const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    })
}


module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };
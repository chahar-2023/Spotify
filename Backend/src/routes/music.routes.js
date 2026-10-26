const express = require('express')
const musicController = require('../controllers/music.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router()

router.get('/', authMiddleware.authUser, musicController.getAllMusics)
router.post(
  '/upload', 
  authMiddleware.authArtist, 
  upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]), 
  musicController.createMusic
);
router.get('/albums', authMiddleware.authUser, musicController.getAllAlbums)
router.get('/albums/:albumId', authMiddleware.authUser, musicController.getAlbumById)
router.post('/album', authMiddleware.authArtist, musicController.createAlbum)

module.exports = router;
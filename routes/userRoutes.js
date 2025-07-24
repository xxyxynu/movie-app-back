const express = require('express');
const { register, login, currentUser, refreshToken, logout, updateName, addOrRemoveFavorite, getFavorites } = require('../controllers/userControllers');
const validateTokenHandler = require('../middleware/validateTokenHandler');
const { upload, uploadAvatar } = require('../controllers/uploadController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', validateTokenHandler, currentUser);
router.post('/upload-avatar', validateTokenHandler, upload.single('avatar'), uploadAvatar);
router.get('/refresh-token', refreshToken);
router.post('/logout', logout);
router.patch('/update-username', validateTokenHandler, updateName);
router.patch('/toggle-favorite', validateTokenHandler, addOrRemoveFavorite);
router.get('/favorites', validateTokenHandler, getFavorites);

module.exports = router;
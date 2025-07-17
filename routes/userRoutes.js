const express = require('express');
const { register, login, currentUser } = require('../controllers/userControllers');
const validateTokenHandler = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', validateTokenHandler, currentUser);

module.exports = router;
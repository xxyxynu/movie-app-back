const express = require('express');
const { getMovielist, getMovie, getRecommendedMovies, likeMovie, dislikeMovie } = require('../controllers/movieControllers');
const validateTokenHandler = require('../middleware/validateTokenHandler');
const router = express.Router();

router.get('/', getMovielist);
router.get('/:id', getMovie);
router.get('/:id/recommended', getRecommendedMovies);
router.post('/:id/like', validateTokenHandler, likeMovie);
router.post('/:id/dislike', validateTokenHandler, dislikeMovie);

module.exports = router;
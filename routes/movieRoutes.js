const express = require('express');
const { getMovielist, getMovie, getRecommendedMovies, likeMovie, dislikeMovie, getUserRecommendations, getPopularMovies } = require('../controllers/movieControllers');
const validateTokenHandler = require('../middleware/validateTokenHandler');
const router = express.Router();

router.get('/', getMovielist);
router.get('/recommendations', validateTokenHandler, getUserRecommendations);
router.get('/popular', validateTokenHandler, getPopularMovies);
router.get('/:id', getMovie);
router.get('/:id/recommended', getRecommendedMovies);
router.post('/:id/like', validateTokenHandler, likeMovie);
router.post('/:id/dislike', validateTokenHandler, dislikeMovie);

module.exports = router;
const express = require('express');
const { getMovielist, getMovie, getRecommendedMovies, likeMovie, dislikeMovie } = require('../controllers/movieControllers');
const router = express.Router();

router.get('/', getMovielist);
router.get('/:id', getMovie);
router.get('/:id/recommended', getRecommendedMovies);
router.patch('/:id/like', likeMovie);
router.patch('/:id/dislike', dislikeMovie);

module.exports = router;
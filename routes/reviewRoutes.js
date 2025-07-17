const express = require('express')
const { createReview, getReviewOfMovie, getReviewOfUser, deleteReview, updateReview } = require('../controllers/reviewControllers')

const router = express.Router();

router.post('/', createReview);
router.get('/movie/:movieId', getReviewOfMovie);
router.get('/user/:userId', getReviewOfUser);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;

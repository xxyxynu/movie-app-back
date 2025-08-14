const express = require('express')
const { createReview, getReviewOfMovie, getReviewOfUser, deleteReview, updateReview } = require('../controllers/reviewControllers')
const validateTokenHandler = require('../middleware/validateTokenHandler')

const router = express.Router();

router.post('/', validateTokenHandler, createReview);
router.get('/movie/:movieId', getReviewOfMovie);
router.get('/user', validateTokenHandler, getReviewOfUser);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;

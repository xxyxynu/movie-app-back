const asyncHandler = require('express-async-handler');
const Movie = require('../models/movieModel')
const Review = require('../models/reviewModel')

const createReview = asyncHandler(async (req, res) => {
    const { movieId, comment } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!movieId || !comment) {
        return res.status(400).json({ message: 'Movie ID and comment are required' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    try {
        const review = await Review.create({
            movieId,
            userId,
            comment,
        });

        return res.status(201).json(review);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'You have already reviewed this movie',
            });
        }
        throw error; // 其他错误继续抛出给 asyncHandler
    }
});


const getReviewOfMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId })
        .populate('userId', 'username email')  // 展示用户信息
        .sort({ createdAt: -1 });

    res.json(reviews);
});

const getReviewOfUser = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const reviews = await Review.find({ userId })
        .populate('movieId', 'title releaseDate posterUrl')
        .sort({ createdAt: -1 });

    res.json(reviews);
});

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
});

const updateReview = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();

    res.json(updatedReview);
});

module.exports = {
    createReview,
    getReviewOfMovie,
    getReviewOfUser,
    deleteReview,
    updateReview
}
const asyncHandler = require('express-async-handler');
const Movie = require('../models/movieModel');

const getMovielist = asyncHandler(async (req, res) => {
    const movies = await Movie.find();
    res.status(200).json(movies);
});

const getMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
        return;
    }
    res.status(200).json(movie);
});

const getRecommendedMovies = asyncHandler(async (req, res) => {
    const currentMovie = await Movie.findById(req.params.id);
    if (!currentMovie) {
        res.status(404).json({ message: 'Current movie not found' });
        return;
    }

    const recommendedMovies = await Movie.find({
        _id: { $ne: currentMovie._id },
        genre: { $in: currentMovie.genre },
    }).limit(10);

    res.status(200).json(recommendedMovies);
});

const likeMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
    );

    if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
        return;
    }

    res.status(200).json({ likes: movie.likes });
});

const dislikeMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $inc: { dislikes: 1 } },
        { new: true }
    );

    if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
        return;
    }

    res.status(200).json({ dislikes: movie.dislikes });
});



module.exports = {
    getMovielist,
    getMovie,
    getRecommendedMovies,
    likeMovie,
    dislikeMovie
}
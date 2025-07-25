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
    }).sort({ likes: -1 }).limit(10);

    res.status(200).json(recommendedMovies);
});

const likeMovie = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // 从 auth middleware 拿用户 ID

    try {
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        // 如果用户已经点了赞，取消赞
        if (movie.likedBy.includes(userId)) {
            movie.likes -= 1;
            movie.likedBy.pull(userId);
        } else {
            // 点赞之前先取消点踩
            if (movie.dislikedBy.includes(userId)) {
                movie.dislikes -= 1;
                movie.dislikedBy.pull(userId);
            }

            movie.likes += 1;
            movie.likedBy.push(userId);
        }

        await movie.save();
        const updatedMovie = await Movie.findById(id);
        res.json({
            success: true,
            likes: updatedMovie.likes,
            dislikes: updatedMovie.dislikes,
            computedRating: updatedMovie.computedRating
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const dislikeMovie = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        if (movie.dislikedBy.includes(userId)) {
            movie.dislikes -= 1;
            movie.dislikedBy.pull(userId);
        } else {
            if (movie.likedBy.includes(userId)) {
                movie.likes -= 1;
                movie.likedBy.pull(userId);
            }

            movie.dislikes += 1;
            movie.dislikedBy.push(userId);
        }

        await movie.save();
        const updatedMovie = await Movie.findById(id);
        res.json({
            success: true,
            likes: updatedMovie.likes,
            dislikes: updatedMovie.dislikes,
            computedRating: updatedMovie.computedRating
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = {
    getMovielist,
    getMovie,
    getRecommendedMovies,
    likeMovie,
    dislikeMovie
}
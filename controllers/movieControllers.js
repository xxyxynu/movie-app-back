const asyncHandler = require('express-async-handler');
const Movie = require('../models/movieModel');
const User = require('../models/userModel');
const { get } = require('mongoose');

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

const likeMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // 从 auth middleware 拿用户 ID

    const movie = await Movie.findById(id);
    if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
        return;
    }

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
});

const dislikeMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const movie = await Movie.findById(id);
    if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
        return;
    }

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
});


const getUserRecommendations = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // 1. 找到用户收藏的电影
    const user = await User.findById(userId).populate('favoriteMovies');
    if (!user || !user.favoriteMovies.length) {
        return res.status(200).json([]); // 没收藏，返回空
    }

    // 2. 获取收藏电影的所有 genres
    const favoriteGenres = [
        ...new Set(user.favoriteMovies.flatMap(movie => movie.genre))
    ];

    // 3. 查找相同类型但用户没收藏的电影
    const recommendedMovies = await Movie.find({
        genre: { $in: favoriteGenres },
        _id: { $nin: user.favoriteMovies.map(m => m._id) }
    })
        .sort({ likes: -1 })
        .limit(10);

    res.status(200).json(recommendedMovies);
});

const getPopularMovies = asyncHandler(async (req, res) => {
    //const limit = parseInt(req.query.limit) || 10; // 允许前端传 limit
    const popularMovies = await Movie.find()
        .sort({ likes: -1, createdAt: -1 }) // 点赞多的优先，新电影优先
        .limit(10);

    res.status(200).json(popularMovies);
});

const searchMovies = asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ message: "Search query is required" });
    }

    const movies = await Movie.find({
        $or: [
            { title: { $regex: q, $options: "i" } },       // 模糊匹配标题
            { description: { $regex: q, $options: "i" } }  // 模糊匹配描述
        ]
    });

    res.status(200).json(movies);
});

module.exports = {
    getMovielist,
    getMovie,
    getRecommendedMovies,
    likeMovie,
    dislikeMovie,
    getUserRecommendations,
    getPopularMovies,
    searchMovies
}
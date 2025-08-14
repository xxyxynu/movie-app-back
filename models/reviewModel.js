const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie ID is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    comment: {
        type: String,
        maxlength: [1000, 'Comment must not exceed 1000 characters']
    }
}, {
    timestamps: true
});

//添加联合唯一索引，防止重复评论
//reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

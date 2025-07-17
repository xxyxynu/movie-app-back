const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie title is required'],
    },
    genre: {
        type: [String],
        required: [true, 'At least one genre is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    releaseDate: {
        type: Date,
        required: [true, 'Release date is required'],
    },
    director: {
        type: String,
        required: [true, 'Director name is required'],
    },
    cast: {
        type: [String],
        required: [true, 'At least one cast member is required'],
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
    },
    posterUrl: {
        type: String,
        required: [true, 'Poster URL is required'],
        validate: {
            validator: v => /^https?:\/\/.+\..+/.test(v),
            message: props => `${props.value} is not a valid URL!`
        }
    },
    trailerUrl: {
        type: String,
        validate: {
            validator: v => !v || /^https?:\/\/.+\..+/.test(v),
            message: props => `${props.value} is not a valid URL!`
        }
    },
    language: {
        type: String,
        default: 'English'
    },
    country: {
        type: String,
        default: 'USA'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    dislikes: {
        type: Number,
        default: 0,
        min: 0
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

movieSchema.index(
    { title: "text", description: "text" },
    {
        default_language: "english",
        language_override: "none"
    }
);

movieSchema.index({ genre: 1 });

movieSchema.virtual('computedRating').get(function () {
    const total = this.likes + this.dislikes;
    if (total === 0) return 0;
    const score = (this.likes / total) * 10;
    return parseFloat(score.toFixed(1)); // 1 位小数
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

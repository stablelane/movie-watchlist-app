const mongoose = require('mongoose')

const watchlistSchema = new mongoose.Schema({
    imdbId: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: Map,
        of: mongoose.Schema.Types.Mixed, // This allows any type of data to be stored
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

watchlistSchema.index({ userId: 1, imdbId: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema)

module.exports = Watchlist
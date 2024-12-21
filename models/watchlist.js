const mongoose = require('mongoose')

const watchlistSchema = new mongoose.Schema({
    imdbId: {
        type: String,
        required: true
    },
    data: {
        type: Map,
        of: mongoose.Schema.Types.Mixed, // This allows any type of data to be stored
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Watchlist = mongoose.model('Watchlist', watchlistSchema)

module.exports = Watchlist
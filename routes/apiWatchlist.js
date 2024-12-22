const express = require('express')
const router = express.Router()
const Watchlist = require('../models/watchlist')

router.get('/', async (req, res) => {
    try {
        console.log(req.userId)
        const watchlist = await Watchlist.find({ userId: req.userId })
        res.json(watchlist)
    } catch (error) {
        res.status(404).json({ error: error })
    }
})
router.post('/', async (req, res) => {
    try {
        const response = await fetch(`http://www.omdbapi.com/?i=${req.body.id}&apikey=1170f02c`)
        const data = await response.json()
        const newWatchlist = new Watchlist({
            imdbId: req.body.id,
            data: data,
            userId: req.userId
        }
        )
        await newWatchlist.save()
        res.status(200).json({ message: 'Watchlist entry added!' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ error: 'Duplicate imdbId detected' });
        } else {
            res.status(500).json({ error: 'Error saving watchlist entry', details: error });
        }
    }
})
router.delete('/', async (req, res) => {
    try {
        const watchlist = await Watchlist.findOneAndDelete({ imdbId: req.body.id, userId: req.userId })
        res.status(200).json({ message: 'Watchlist removed' })

    } catch (error) {
        res.status(500).json({ message: 'error deleting watchlist', error: error })
    }
})

module.exports = router
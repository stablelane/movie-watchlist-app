const express = require('express')
const router = express.Router()
const Watchlist = require('../models/watchlist')

router.get('/', (req, res) => {
    res.render('watchlist')
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
        }    }
})

module.exports = router
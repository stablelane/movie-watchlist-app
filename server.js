const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Watchlist = require('./models/watchlist')


mongoose.connect('mongodb://localhost/moviewatchlist')
    .then(() => app.listen(() => console.log(`Server running`)))
    .catch(err => console.error(err));

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/watchlist', (req, res) => {
    res.render('watchlist')
})
app.get('/api/watchlist', async (req, res) => {
    try {

        const watchlist = await Watchlist.find()
        res.json(watchlist)
    } catch (error) {
        res.status(404).json({ error: error })
    }
})
app.delete('/api/watchlist', async (req, res) => {
    try {
        const watchlist = await Watchlist.findOneAndDelete({ imdbId: req.body.id })
        res.status(200).json({ message: 'Watchlist removed'})

    } catch (error) {
        res.status(500).json({ message: 'error deleting watchlist', error: error })
    }
})
app.post('/watchlist', async (req, res) => {
    try {
        const response = await fetch(`http://www.omdbapi.com/?i=${req.body.id}&apikey=1170f02c`)
        const data = await response.json()
        const newWatchlist = new Watchlist({
            imdbId: req.body.id,
            data: data
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

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.listen(3000)
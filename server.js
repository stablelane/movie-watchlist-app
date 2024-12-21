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
app.use(express.urlencoded({ extended: false}))

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/watchlist', (req,res) => {
    res.render('watchlist')
})

app.post('/watchlist', async (req,res) => {
    try {
        const response = await fetch(`http://www.omdbapi.com/?i=${req.body.id}&apikey=1170f02c`)
        const data = await response.json()
        const newWatchlist = new Watchlist({
            imdbId: req.body.id,
            data: data
        }
        )
        newWatchlist.save()
            .then(() => console.log('Watchlist entry added!'))
            .catch(err => {
                if (err.code === 11000) {
                    console.error('Duplicate imdbId detected');
                } else {
                    console.error('Error saving watchlist entry:', err);
                }
            });
        
    } catch (error) {
        res.status(403).json({error: error})
    }
})

app.listen(3000)
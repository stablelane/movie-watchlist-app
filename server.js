const express = require('express')
const app = express()
const Watchlist = require('./models/watchlist')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/watchlist', (req,res) => {
    res.render('watchlist')
})

app.listen(3000)
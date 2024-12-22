const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = express()
const cookieParser = require('cookie-parser');
const apiWatchlistRouter = require('./routes/apiWatchlist')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()

mongoose.connect('mongodb://localhost/moviewatchlist')
    .then(() => app.listen(() => console.log(`Server running`)))
    .catch(err => console.error(err));

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());


app.get('/', authenticateToken, (req, res) => {
    res.render('index')
})
app.get('/watchlist', authenticateToken, (req, res) => {
    res.render('watchlist')
})

app.use('/api/watchlist', authenticateToken, apiWatchlistRouter)


app.use('/auth', authRoutes);





function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (token == null) {
        res.redirect('/auth/login')
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userid) => {
        if (err) return res.status(403)
        req.userId = userid
        next()
    })

}

app.listen(3000)
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = express()
const cookieParser = require('cookie-parser');
const apiWatchlistRouter = require('./routes/apiWatchlist')
const authRoutes = require('./routes/authRoutes');
const User = require('./models/user');
require('dotenv').config()

mongoose.connect('mongodb://localhost/moviewatchlist')
    .then(() => app.listen(() => console.log(`Server running`)))
    .catch(err => console.error(err));

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());


app.get('/', authenticateToken, async (req, res) => {
    const user = await User.findById(req.userId)
    res.render('index', { username: user.name || 'user' })
})
app.get('/watchlist', authenticateToken, async (req, res) => {
    const user = await User.findById(req.userId)
    res.render('watchlist', {username: user.name || 'user'})
})

app.use('/api/watchlist', authenticateToken, apiWatchlistRouter)


app.use('/auth', authRoutes);

app.get('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' })
    res.status(200).json({ message: 'Logged out successfully' })
});



function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        res.redirect('/auth/login')
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userid) => {
        if (err) return res.redirect('auth/login')
        req.userId = userid
        next()
    })

}

app.listen(3000)
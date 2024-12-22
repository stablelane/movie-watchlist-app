const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = express()
const qs = require('qs')
const cookieParser = require('cookie-parser');
const Watchlist = require('./models/watchlist')
const User = require('./models/user')
const { findOneAndUpdate } = require('./models/user')
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
app.get('/api/watchlist', authenticateToken, async (req, res) => {
    try {

        const watchlist = await Watchlist.find()
        res.json(watchlist)
    } catch (error) {
        res.status(404).json({ error: error })
    }
})
app.delete('/api/watchlist', authenticateToken, async (req, res) => {
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


app.get('/auth/google', (req, res) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
    const options = {
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),


    }
    const qs = new URLSearchParams(options)
    res.redirect(`${rootUrl}?${qs.toString()}`)
})

app.get('/api/sessions/oauth/google', async (req, res) => {
    // get the code from querystring

    const code = req.query.code 

    try {
        // get the id and access token with the code
        
        const { id_token, access_token} = await getGoogleOAuthToken(code)
        console.log({ id_token, access_token})
    
        // get user with tokens
        const googleUser = await getGoogleUser({ id_token, access_token })
        console.log(googleUser)
        // upsert the user
        
        const user = await findAndUpdateUser({
            email: googleUser.email
        },{
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture
        },{
            upsert: true,
            new: true
        })
        console.log(user,user.id)

        // create a session
        
        // create access and refresh tokens
        
        // create jwt
        const token = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)
        console.log(token)
        // set cookies
        
        res.cookie('token',token, { httpOnly: true, secure: true,sameSite: 'lax', maxAge: 299999.88 }) 
        
        // redirect back to client
        res.redirect('/')
    } catch (error) {
        res.status(500).json({ message: "Failed to authorize Google user", error: error})
        
    }
})

async function findAndUpdateUser(query, update, options){
    return User.findOneAndUpdate(query,update,options)
}

async function getGoogleUser({ id_token, access_token }) {
    try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Beared ${id_token}`
            }
        })
        const result = await response.json()
        return result
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

async function getGoogleOAuthToken(code) {
    const url = "https://oauth2.googleapis.com/token"

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type: "authorization_code",
    }

    try {
        
        const res = await fetch(`${url}?${qs.stringify(values)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        // console.log(qs.stringify(values))
        const data = await res.json()
        console.log(data)
        return data
    } catch (error) {
        console.error()
    }
}

function authenticateToken(req, res, next) {
    const token = req.cookies.token
    console.log(token)
    if (token == null) {
        res.redirect('/login')
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userid) => {
        if (err) return res.status(403)
        req.userId = userid
        next()
    })

}

app.listen(3000)
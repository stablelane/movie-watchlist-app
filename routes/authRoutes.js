const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Update the path as per your project structure
const qs = require('qs')
const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 300000 });
            return res.json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Render signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle signup
router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
        });
        await newUser.save();
        res.redirect('/auth/login');
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: "Server error. Couldn't create user." });
        }
    }
});

router.get('/google', (req, res) => {
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
    // const qs = new URLSearchParams(options)
    res.redirect(`${rootUrl}?${qs.stringify(options)}`)
})

router.get('/google/callback', async (req, res) => {
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
module.exports = router;

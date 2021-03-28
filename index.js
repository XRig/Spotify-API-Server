const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const lyricsFinder = require('lyrics-finder');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "Not Found!";
    res.json(lyrics);
})

app.post('/refresh', async (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })
    try {
        const { body } = await spotifyApi.refreshAccessToken()
        res.json({
            accessToken: body.accessToken,
            expiresIn: body.expiresIn
        })
    } catch (error) {
        res.send(error)
    }



})
app.post('/login', async (req, res) => {
    code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    })

    try {
        const data = await spotifyApi.authorizationCodeGrant(code)
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    } catch (error) {
        res.status(400).send(error)

    }
})

app.listen(3080)
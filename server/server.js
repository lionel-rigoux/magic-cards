const exec = require('child_process').exec
const express = require('express')
const path = require('path')
const ejs = require('ejs')
const SpotifyWebApi = require('spotify-web-api-node')
const cardManager = require('./lib/CardManager')
const cardProcessor = require('./lib/CardProcessor')

const config = require(__dirname + '/../config/config.json')

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientID,
  clientSecret: config.spotify.clientSecret,
})

const graphQLAPI = require('./lib/graphql')

const app = express()
const port = process.env.PORT || 5000

app.use('/graphql', graphQLAPI)
const asset_dir_path = path.join(__dirname, 'public')
app.use(express.static(asset_dir_path, {
    index: false,
    setHeaders: (response, file_path, file_stats) => {
        // This function is called when “serve-static” makes a response.
        // Note that `file_path` is an absolute path.

        // Logging work
        const relative_path = path.join(asset_dir_path, path.relative(asset_dir_path, file_path));
        console.info(`@${Date.now()}`, "GAVE\t\t", relative_path);
    },
    maxage: 0
}));


if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.disable('view cache');
  app.set('etag', false);
}

app.get('/', (req, res) => {
  res.sendFile('public/index.html' , { root : __dirname});
})

app.post('/play/:code/:room?', (req, res) => {
  var room = req.params.room;
  if (!room) {
    const config = require(__dirname + '/../config/config.json')
    room = config.room
  }
  console.log (`received play request for card ${req.params.code} in ${room}`)
  cardProcessor.process(req.params.code, room)
  //const command = `node ${__dirname}/../scanner/testCard.js ${req.params.code} ${room}`
  //exec(command, function(error, stdout, stderr) {
  //  console.log(stdout, stderr, error)
  //})

  res.send('ok')
})

app.get('/metadata/spotify', (req, res) => {
  const type = req.query.type
  const uri = req.query.uri
  const user = req.query.user

  const responder = data => {
    //console.log(data)
    res.send(data.body)
  }
  const errorHandler = error => {
    console.error(error)
    res.send({message: 'error'})
  }

  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body.access_token)

      switch (type) {
        case 'album':
          spotifyApi
            .getAlbum(uri)
            .then(responder)
            .catch(errorHandler)
          break
        case 'track':
          spotifyApi
            .getTrack(uri)
            .then(responder)
            .catch(errorHandler)
          break
        case 'playlist':
          spotifyApi
            .getPlaylist(user, uri)
            .then(responder)
            .catch(errorHandler)
          break
        default:
      }
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error)
      res.send('error')
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`))

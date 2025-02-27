require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Routes
app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("artist-search-results", {
        artistsFound: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // const currentArtist = data.body.items[0].artists[0].name;
      // console.log(currentArtist);
      res.render("albums", { albumsFound: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render("tracks", { tracksFound: data.body.items });
    })
    .catch((err) =>
      console.log("The error while loading tracks occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

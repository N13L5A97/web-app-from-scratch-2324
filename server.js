require("dotenv").config();
const querystring = require("querystring");
const express = require("express");
const { get } = require("http");
const app = express();
const port = process.env.PORT;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = `http://localhost:${port}/callback`;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async function (req, res) {
  try {
    const playlistInfo = await getPlaylist();
    // console.log(playlistInfo);
    const user = playlistInfo.owner.display_name;
    res.render("pages/index", { user });
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/login", function (req, res) {
  var scope = "user-read-private user-read-email";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
      })
  );
});

app.get("/callback", async function (req, res) {
  return res.send("You are logged in");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/playlists", async function (req, res) {
  const playlists = await getPlaylists();
  const singlePlaylist = await getOne();
  const albumCover = singlePlaylist.images[1].url;
  console.log(albumCover);
  res.render("pages/playlists", { playlists, albumCover });
});


// spotify token
var authOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    Authorization:
      "Basic " +
      new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-type": "application/x-www-form-urlencoded",
  },
  form: {
    grant_type: "client_credentials",
  },
  json: true,
};

const getPlaylists = async () => {
  const response = await fetch(authOptions.url, {
    method: "POST",
    body: querystring.stringify(authOptions.form),
    headers: authOptions.headers,
  });

  const token = await response.json();

  const playlists = await fetch(
    "https://api.spotify.com/v1/users/niels.aling/playlists",
    {
      headers: {
        Authorization: "Bearer " + token.access_token,
      },
    }
  );

  const playlistsJson = await playlists.json();
  const playlistItems = playlistsJson.items;

  return (playlistItems);
};


const getOne = async () => {
  const response = await fetch(authOptions.url, {
    method: "POST",
    body: querystring.stringify(authOptions.form),
    headers: authOptions.headers,
  });

  const token = await response.json();
  // console.log("token =");
  // console.log(token.access_token);

  const allPlaylists = await getPlaylists();
  const playlistId = allPlaylists[0].id;
  const playlistIds = allPlaylists.map((playlist) => playlist.id);

  const playlist = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: "Bearer " + token.access_token,
      },
    }
  );

  const playlistsJson = await playlist.json();

  return (playlistsJson);
};

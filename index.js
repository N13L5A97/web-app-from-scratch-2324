require("dotenv").config();
const querystring = require("querystring");
const express = require("express");
const app = express();
const port = process.env.PORT;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3001/callback";

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

app.set("view engine", "ejs");
app.use(express.static("public"));

// index page
app.get("/", function (req, res) {
  res.render("pages/index");
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

app.get("/playlist", async function (req, res) {

  const response = await fetch(authOptions.url, {
    method: "POST",
    body: querystring.stringify(authOptions.form),
    headers: authOptions.headers,
  });
  const token = await response.json();
  console.log("token =");
  console.log(token.access_token);

  const playlist = await fetch("https://api.spotify.com/v1/playlists/5EdV5zALuvQGO0VTySKq0f", {
    headers: {
      Authorization: "Bearer " + token.access_token,
    },
  });

  const playlistJson = await playlist.json();
  console.log(playlistJson);
  console.log(playlistJson.name);
  console.log(playlistJson.owner);
  console.log(playlistJson.tracks);

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = `http://localhost:${port}/callback`;

const querystring = require("querystring");

app.set("view engine", "ejs");
app.use(express.static("public"));

// home
app.get("/", async function (req, res) {
  res.render("pages/index");
});

// login
app.get("/login", function (req, res) {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// callback after login
app.get("/callback", async function (req, res) {
  try {
    return res.send("You are logged in");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// not used
app.get("/playlists", async function (req, res) {
  const playlists = await getMyPlaylists();
  res.json(playlists);
});

// FUNCTIONS

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

// using the token to get all playlists
const getMyPlaylists = async () => {
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

  return playlistItems;
};

//get id's of all the playlists (NOT USED)

// const getPlaylistsIds = async () => {
//   const response = await fetch(authOptions.url, {
//     method: "POST",
//     body: querystring.stringify(authOptions.form),
//     headers: authOptions.headers,
//   });

//   const token = await response.json();

//   const playlists = await fetch(
//     "https://api.spotify.com/v1/users/niels.aling/playlists",
//     {
//       headers: {
//         Authorization: "Bearer " + token.access_token,
//       },
//     }
//   );

//   const playlistsJson = await playlists.json();
//   const playlistItems = playlistsJson.items;
//   const playlistIds = playlistItems.map((playlist) => playlist.id);

//   return (playlistIds);
// };

//get info of all the playlists (NOT USED)
// const getPlaylistInfo = async () => {
//   const response = await fetch(authOptions.url, {
//     method: "POST",
//     body: querystring.stringify(authOptions.form),
//     headers: authOptions.headers,
//   });

//   const token = await response.json();

//   const playlistIds = await getPlaylistsIds();

//   const playlists = [];

//   for (let i = 0; i < playlistIds.length; i++) {
//     const playlist = await fetch(
//       `https://api.spotify.com/v1/playlists/${playlistIds[i]}`,
//       {
//         headers: {
//           Authorization: "Bearer " + token.access_token,
//         },
//       }
//     ).then(response => response.json());
//     playlists.push(playlist);

//     }

//     // console.log(playlists);
//     return playlists;
// };

require("dotenv").config();
const fs = require("fs");
const querystring = require("querystring");

const express = require("express");
const app = express();
const port = process.env.PORT;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = `http://localhost:${port}/callback`;

app.set("view engine", "ejs");
app.use(express.static("public"));

// home
app.get("/", async function (req, res) {
  try {
    const playlists = await getMyPlaylists();
    // const userData = await fetchUserData();

    res.render("pages/index", { playlists });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// login
app.get("/login", function (req, res) {
  try{
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
  try{
    return res.send("You are logged in");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// not used
app.get("/playlists", async function (req, res) {
  try{
    const playlists = await getPlaylistInfo();
    console.log(playlists);
    res.render("pages/playlists", { playlists });
  } catch {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// functions


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
 

  return (playlistItems);
};


//get id's of all the playlists
const getPlaylistsIds = async () => {
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
  const playlistIds = playlistItems.map((playlist) => playlist.id);

  return (playlistIds);
};

//get info of all the playlists
const getPlaylistInfo = async () => {
  const response = await fetch(authOptions.url, {
    method: "POST",
    body: querystring.stringify(authOptions.form),
    headers: authOptions.headers,
  });

  const token = await response.json();

  const playlistIds = await getPlaylistsIds();

  const playlists = [];

  for (let i = 0; i < playlistIds.length; i++) {
    const playlist = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistIds[i]}`,
      {
        headers: {
          Authorization: "Bearer " + token.access_token,
        },
      }
    ).then(response => response.json());
    playlists.push(playlist);
    
    }

    // console.log(playlists);
    return playlists;
};

//fetch data from json file
// const fetchUserData = async () => {
//   fs.readFile("data.json", "utf8", (err, data) => {
//     const userData = JSON.parse(data);
//     console.log(userData.name);
//     if (err) {
//       console.error(err);
//       return;
//     }});

//     return userData;
// }

// fetchUserData();
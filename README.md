# Process

In this document you can read all about my process.

## Design

For this design I wanted to create a sidebar to navigate to the items of the onepager. On the top of the page will be a picture/avatar of me with my name, age and profession next to it. On the page I will have 4 sections: Who am I?, My Music, My Location and Socials. All the socials have their own logo that I will use as icon in the side bar, but I also needed general icon for the socials. Therefore I made some sketches of icons that could represent the socials.

<img src="./docs/assets/sketch01.png" alt="sketch of website idea" height="300">
<img src="./docs/assets/socialMediaIcons.png" alt="sketches of social media icons" height="300">

## Breakdown

To make sure I have a clear understanding of what I need to do, I made a breakdown of the website. The navigation bar will be on the left side of the page, but to make sure it's still semantic it will be in de header of the website. The header will also contain the avatar and the name, age and profession. In the main section of the website I will have 4 sections: Who am I?, My Music, My Location and Socials.

<img src="./docs/assets/breakdown.png" alt="breakdown sketch" height="300">

For the project we need one or more micro interactions. For that I created a little sketch with an idea for the menu buttons.

<!-- image of sketch -->

## Node.js, Express and EJS

To make my website dynamic I needed to create a server with Node.js. Bas helped me out with setting this up. I've done it before with block tech but that was a while ago so it was good for me to follow his workshop. We used express as framework and EJS as template engine.

### Spotify

With this server I wanted to make use of the Spotify Web API. This was pretty hard and in the beginning I didn't understand anything of it. We started with Authorization code of Spotify which I actually do not need, but was good for me to learn a little bit about.

First we needed to generate a client id and a client_secret and configure some settings to get started.

```js
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = `http://localhost:${port}/callback`;
```

#### Login

The following part of the code makes tells us what should happen when we go to the login page and the callback page (this is the page you are redirected to after you are logged in). In the try scope we use the spotify api to let the user login with their site.

```js
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
```

When you are logged in Spotify will redirect you back to the callback page:

<img src="./docs/assets/callback.png" alt="you are logged in" height="100">

#### Fetch Playlists

I didn't need a login page, but wanted to fetch my playlists. To do this I needed a Spotify token which is requested in the top of the getMyPlaylists function. When I have a token I am allowed to make requests. In this request I fetch all the public playlists of my account which is done with this url: "https://api.spotify.com/v1/users/niels.aling/playlists". After fetching I put the data I need in the variable "playlistItems" and return this so I can give this dat to the front-end. 

```js
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
```

The problem with this was that in the data there was no album cover. This could only be done by fetching the individual playlists. This could be done by playlist ID. So I used the data from the previous function to do that.

```js
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
```

After a lot of struggling I managed to get all the playlist by their ID's. The weird thing was, when returning the data I was not able to see the images. In the console log it waS defined as Objects and if I would be more specific with the console log it said undefined. Since I was already spending a lot of time on this I decided to let it rest for a bit and came up with another solution.

#### Music Players

Since I wanted to be able to play the music I was fetching, I decided to use the ID's and the names of the playlists I could fetch. I send this data to the home page in the server and with EJS I made a forEach loop, so for every playlist it could find it would make an article element with a title and an embedded iframe from Spotify. In the title I put the playlist name and in the iframe I use the fetched id to make sure it grabs the right iframe.

```js
// home
app.get("/", async function (req, res) {
    const playlists = await getMyPlaylists();
    console.log(playlists[0].id);

    res.render("pages/index", { playlists });
});
```

```html
<section class="playlistContainer">
    <% playlists.forEach(playlist => { %>
        <article>
          <h3><%= playlist.name %></h3>
          <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/<%= playlist.id %>?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>            
        </article>
    <% }); %>
</section>
```

after some styling it ended up like this:

<img src="./docs/assets/playlists.png" alt="image of fetched playlist" height="300">

## User Data

With the team we decided to use our name, age, avatar and our Github, Discord and linkedIn socials as data for the team website. This also had to be the user data on my personal website, but just in case we would decide to add more data to the team website I made a Json file with all the data I could think of.

```json
{
    "name": "Niels Aling",
    "age": 26,
    "country": "Netherlands",
    "languages": [
        "Dutch",
        "English"
    ],
    "education": [
        {
            "school": "Hogeschool Rotterdam",
            "degree": "Bachelor of Science",
            "field": "Communication and Multimedia Design"
        }
    ],
    "work": [
        {
            "company": "aardig",
            "position": "Front-end Developer",
            "duration": "2023 - Present"
        }
    ],
    "programming languages": [
        "Python",
        "JavaScript",
        "HTML",
        "CSS",
        "C++"
    ],
    "tools": [
        "VSCode",
        "Git",
        "GitHub",
        "Node.js",
        "MongoDB",
        "React",
        "Express",
        "Next.js",
        "Figma",
        "Adobe CC",
        "Miro",
        "Webflow"
    ],
    "hobbies": [
        "Coding",
        "Gaming",
        "Watching Anime",
        "Drumming"
    ],
    "socials": [
        {
            "github": "https://github.com/N13L5A97",
            "linkedIn": "https://www.linkedin.com/in/niels-aling/",
            "discord": "http://discordapp.com/users/767661823855034368"
        }
    ],
    "images": [
        {
            "transparent": "https://raw.githubusercontent.com/N13L5A97/web-app-from-scratch-2324/main/public/assets/images/avatar_transparent.png",
            "black": "https://raw.githubusercontent.com/N13L5A97/web-app-from-scratch-2324/main/public/assets/images/avatar_black.png"
        }
    ]
}
```



## Resources

- [Read/Write json files](https://heynode.com/tutorial/readwrite-json-files-nodejs/#:~:text=json%20file%2C%20we%20will%20use,%22fs%22)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [How to use EJS](https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application)
- [How to use forEach loop EJS](https://biplabsinha345.medium.com/how-to-use-foreach-loop-in-node-js-template-engine-a460273b652)
- [Scroll Behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior)
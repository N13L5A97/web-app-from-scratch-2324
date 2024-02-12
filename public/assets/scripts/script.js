const getPlaylists = async () => {
    const playlists = await fetch("http://localhost:3001/playlists");
    const playlistsJson = await playlists.json();
    console.log(playlistsJson);
    return playlistsJson;
};


const createPlaylist = async () => {
    const playlists = await getPlaylists();

    playlists.forEach(playlist => {
        //create article for each playlist
        const playlistArticle = document.createElement('article');

        //create title for each playlist
        const playlistTitle =  document.createElement('h3');
        playlistTitle.innerHTML = playlist.name;

        //create iframe for each playlist
        const playlistIframe = document.createElement('iframe');

        //iframe info
        playlistIframe.src = `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`;
        playlistIframe.loading = "lazy";
        playlistIframe.setAttribute('frameborder', '0');


        // insert title and iframe into article
        playlistArticle.appendChild(playlistTitle);
        playlistArticle.appendChild(playlistIframe);

        //insert article into section
        const playlistSection = document.querySelector('.playlistContainer');
        playlistSection.appendChild(playlistArticle);
    });
};


const fetchUserData = async () => {
    const userData = await fetch ("./assets/data/data.json");
    const userDataJson = await userData.json();
    return userDataJson;
};

const createUserElements = async () => {
    const userData = await fetchUserData();

    console.log(userData.work[0].position);

    const userAge = document.createElement('span');
    userAge.innerHTML = "(" + userData.age + ")";

    const userName = document.createElement('h3');
    userName.innerHTML = userData.name + " " + userAge.outerHTML;

    const avatar = document.createElement('img');
    avatar.src = userData.images[0].black;
    avatar.alt = userData.name;

    const userPosition = document.createElement('p');
    userPosition.innerHTML = userData.work[0].position;

    const dataContainer = document.querySelector('.userData');

    dataContainer.appendChild(avatar);
    dataContainer.appendChild(userName);
    dataContainer.appendChild(userPosition);
};

const insertSocialLinks = async () => {
    const userData = await fetchUserData();
    console.log(userData.socials[0].linkedIn);

    //create a link for github
    const github = document.createElement('a');
    github.href = userData.socials[0].github;

    const githubIcon = document.createElement('img');
    githubIcon.src = "./assets/icons/github_logo.svg";
    githubIcon.alt = "Github";

    github.appendChild(githubIcon);

    //create a link for linkedin
    const linkedin = document.createElement('a');
    linkedin.href = userData.socials[0].linkedIn;

    const linkedinIcon = document.createElement('img');
    linkedinIcon.src = "./assets/icons/linkedin_logo.svg";
    linkedinIcon.alt = "Linkedin";

    linkedin.appendChild(linkedinIcon);

    // create a link for discord
    const discord = document.createElement('a');
    discord.href = userData.socials[0].discord;

    const discordIcon = document.createElement('img');
    discordIcon.src = "./assets/icons/discord_logo.svg";
    discordIcon.alt = "Discord";

    discord.appendChild(discordIcon);

    const socialsSection = document.querySelector('.socials');
    socialsSection.appendChild(github);
    socialsSection.appendChild(linkedin);
    socialsSection.appendChild(discord);
}

insertSocialLinks();
createUserElements();
createPlaylist();
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

    const userName = document.createElement('h2');
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


createUserElements();

createPlaylist();
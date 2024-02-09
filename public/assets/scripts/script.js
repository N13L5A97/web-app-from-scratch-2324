const getPlaylists = async () => {
    const playlists = await fetch("http://localhost:3001/playlists");
    const playlistsJson = await playlists.json();
    console.log(playlistsJson);
    return playlistsJson;
};

getPlaylists();


const createPlaylist = async () => {
    const playlists = await getPlaylists();

    playlists.forEach(playlist => {
        createPlaylistElement(element);
    });

    const createPlaylistElement = (element) => {
        
        //create article for each playlist
        const playlistArticle = document.createElement('article');

        //create title for each playlist
        const playlistTitle =  document.createElement('h3');
        playlistTitle.innerHTML = element.name;

        //create iframe for each playlist
        const playlistIframe = document.createElement('iframe');

        //iframe info
        playlistIframe.src = `https://open.spotify.com/embed/playlist/${element.id}?utm_source=generator`;
        playlistIframe.loading = "lazy";
        playlistIframe.frameborder = "0";

        // insert title and iframe into article
        playlistArticle.appendChild(playlistTitle, playlistIframe);

        //insert article into section
        const playlistSection = document.querySelector('.playlistContainer');
        playlistSection.appendChild(playlistArticle);
    }
}

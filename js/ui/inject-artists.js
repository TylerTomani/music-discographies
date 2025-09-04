export async function injectArtists(containerSelector = ".main-content-container") {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // const res = await fetch("./data.json/artists.json");
    const res = await fetch("/data.json/artists.json"); // root relative


    const artists = await res.json();

    artists.forEach(artist => {
        const artistDiv = document.createElement("div");
        artistDiv.id = artist.id;
        artistDiv.className = "artist-container";

        artistDiv.innerHTML = `
        <div class="header-artist">
            <h2 tabindex="0" class="artist-name drop-down">${artist.name}&lt;artist></h2>
            <div class="header-artist-title">
                <p>${artist.bio.intro}</p>
                <a tabindex="0" class="wiki-disc-link" target="_blank" href="${artist.wiki}">wikiepedia discography</a>
            </div>
            <div class="bio-artist">
                <p>${artist.bio.description}</p>
                <ul>
                    <li>birthday: ${artist.bio.birthday}</li>
                    <li>homeplace: ${artist.bio.homeplace}</li>
                </ul>
                <p>${artist.bio.description}</p>
            </div>
            <img src="${artist.img}" alt="${artist.name}">
        </div>
        ${artist.years.map(year => `
        <div class="year-container">
            <h4 tabindex="0" class="year-container-title drop-down">${year.year}&lt;year-container-title></h4>
            ${year.albums.map(album => `
            <div class="album-container">
                <h3 tabindex="0" class="album-title drop-down">${album.title}&lt;albumTitle></h3>
                <header class="album-header-row">
                    <h6>songs</h6>
                    <h6>dislike / like / love</h6>
                    <h6>song-comments</h6>
                </header>
                <div class="song-container">
                    ${album.songs.map(song => `
                    <div class="song">
                        <header class="song-header">
                            <h5 tabindex="0" class="song-title">${song.title}&lt;songTitle></h5>
                            <div class="song-links">
                                <a tabindex="0" class="instrumental" target="_blank" href="${song.instrumental}">instrumental</a>
                                <a tabindex="0" class="link-song" target="_blank" href="${song.link}">song link</a>
                            </div>
                        </header>
                        <div class="checkboxes">
                            <span tabindex="0" class="dislike">${song.checkbox.dislike}</span>
                            <span tabindex="0" class="neutral">${song.checkbox.neutral}</span>
                            <span tabindex="0" class="liked">${song.checkbox.liked}</span>
                        </div>
                        <div class="song-comments">
                            <textarea tabindex="0">${song.comments}</textarea>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
            `).join('')}
        </div>
        `).join('')}
        `;

        container.appendChild(artistDiv);
    });
}

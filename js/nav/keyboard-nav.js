export function keyboardNav() {
    let lastLetterPressed = null;
    let currentFocusedEl = null;
    let lastFocusedElement = null;

    function getAllFocusables() {
        return [...document.querySelectorAll(
            '.drop-down, .wiki-disc-link, .mobile-footer-header a, .song-title, .song-links a'
        )].filter(el => {
            const rect = el.getBoundingClientRect();
            return el.offsetParent !== null && rect.width > 0 && rect.height > 0;
        });
    }

    // helper: get first alphabetic char from text
    function getFirstLetter(el) {
        const text = el.innerText.trim();

        // split into words, ignore empty strings
        const words = text.split(/\s+/).filter(Boolean);

        for (const word of words) {
            // find the first alphabetic character in this word
            const match = word.match(/[a-z]/i);
            if (match) return match[0].toLowerCase();
        }

        // fallback: no letters found
        return null;
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const rawKey = e.key;                 // keep digits intact
        const key = rawKey.toLowerCase();
        const isDigit = /^[0-9]$/.test(rawKey);
        const isLetter = /^[a-z]$/.test(key);

        // keep currentFocusedEl in sync with what the user actually focused
        const allElsFocusable = getAllFocusables();
        if (allElsFocusable.includes(document.activeElement)) {
            currentFocusedEl = document.activeElement;
        }

        // ---------- NUMBER NAV (only when inside a song area) ----------
        const inSongContainer = currentFocusedEl?.closest('.song-container');
        if (isDigit && inSongContainer) {
            e.preventDefault();

            const album = currentFocusedEl.closest('.album-container');
            if (!album) return;

            // all songs in the *current* album
            const songs = [...album.querySelectorAll('.song-container .song')]
                .filter(s => s.offsetParent !== null); // visible only

            let index = parseInt(rawKey, 10);
            if (index === 0) index = 10; // optional: 0 = 10th song

            if (index >= 1 && index <= songs.length) {
                const targetSong = songs[index - 1];
                const titleEl = targetSong.querySelector('.song-title');
                if (titleEl) {
                    lastFocusedElement?.classList.remove('focused');
                    titleEl.focus();
                    titleEl.classList.add('focused');
                    lastFocusedElement = titleEl;
                    currentFocusedEl = titleEl;
                }
            }
            return; // handled
        }

        // ---------- LETTER NAV (modified logic) ----------
        if (!isLetter) return;

        // compute all same-letter elements
        let matchingElsLetter = allElsFocusable.filter(el => getFirstLetter(el) === key);
        if (matchingElsLetter.length === 0) return;

        // PRIORITY: if inside album-container, prefer album-title,
        // but ONLY if we're not already on that albumTitle (so we don't block normal cycling)
        const inAlbumContainer = currentFocusedEl?.closest('.album-container');
        if (inAlbumContainer) {
            const albumTitle = inAlbumContainer.querySelector('.album-title.drop-down');
            if (albumTitle && getFirstLetter(albumTitle) === key && currentFocusedEl !== albumTitle) {
                e.preventDefault();
                if (lastFocusedElement) lastFocusedElement.classList.remove('focused');
                albumTitle.focus();
                albumTitle.classList.add('focused');
                lastFocusedElement = albumTitle;
                currentFocusedEl = albumTitle;
                // set this so a subsequent press of the same key will go into the cycling branch
                lastLetterPressed = key;
                return; // stop here, don’t fall back to normal letter-nav this keypress
            }
        }

        // normal letter-cycling behavior
        e.preventDefault();
        const activeIndexMatch = matchingElsLetter.findIndex(el => el === currentFocusedEl);

        let newIndex;
        if (key !== lastLetterPressed) {
            if (currentFocusedEl) {
                const currentRect = currentFocusedEl.getBoundingClientRect();
                // fixed left-distance comparison (was subtracting rectA from rectA previously)
                const sorted = [...matchingElsLetter].sort((a, b) => {
                    const rectA = a.getBoundingClientRect();
                    const rectB = b.getBoundingClientRect();
                    const distA = Math.abs(rectA.top - currentRect.top);
                    const distB = Math.abs(rectB.top - currentRect.top);
                    if (distA !== distB) return distA - distB;
                    return Math.abs(rectA.left - currentRect.left) - Math.abs(rectB.left - currentRect.left);
                });
                newIndex = matchingElsLetter.indexOf(sorted[0]);
            } else {
                newIndex = 0;
            }
        } else {
            if (e.shiftKey) {
                newIndex = (activeIndexMatch - 1 + matchingElsLetter.length) % matchingElsLetter.length;
            } else {
                newIndex = (activeIndexMatch + 1) % matchingElsLetter.length;
            }
        }

        const newLink = matchingElsLetter[newIndex];
        if (newLink) {
            if (lastFocusedElement) lastFocusedElement.classList.remove('focused');
            newLink.focus();
            newLink.classList.add('focused');
            lastFocusedElement = newLink;
            currentFocusedEl = newLink;
        }

        lastLetterPressed = key;
    });

}

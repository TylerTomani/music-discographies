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
        const text = el.innerText.trim().toLowerCase();
        const match = text.match(/[a-z]/);
        return match ? match[0] : null;
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key.toLowerCase();
        if (key.length !== 1 || !/^[a-z]$/.test(key)) return;

        const allElsFocusable = getAllFocusables();
        const matchingElsLetter = allElsFocusable.filter(el => getFirstLetter(el) === key);
        if (matchingElsLetter.length === 0) return;

        const activeIndexMatch = matchingElsLetter.findIndex(el => el === currentFocusedEl);

        let newIndex;

        if (key !== lastLetterPressed) {
            // ✅ New letter → pick the visually closest element (by vertical distance)
            if (currentFocusedEl) {
                const currentRect = currentFocusedEl.getBoundingClientRect();

                // sort matches by distance from current element (Y axis priority, then X)
                const sorted = [...matchingElsLetter].sort((a, b) => {
                    const rectA = a.getBoundingClientRect();
                    const rectB = b.getBoundingClientRect();

                    const distA = Math.abs(rectA.top - currentRect.top);
                    const distB = Math.abs(rectB.top - currentRect.top);

                    if (distA !== distB) return distA - distB;
                    return Math.abs(rectA.left - currentRect.left) - Math.abs(rectB.left - currentRect.left);
                });

                newIndex = matchingElsLetter.indexOf(sorted[0]); // closest one
            } else {
                // no current focus yet → just take the first match
                newIndex = 0;
            }
        } else {
            // ✅ Same letter → cycle among matches
            if (e.shiftKey) {
                newIndex = (activeIndexMatch - 1 + matchingElsLetter.length) % matchingElsLetter.length;
            } else {
                newIndex = (activeIndexMatch + 1) % matchingElsLetter.length;
            }
        }

        const newLink = matchingElsLetter[newIndex];
        if (newLink) {
            if (lastFocusedElement) {
                lastFocusedElement.classList.remove('focused');
            }
            newLink.focus();
            newLink.classList.add('focused');

            lastFocusedElement = newLink;
            currentFocusedEl = newLink;

            console.log("newIndex:", newIndex, "focused:", newLink.innerText.trim());
        }

        lastLetterPressed = key;
    });
}

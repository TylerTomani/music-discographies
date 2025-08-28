export function keyboardNav(){
    // draft - nice
    let lastLetterPressed = null;
    let currentFocusedEl = null;
    let lastFocusedElement = null;
    
    function getAllFocusables() {
        return [...document.querySelectorAll('.drop-down,.wiki-disc-link ,.mobile-footer-header a,.song-title, .song-links a')]
            .filter(el => {
                
                const rect = el.getBoundingClientRect();
                return el.offsetParent !== null && rect.width > 0 && rect.height > 0;
            });
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const key = e.key.toLowerCase();
        if (key.length !== 1 || !/^[a-z0-9]$/.test(key)) return;
        const allElsFocusable = getAllFocusables();
        const matchingElsLetter = allElsFocusable.filter(el =>
            el.innerText.trim().toLowerCase().startsWith(key)
        );
        if (matchingElsLetter.length === 0) return;
        
        // if (lastFocusedElement) {
        //     lastFocusedElement.classList.remove('focused');
        //     lastFocusedElement = null;
        // }

        const activeIndexMatch = matchingElsLetter.findIndex(el => el === currentFocusedEl);

        let newIndex;
        if (key !== lastLetterPressed) {
            newIndex = 0; // start fresh
        } else {
            if (e.shiftKey) {
                newIndex = (activeIndexMatch - 1 + matchingElsLetter.length) % matchingElsLetter.length;
            } else {
                newIndex = (activeIndexMatch + 1) % matchingElsLetter.length;
            }
        }

        const newLink = matchingElsLetter[newIndex];
        if (newLink) {
            newLink.focus();
            currentFocusedEl = newLink;
        }

        console.log("newIndex:", newIndex, "focused:", newLink?.innerText.trim());
        lastLetterPressed = key;

    })
}
    
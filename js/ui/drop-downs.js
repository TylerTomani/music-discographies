export function initDropDowns() {
    document.addEventListener("keydown", (e) => {
        // ENTER triggers dropdown toggle if focus is on a drop-down
        if (e.key === "Enter" && document.activeElement.classList.contains("drop-down")) {
            e.preventDefault();
            toggleDropDown(document.activeElement);
        }
    });

    document.addEventListener("click", (e) => {
        const target = e.target.closest(".drop-down");
        if (target) {
            e.preventDefault();
            toggleDropDown(target);
        }
    });
}

function toggleDropDown(el) {
    const isYearTitle = el.classList.contains("year-container-title");
    const isAlbumTitle = el.classList.contains("album-title");

    if (isYearTitle) {
        // Toggle all albums inside the year
        const yearContainer = el.closest(".year-container");
        if (yearContainer) {
            yearContainer.classList.toggle("collapsed");
        }
    } else if (isAlbumTitle) {
        // Toggle only this album
        const albumContainer = el.closest(".album-container");
        if (albumContainer) {
            albumContainer.classList.toggle("collapsed");
        }
    }
}

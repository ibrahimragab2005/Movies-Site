
const moviesAndShows = [
    {
        "name": "Morbius",
        "image": "im-36.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Bhaijaan",
        "image": "im-37.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Suraj Pe Mangal Bhari",
        "image": "im-38.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Pathaan",
        "image": "im-39.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Ant-Man",
        "image": "im-40.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Adipurush",
        "image": "im-41.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Gun Shot",
        "image": "im-42.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Sin City",
        "image": "im-43.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Tomorrow War",
        "image": "im-44.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Misfire",
        "image": "im-45.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Kantara",
        "image": "im-46.png",
        "type": "Movie",
        "page": "movies&showes.html"
    },
    {
        "name": "Pushpa",
        "image": "im-47.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Blade Runner 2049",
        "image": "im-48.png",
        "type": "Movie",
        "page": "movie.html"
    },
    {
        "name": "Stranger Things",
        "image": "im-86.png",
        "type": "TV Show",
        "page": "shows.html"
    },
    {
        "name": "Money Heist",
        "image": "im-87.png",
        "type": "TV Show",
        "page": "movie.html"
    },
    {
        "name": "Lucifer",
        "image": "im-88.png",
        "type": "TV Show",
        "page": "movie.html"
    },
    {
        "name": "The Gray Man",
        "image": "im-89.png",
        "type": "TV Show",
        "page": "movie.html"
    },
    {
        "name": "High Town",
        "image": "im-90.png",
        "type": "TV Show",
        "page": "movie.html"
    },
    {
        "name": "Mirzapur",
        "image": "im-91.png",
        "type": "TV Show",
        "page": "movie.html"
    },
    {
        "name": "Breathe Into the Shadows",
        "image": "im-92.png",
        "type": "TV Show",
        "page": "movie.html"
    },
    {
        "name": "Peaky Blinders",
        "image": "im-93.png",
        "type": "TV Show",
        "page": "movie.html"
    },
    {
        "name": "Duranga",
        "image": "im-94.png",
        "type": "TV Show",
        "page": "movie.html"
    },
    {
        "name": "Mai",
        "image": "im-96.png",
        "type": "TV Show",
        "page": "movie.html"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("searchPopup");
    const input = document.getElementById("movieSearchInput");
    const results = document.getElementById("searchResults");
    const closeButton = document.getElementById("closeSearch");
    const searchIcons = document.querySelectorAll(
        ".nav-icons .bi-search, .icons .bi-search, .navbar .bi-search"
    );

    if (!popup || !input || !results) {
        console.warn("Search HTML is missing on this page.");
        return;
    }

    const isInsideCodeFolder = /\/code\//i.test(window.location.pathname);
    const imageBase = isInsideCodeFolder ? "../images2/" : "./images2/";
    const pageBase = isInsideCodeFolder ? "" : "./code/";

    function openSearch() {
        popup.classList.add("open");
        popup.setAttribute("aria-hidden", "false");
        window.setTimeout(() => input.focus(), 80);
    }

    function closeSearch(clear = false) {
        popup.classList.remove("open");
        popup.setAttribute("aria-hidden", "true");

        if (clear) {
            input.value = "";
            showHint();
        }
    }

    function showHint() {
        results.innerHTML = "";
        const hint = document.createElement("p");
        hint.className = "search-hint";
        hint.textContent = "Start typing to search...";
        results.appendChild(hint);
    }

    function showEmpty() {
        results.innerHTML = "";
        const empty = document.createElement("p");
        empty.className = "search-empty";
        empty.textContent = "No movies or shows found.";
        results.appendChild(empty);
    }

    function renderResults(query) {
        results.innerHTML = "";

        if (!query) {
            showHint();
            return;
        }

        const matches = moviesAndShows
            .filter(item => item.name.toLowerCase().includes(query))
            .slice(0, 12);

        if (matches.length === 0) {
            showEmpty();
            return;
        }

        matches.forEach(item => {
            const result = document.createElement("button");
            result.type = "button";
            result.className = "search-result";
            result.setAttribute("aria-label", `${item.name}, ${item.type}`);

            const poster = document.createElement("img");
            poster.src = imageBase + item.image;
            poster.alt = item.name;
            poster.loading = "lazy";
            poster.onerror = () => {
                poster.style.visibility = "hidden";
            };

            const info = document.createElement("span");
            info.className = "search-result-info";

            const title = document.createElement("strong");
            title.textContent = item.name;

            const type = document.createElement("small");
            type.textContent = item.type;

            info.append(title, type);
            result.append(poster, info);

            result.addEventListener("click", () => {
                closeSearch(true);
                window.location.href = pageBase + item.page;
            });

            results.appendChild(result);
        });
    }

    searchIcons.forEach(icon => {
        icon.setAttribute("role", "button");
        icon.setAttribute("tabindex", "0");
        icon.setAttribute("aria-label", "Open search");

        icon.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            popup.classList.contains("open") ? closeSearch() : openSearch();
        });

        icon.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openSearch();
            }
        });
    });

    closeButton?.addEventListener("click", () => closeSearch(true));

    
    popup.addEventListener("click", event => event.stopPropagation());

    document.addEventListener("click", event => {
        if (
            popup.classList.contains("open") &&
            !popup.contains(event.target) &&
            !event.target.closest(".bi-search")
        ) {
            closeSearch();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeSearch();
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            openSearch();
        }
    });

    input.addEventListener("input", () => {
        renderResults(input.value.trim().toLowerCase());
    });

    showHint();
});

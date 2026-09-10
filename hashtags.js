"use strict";

/* =========================================================
VIBECONNECT HASHTAGS & TRENDING
STEP 20
========================================================= */

/* =========================================================
STORAGE
========================================================= */

const FOLLOWED_KEY =
"vibeConnectFollowedHashtags";

const RECENT_KEY =
"vibeConnectRecentHashtags";

/* =========================================================
DEMO HASHTAG DATA
========================================================= */

const hashtagData = [

```
{
    id: "technology",
    tag: "Technology",
    category: "technology",
    icon: "💻",
    description:
        "The latest ideas, projects and conversations in technology.",
    posts: 128400,
    people: 48200,
    growth: "+18%"
},

{
    id: "artificialintelligence",
    tag: "ArtificialIntelligence",
    category: "ai",
    icon: "🤖",
    description:
        "AI tools, ideas, projects and the future of intelligent technology.",
    posts: 214800,
    people: 76500,
    growth: "+42%"
},

{
    id: "coding",
    tag: "Coding",
    category: "technology",
    icon: "💻",
    description:
        "Developers sharing code, projects, tips and programming ideas.",
    posts: 186300,
    people: 69400,
    growth: "+27%"
},

{
    id: "gaming",
    tag: "Gaming",
    category: "gaming",
    icon: "🎮",
    description:
        "Games, gaming setups, communities, updates and gameplay.",
    posts: 321500,
    people: 105800,
    growth: "+31%"
},

{
    id: "webdevelopment",
    tag: "WebDevelopment",
    category: "technology",
    icon: "🌐",
    description:
        "Build websites, web apps and the next generation of the web.",
    posts: 94700,
    people: 38900,
    growth: "+21%"
},

{
    id: "education",
    tag: "Education",
    category: "education",
    icon: "📚",
    description:
        "Learning resources, study tips and educational conversations.",
    posts: 164900,
    people: 58700,
    growth: "+16%"
},

{
    id: "studentlife",
    tag: "StudentLife",
    category: "education",
    icon: "🎓",
    description:
        "Student experiences, projects, goals and everyday campus life.",
    posts: 87300,
    people: 35100,
    growth: "+24%"
},

{
    id: "photography",
    tag: "Photography",
    category: "creative",
    icon: "📸",
    description:
        "Photography inspiration, techniques and creative moments.",
    posts: 203700,
    people: 81400,
    growth: "+19%"
},

{
    id: "music",
    tag: "Music",
    category: "creative",
    icon: "🎵",
    description:
        "Artists, playlists, performances and conversations about music.",
    posts: 298500,
    people: 113200,
    growth: "+13%"
},

{
    id: "creativity",
    tag: "Creativity",
    category: "creative",
    icon: "🎨",
    description:
        "Creative ideas, artwork, design and inspiration.",
    posts: 119600,
    people: 44300,
    growth: "+29%"
},

{
    id: "fitness",
    tag: "Fitness",
    category: "lifestyle",
    icon: "🏃",
    description:
        "Healthy routines, movement and lifestyle conversations.",
    posts: 142800,
    people: 55200,
    growth: "+15%"
},

{
    id: "travel",
    tag: "Travel",
    category: "lifestyle",
    icon: "✈️",
    description:
        "Travel stories, destinations and experiences from around the world.",
    posts: 177400,
    people: 68300,
    growth: "+22%"
},

{
    id: "startup",
    tag: "Startup",
    category: "technology",
    icon: "🚀",
    description:
        "Entrepreneurs sharing ideas, products and startup journeys.",
    posts: 72600,
    people: 28400,
    growth: "+37%"
},

{
    id: "opensource",
    tag: "OpenSource",
    category: "technology",
    icon: "🧩",
    description:
        "Open-source projects, communities and developer collaboration.",
    posts: 58400,
    people: 22100,
    growth: "+34%"
},

{
    id: "future",
    tag: "Future",
    category: "ai",
    icon: "🔮",
    description:
        "Ideas about innovation, emerging technology and tomorrow.",
    posts: 61700,
    people: 24900,
    growth: "+39%"
},

{
    id: "design",
    tag: "Design",
    category: "creative",
    icon: "🖌️",
    description:
        "UI, UX, graphic design and visual creativity.",
    posts: 106500,
    people: 42700,
    growth: "+26%"
}
```

];

/* =========================================================
DEMO TRENDING ORDER
========================================================= */

const trendingIds = [

```
"artificialintelligence",
"gaming",
"technology",
"coding",
"photography",
"startup"
```

];

/* =========================================================
DOM
========================================================= */

const backButton =
document.getElementById("backButton");

const hashtagSearch =
document.getElementById("hashtagSearch");

const clearSearch =
document.getElementById("clearSearch");

const categoryButtons =
document.querySelectorAll(".category-button");

const trendingGrid =
document.getElementById("trendingGrid");

const risingList =
document.getElementById("risingList");

const followedSection =
document.getElementById("followedSection");

const followedList =
document.getElementById("followedList");

const followedCount =
document.getElementById("followedCount");

const resultsSection =
document.getElementById("resultsSection");

const resultsGrid =
document.getElementById("resultsGrid");

const resultsTitle =
document.getElementById("resultsTitle");

const resultsCount =
document.getElementById("resultsCount");

const noResults =
document.getElementById("noResults");

const recentSection =
document.getElementById("recentSection");

const recentList =
document.getElementById("recentList");

const clearRecent =
document.getElementById("clearRecent");

const hashtagModal =
document.getElementById("hashtagModal");

const modalClose =
document.getElementById("modalClose");

const modalCategory =
document.getElementById("modalCategory");

const modalTitle =
document.getElementById("modalTitle");

const modalDescription =
document.getElementById("modalDescription");

const modalPosts =
document.getElementById("modalPosts");

const modalPeople =
document.getElementById("modalPeople");

const modalFollow =
document.getElementById("modalFollow");

const toast =
document.getElementById("toast");

/* =========================================================
STATE
========================================================= */

let activeCategory = "all";

let currentModalId = null;

let toastTimer = null;

/* =========================================================
STORAGE HELPERS
========================================================= */

function getFollowed() {

```
try {

    return JSON.parse(
        localStorage.getItem(
            FOLLOWED_KEY
        ) || "[]"
    );

} catch {

    return [];
}
```

}

function saveFollowed(list) {

```
localStorage.setItem(
    FOLLOWED_KEY,
    JSON.stringify(list)
);
```

}

function getRecent() {

```
try {

    return JSON.parse(
        localStorage.getItem(
            RECENT_KEY
        ) || "[]"
    );

} catch {

    return [];
}
```

}

function saveRecent(list) {

```
localStorage.setItem(
    RECENT_KEY,
    JSON.stringify(list)
);
```

}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHTML(value) {

```
return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
```

}

/* =========================================================
FORMAT NUMBERS
========================================================= */

function formatNumber(number) {

```
const value =
    Number(number) || 0;


if (value >= 1000000) {

    return (
        (value / 1000000)
            .toFixed(
                value >= 10000000
                    ? 0
                    : 1
            )
            .replace(".0", "") +
        "M"
    );
}


if (value >= 1000) {

    return (
        (value / 1000)
            .toFixed(
                value >= 10000
                    ? 0
                    : 1
            )
            .replace(".0", "") +
        "K"
    );
}


return String(value);
```

}

/* =========================================================
TOAST
========================================================= */

function showToast(
message,
type = "success"
) {

```
clearTimeout(toastTimer);

toast.textContent =
    message;

toast.className =
    `toast show ${type}`;

toastTimer =
    setTimeout(() => {

        toast.className =
            "toast";

    }, 2800);
```

}

/* =========================================================
FIND HASHTAG
========================================================= */

function findHashtag(id) {

```
return hashtagData.find(
    item => item.id === id
);
```

}

/* =========================================================
FOLLOW CHECK
========================================================= */

function isFollowing(id) {

```
return getFollowed()
    .includes(id);
```

}

/* =========================================================
TOGGLE FOLLOW
========================================================= */

function toggleFollow(id) {

```
const item =
    findHashtag(id);

if (!item) {
    return;
}


let followed =
    getFollowed();


if (followed.includes(id)) {

    followed =
        followed.filter(
            value => value !== id
        );

    showToast(
        `Unfollowed #${item.tag}`
    );

} else {

    followed.push(id);

    showToast(
        `Following #${item.tag} 🔥`
    );
}


saveFollowed(followed);

renderAll();
```

}

/* =========================================================
TREND CARD
========================================================= */

function createTrendCard(
item,
rank
) {

```
const following =
    isFollowing(item.id);


const card =
    document.createElement("article");

card.className =
    "trend-card";


card.innerHTML = `

    <div class="trend-rank">

        <span class="trend-number">
            ${rank}
        </span>

        <span class="trend-icon">
            ${escapeHTML(item.icon)}
        </span>

    </div>

    <h3>
        #${escapeHTML(item.tag)}
    </h3>

    <p class="trend-description">
        ${escapeHTML(item.description)}
    </p>

    <div class="trend-bottom">

        <div class="trend-stats">
            <strong>
                ${formatNumber(item.posts)}
            </strong>
            posts
        </div>

        <button
            type="button"
            class="follow-button ${
                following
                    ? "following"
                    : ""
            }"
            data-follow="${escapeHTML(item.id)}"
        >
            ${
                following
                    ? "✓ Following"
                    : "Follow"
            }
        </button>

    </div>

`;


card.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "[data-follow]"
            )
        ) {

            toggleFollow(item.id);

            return;
        }

        openModal(item.id);
    }
);


return card;
```

}

/* =========================================================
RENDER TRENDING
========================================================= */

function renderTrending() {

```
trendingGrid.innerHTML = "";


const items =
    trendingIds
        .map(findHashtag)
        .filter(Boolean);


items.forEach(
    (item, index) => {

        trendingGrid.appendChild(
            createTrendCard(
                item,
                index + 1
            )
        );

    }
);
```

}

/* =========================================================
RENDER RISING
========================================================= */

function renderRising() {

```
risingList.innerHTML = "";


const rising =
    [...hashtagData]
        .sort(
            (a, b) =>
                parseInt(
                    b.growth
                ) -
                parseInt(
                    a.growth
                )
        )
        .slice(0, 8);


rising.forEach(
    (item, index) => {

        const element =
            document.createElement("div");

        element.className =
            "rising-item";


        element.innerHTML = `

            <span class="rising-rank">
                ${index + 1}
            </span>

            <div class="rising-content">

                <strong>
                    #${escapeHTML(item.tag)}
                </strong>

                <span>
                    ${formatNumber(item.posts)}
                    posts · ${escapeHTML(item.category)}
                </span>

            </div>

            <span class="rising-growth">
                ${escapeHTML(item.growth)}
            </span>

        `;


        element.addEventListener(
            "click",
            () => openModal(item.id)
        );


        risingList.appendChild(
            element
        );

    }
);
```

}

/* =========================================================
RENDER FOLLOWED
========================================================= */

function renderFollowed() {

```
const followed =
    getFollowed();


followedList.innerHTML = "";


followedCount.textContent =
    followed.length;


if (!followed.length) {

    followedSection.classList.add(
        "hidden"
    );

    return;
}


followedSection.classList.remove(
    "hidden"
);


followed.forEach(
    id => {

        const item =
            findHashtag(id);

        if (!item) {
            return;
        }


        const tag =
            document.createElement("div");

        tag.className =
            "followed-tag";


        tag.innerHTML = `

            <span>
                #${escapeHTML(item.tag)}
            </span>

            <button
                type="button"
                class="followed-remove"
                data-remove="${escapeHTML(item.id)}"
                aria-label="Unfollow hashtag"
            >
                ×
            </button>

        `;


        tag.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        "[data-remove]"
                    )
                ) {

                    toggleFollow(item.id);

                    return;
                }

                openModal(item.id);
            }
        );


        followedList.appendChild(
            tag
        );

    }
);
```

}

/* =========================================================
SEARCH
========================================================= */

function searchHashtags(query) {

```
const normalized =
    query
        .trim()
        .toLowerCase()
        .replace(/^#/, "");


if (!normalized) {

    hideSearchResults();

    return;
}


const results =
    hashtagData.filter(item => {

        const searchable =
            `${item.tag} ${item.category} ${item.description}`
                .toLowerCase();

        return searchable.includes(
            normalized
        );
    });


showSearchResults(
    normalized,
    results
);
```

}

/* =========================================================
FILTER CATEGORY
========================================================= */

function filterCategory(category) {

```
activeCategory =
    category;


categoryButtons.forEach(
    button => {

        button.classList.toggle(
            "active",
            button.dataset.category ===
            category
        );

    }
);


if (category === "all") {

    renderTrending();

    hideSearchResults();

    return;
}


const results =
    hashtagData.filter(
        item =>
            item.category ===
            category
    );


showSearchResults(
    category,
    results
);
```

}

/* =========================================================
SHOW RESULTS
========================================================= */

function showSearchResults(
title,
results
) {

```
resultsSection.classList.remove(
    "hidden"
);


recentSection.classList.add(
    "hidden"
);


resultsTitle.textContent =
    title.startsWith("#")
        ? title
        : title.charAt(0)
            .toUpperCase() +
          title.slice(1);


resultsCount.textContent =
    results.length;


resultsGrid.innerHTML = "";


noResults.classList.toggle(
    "hidden",
    results.length > 0
);


results.forEach(
    item => {

        const card =
            document.createElement("article");

        card.className =
            "result-card";


        card.innerHTML = `

            <span class="result-hash">
                #
            </span>

            <h3>
                ${escapeHTML(item.tag)}
            </h3>

            <p>
                ${escapeHTML(item.description)}
            </p>

            <div class="result-meta">
                ${formatNumber(item.posts)}
                posts ·
                ${formatNumber(item.people)}
                people
            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                addRecent(item.id);

                openModal(item.id);
            }
        );


        resultsGrid.appendChild(
            card
        );

    }
);
```

}

/* =========================================================
HIDE RESULTS
========================================================= */

function hideSearchResults() {

```
resultsSection.classList.add(
    "hidden"
);

recentSection.classList.remove(
    "hidden"
);
```

}

/* =========================================================
RECENT SEARCHES
========================================================= */

function addRecent(id) {

```
let recent =
    getRecent();


recent =
    recent.filter(
        value => value !== id
    );


recent.unshift(id);


recent =
    recent.slice(0, 8);


saveRecent(recent);

renderRecent();
```

}

/* =========================================================
RENDER RECENT
========================================================= */

function renderRecent() {

```
const recent =
    getRecent();


recentList.innerHTML = "";


if (!recent.length) {

    recentList.innerHTML = `
        <div class="empty-recent">
            Your recent hashtag searches will appear here.
        </div>
    `;

    return;
}


recent.forEach(
    id => {

        const item =
            findHashtag(id);

        if (!item) {
            return;
        }


        const element =
            document.createElement("div");

        element.className =
            "recent-item";


        element.innerHTML = `

            <span>
                #${escapeHTML(item.tag)}
            </span>

            <button
                type="button"
                aria-label="Remove recent search"
            >
                ×
            </button>

        `;


        element
            .querySelector("span")
            .addEventListener(
                "click",
                () => openModal(item.id)
            );


        element
            .querySelector("button")
            .addEventListener(
                "click",
                () => {

                    removeRecent(
                        item.id
                    );

                }
            );


        recentList.appendChild(
            element
        );

    }
);
```

}

/* =========================================================
REMOVE RECENT
========================================================= */

function removeRecent(id) {

```
const recent =
    getRecent().filter(
        value => value !== id
    );


saveRecent(recent);

renderRecent();
```

}

/* =========================================================
CLEAR RECENT
========================================================= */

clearRecent.addEventListener(
"click",
() => {

```
    localStorage.removeItem(
        RECENT_KEY
    );

    renderRecent();

    showToast(
        "Recent searches cleared."
    );
}
```

);

/* =========================================================
OPEN MODAL
========================================================= */

function openModal(id) {

```
const item =
    findHashtag(id);


if (!item) {
    return;
}


currentModalId =
    id;


modalCategory.textContent =
    item.category;


modalTitle.textContent =
    `#${item.tag}`;


modalDescription.textContent =
    item.description;


modalPosts.textContent =
    formatNumber(item.posts);


modalPeople.textContent =
    formatNumber(item.people);


updateModalFollowButton();


hashtagModal.classList.remove(
    "hidden"
);


document.body.style.overflow =
    "hidden";
```

}

/* =========================================================
MODAL FOLLOW
========================================================= */

function updateModalFollowButton() {

```
if (!currentModalId) {
    return;
}


const following =
    isFollowing(
        currentModalId
    );


modalFollow.textContent =
    following
        ? "✓ Following hashtag"
        : "Follow hashtag";


modalFollow.classList.toggle(
    "following",
    following
);
```

}

modalFollow.addEventListener(
"click",
() => {

```
    if (!currentModalId) {
        return;
    }


    toggleFollow(
        currentModalId
    );


    updateModalFollowButton();
}
```

);

/* =========================================================
CLOSE MODAL
========================================================= */

function closeModal() {

```
hashtagModal.classList.add(
    "hidden"
);

document.body.style.overflow =
    "";

currentModalId =
    null;
```

}

modalClose.addEventListener(
"click",
closeModal
);

hashtagModal.addEventListener(
"click",
event => {

```
    if (
        event.target ===
        hashtagModal
    ) {

        closeModal();
    }
}
```

);

document.addEventListener(
"keydown",
event => {

```
    if (
        event.key === "Escape"
    ) {

        closeModal();
    }
}
```

);

/* =========================================================
SEARCH EVENTS
========================================================= */

hashtagSearch.addEventListener(
"input",
() => {

```
    const value =
        hashtagSearch.value;


    clearSearch.classList.toggle(
        "hidden",
        !value
    );


    searchHashtags(value);
}
```

);

clearSearch.addEventListener(
"click",
() => {

```
    hashtagSearch.value =
        "";

    clearSearch.classList.add(
        "hidden"
    );

    hideSearchResults();

    hashtagSearch.focus();
}
```

);

/* =========================================================
CATEGORY EVENTS
========================================================= */

categoryButtons.forEach(
button => {

```
    button.addEventListener(
        "click",
        () => {

            filterCategory(
                button.dataset.category
            );

        }
    );

}
```

);

/* =========================================================
BACK BUTTON
========================================================= */

backButton.addEventListener(
"click",
() => {

```
    if (
        document.referrer &&
        document.referrer.includes(
            window.location.origin
        )
    ) {

        history.back();

    } else {

        window.location.href =
            "app.html";
    }
}
```

);

/* =========================================================
RENDER ALL
========================================================= */

function renderAll() {

```
renderTrending();

renderRising();

renderFollowed();

renderRecent();

updateModalFollowButton();
```

}

/* =========================================================
INITIALIZE
========================================================= */

function initializeHashtags() {

```
renderAll();
```

}

initializeHashtags();

/* =========================================================
PUBLIC API
========================================================= */

window.vibeConnectHashtags = {

```
getAll() {

    return [...hashtagData];
},

getFollowed() {

    return getFollowed();
},

follow(id) {

    if (
        findHashtag(id) &&
        !isFollowing(id)
    ) {

        toggleFollow(id);
    }
},

unfollow(id) {

    if (
        findHashtag(id) &&
        isFollowing(id)
    ) {

        toggleFollow(id);
    }
},

refresh() {

    renderAll();
}
```

};

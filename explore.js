/* =========================================================
   VIBECONNECT
   EXPLORE & HASHTAGS
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const EXPLORE_STORAGE_KEY =
    "vibeConnectExploreFollowing";


/* =========================================================
   TOPICS
   ========================================================= */

const topics = [

    {
        id: "technology",
        icon: "💻",
        name: "Technology",
        description: "Tech, gadgets and innovation"
    },

    {
        id: "ai",
        icon: "🤖",
        name: "Artificial Intelligence",
        description: "AI tools, ideas and news"
    },

    {
        id: "gaming",
        icon: "🎮",
        name: "Gaming",
        description: "Games, esports and creators"
    },

    {
        id: "photography",
        icon: "📸",
        name: "Photography",
        description: "Photos, cameras and creativity"
    },

    {
        id: "music",
        icon: "🎵",
        name: "Music",
        description: "Artists, releases and playlists"
    },

    {
        id: "education",
        icon: "📚",
        name: "Education",
        description: "Learning and student life"
    },

    {
        id: "coding",
        icon: "👨‍💻",
        name: "Coding",
        description: "Programming and development"
    },

    {
        id: "creativity",
        icon: "🎨",
        name: "Creativity",
        description: "Design, art and ideas"
    }

];


/* =========================================================
   TRENDING HASHTAGS
   ========================================================= */

const hashtags = [

    {
        name: "#VibeConnect",
        posts: 12480,
        trend: "↑ 18%"
    },

    {
        name: "#AI",
        posts: 9870,
        trend: "↑ 25%"
    },

    {
        name: "#Coding",
        posts: 8420,
        trend: "↑ 14%"
    },

    {
        name: "#Technology",
        posts: 7650,
        trend: "↑ 11%"
    },

    {
        name: "#Gaming",
        posts: 6930,
        trend: "↑ 22%"
    },

    {
        name: "#Photography",
        posts: 5810,
        trend: "↑ 9%"
    },

    {
        name: "#StudentLife",
        posts: 5240,
        trend: "↑ 16%"
    },

    {
        name: "#WebDevelopment",
        posts: 4810,
        trend: "↑ 13%"
    },

    {
        name: "#Creative",
        posts: 4190,
        trend: "↑ 8%"
    }

];


/* =========================================================
   CREATORS
   ========================================================= */

const creators = [

    {
        id: "alex",
        name: "Alex Morgan",
        username: "@alexmorgan",
        avatar: "AM",
        followers: 18400
    },

    {
        id: "maya",
        name: "Maya Sharma",
        username: "@mayasharma",
        avatar: "MS",
        followers: 15200
    },

    {
        id: "arjun",
        name: "Arjun Singh",
        username: "@arjunsingh",
        avatar: "AS",
        followers: 12700
    },

    {
        id: "priya",
        name: "Priya Verma",
        username: "@priyaverma",
        avatar: "PV",
        followers: 11300
    },

    {
        id: "rohan",
        name: "Rohan Kapoor",
        username: "@rohank",
        avatar: "RK",
        followers: 9600
    },

    {
        id: "kabir",
        name: "Kabir Mehta",
        username: "@kabirmehta",
        avatar: "KM",
        followers: 8300
    },

    {
        id: "ananya",
        name: "Ananya Rao",
        username: "@ananyarao",
        avatar: "AR",
        followers: 7600
    },

    {
        id: "dev",
        name: "Dev Malhotra",
        username: "@devmalhotra",
        avatar: "DM",
        followers: 6900
    }

];


/* =========================================================
   HASHTAG POSTS
   ========================================================= */

const hashtagPosts = {

    "#VibeConnect": [

        {
            user: "Alex Morgan",
            username: "@alexmorgan",
            avatar: "AM",
            text:
                "Building something exciting for the VibeConnect community! 🚀",
            likes: 284,
            comments: 32
        },

        {
            user: "Maya Sharma",
            username: "@mayasharma",
            avatar: "MS",
            text:
                "The future of social platforms should be more creative and connected. ✨",
            likes: 194,
            comments: 21
        }

    ],

    "#AI": [

        {
            user: "Arjun Singh",
            username: "@arjunsingh",
            avatar: "AS",
            text:
                "Exploring new AI tools and learning something new every day. 🤖",
            likes: 342,
            comments: 44
        },

        {
            user: "Priya Verma",
            username: "@priyaverma",
            avatar: "PV",
            text:
                "AI is becoming one of the most interesting areas in technology.",
            likes: 218,
            comments: 28
        }

    ],

    "#Coding": [

        {
            user: "Rohan Kapoor",
            username: "@rohank",
            avatar: "RK",
            text:
                "Finally finished another programming project today! 💻",
            likes: 156,
            comments: 18
        },

        {
            user: "Kabir Mehta",
            username: "@kabirmehta",
            avatar: "KM",
            text:
                "Debugging is basically detective work for developers. 🔎",
            likes: 129,
            comments: 13
        }

    ],

    "#Technology": [

        {
            user: "Ananya Rao",
            username: "@ananyarao",
            avatar: "AR",
            text:
                "Technology keeps changing faster than ever. Exciting times ahead!",
            likes: 175,
            comments: 19
        }

    ],

    "#Gaming": [

        {
            user: "Dev Malhotra",
            username: "@devmalhotra",
            avatar: "DM",
            text:
                "What's the game you've spent the most hours playing?",
            likes: 241,
            comments: 67
        }

    ],

    "#Photography": [

        {
            user: "Maya Sharma",
            username: "@mayasharma",
            avatar: "MS",
            text:
                "Golden-hour photography never gets old. 📸",
            likes: 312,
            comments: 35
        }

    ]

};


/* =========================================================
   SEARCH DATA
   ========================================================= */

const searchData = [

    ...topics.map(topic => ({
        type: "Topic",
        title: topic.name,
        description: topic.description,
        searchText:
            `${topic.name} ${topic.description}`
                .toLowerCase()
    })),

    ...hashtags.map(tag => ({
        type: "Hashtag",
        title: tag.name,
        description:
            `${formatNumber(tag.posts)} posts · ${tag.trend}`,
        searchText:
            tag.name.toLowerCase()
    })),

    ...creators.map(creator => ({
        type: "Creator",
        title: creator.name,
        description:
            `${creator.username} · ${formatNumber(creator.followers)} followers`,
        searchText:
            `${creator.name} ${creator.username}`
                .toLowerCase()
    }))

];


/* =========================================================
   DOM
   ========================================================= */

const topicsGrid =
    document.getElementById(
        "topicsGrid"
    );

const hashtagsGrid =
    document.getElementById(
        "hashtagsGrid"
    );

const creatorsGrid =
    document.getElementById(
        "creatorsGrid"
    );

const exploreSearch =
    document.getElementById(
        "exploreSearch"
    );

const clearSearch =
    document.getElementById(
        "clearSearch"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );

const resultsGrid =
    document.getElementById(
        "resultsGrid"
    );

const searchResultText =
    document.getElementById(
        "searchResultText"
    );

const hashtagSection =
    document.getElementById(
        "hashtagSection"
    );

const selectedHashtag =
    document.getElementById(
        "selectedHashtag"
    );

const hashtagPostCount =
    document.getElementById(
        "hashtagPostCount"
    );

const hashtagPostsContainer =
    document.getElementById(
        "hashtagPosts"
    );

const closeHashtag =
    document.getElementById(
        "closeHashtag"
    );

const refreshTrends =
    document.getElementById(
        "refreshTrends"
    );

const toast =
    document.getElementById(
        "toast"
    );

const toastIcon =
    document.getElementById(
        "toastIcon"
    );

const toastMessage =
    document.getElementById(
        "toastMessage"
    );


/* =========================================================
   STATE
   ========================================================= */

let followingCreators = [];


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeExplore
);


function initializeExplore() {

    loadFollowing();

    renderTopics();

    renderHashtags();

    renderCreators();

    setupSearch();

    setupRefresh();

    closeHashtag.addEventListener(
        "click",
        closeHashtagSection
    );

}


/* =========================================================
   TOPICS
   ========================================================= */

function renderTopics() {

    topicsGrid.innerHTML = "";

    topics.forEach(
        topic => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "topic-card";

            card.innerHTML = `

                <div class="topic-icon">
                    ${topic.icon}
                </div>

                <h3>
                    ${escapeHTML(topic.name)}
                </h3>

                <p>
                    ${escapeHTML(
                        topic.description
                    )}
                </p>

                <div class="topic-arrow">
                    →
                </div>

            `;

            card.addEventListener(
                "click",
                () =>
                    searchForTopic(
                        topic.name
                    )
            );

            topicsGrid.appendChild(card);

        }
    );
}


/* =========================================================
   HASHTAGS
   ========================================================= */

function renderHashtags() {

    hashtagsGrid.innerHTML = "";

    hashtags.forEach(
        (tag, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "hashtag-card";

            card.innerHTML = `

                <div class="hashtag-left">

                    <div class="hashtag-number">
                        ${index + 1}
                    </div>

                    <div>

                        <div class="hashtag-name">
                            ${escapeHTML(tag.name)}
                        </div>

                        <div class="hashtag-posts-count">
                            ${formatNumber(tag.posts)}
                            posts · ${tag.trend}
                        </div>

                    </div>

                </div>

                <div class="trending-arrow">
                    →
                </div>

            `;

            card.addEventListener(
                "click",
                () =>
                    openHashtag(
                        tag.name
                    )
            );

            hashtagsGrid.appendChild(card);

        }
    );
}


/* =========================================================
   CREATORS
   ========================================================= */

function renderCreators() {

    creatorsGrid.innerHTML = "";

    creators.forEach(
        creator => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "creator-card";

            const isFollowing =
                followingCreators.includes(
                    creator.id
                );

            card.innerHTML = `

                <div class="creator-avatar">
                    ${escapeHTML(
                        creator.avatar
                    )}
                </div>

                <h3>
                    ${escapeHTML(
                        creator.name
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        creator.username
                    )}
                </p>

                <div class="creator-followers">
                    ${formatNumber(
                        creator.followers
                    )}
                    followers
                </div>

                <button
                    class="follow-button
                    ${isFollowing ? "following" : ""}"
                    data-creator-id="${creator.id}"
                >
                    ${
                        isFollowing
                            ? "✓ Following"
                            : "Follow"
                    }
                </button>

            `;

            const button =
                card.querySelector(
                    ".follow-button"
                );

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleFollow(
                        creator.id
                    );

                }
            );

            creatorsGrid.appendChild(card);

        }
    );
}


/* =========================================================
   FOLLOW CREATOR
   ========================================================= */

function loadFollowing() {

    try {

        const stored =
            localStorage.getItem(
                EXPLORE_STORAGE_KEY
            );

        if (stored) {

            followingCreators =
                JSON.parse(stored);

        }

    } catch {

        followingCreators = [];

    }
}


function saveFollowing() {

    localStorage.setItem(
        EXPLORE_STORAGE_KEY,
        JSON.stringify(
            followingCreators
        )
    );
}


function toggleFollow(id) {

    const creator =
        creators.find(
            item => item.id === id
        );

    if (!creator) {
        return;
    }


    const alreadyFollowing =
        followingCreators.includes(id);


    if (alreadyFollowing) {

        followingCreators =
            followingCreators.filter(
                item => item !== id
            );

        showToast(
            `Unfollowed ${creator.name}`,
            "−"
        );

    } else {

        followingCreators.push(id);

        showToast(
            `Following ${creator.name}`,
            "✓"
        );

    }


    saveFollowing();

    renderCreators();
}


/* =========================================================
   OPEN HASHTAG
   ========================================================= */

function openHashtag(tag) {

    const normalized =
        normalizeHashtag(tag);

    const posts =
        hashtagPosts[normalized] || [];


    selectedHashtag.textContent =
        normalized;

    hashtagPostCount.textContent =
        `${posts.length} ${
            posts.length === 1
                ? "post"
                : "posts"
        }`;


    hashtagPostsContainer.innerHTML =
        "";


    if (posts.length === 0) {

        hashtagPostsContainer.innerHTML = `

            <div class="hashtag-post">

                <p>
                    No demo posts are available
                    for this hashtag yet.
                </p>

            </div>

        `;

    } else {

        posts.forEach(
            post => {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "hashtag-post";

                card.innerHTML = `

                    <div class="hashtag-user">

                        <div class="small-avatar">
                            ${escapeHTML(
                                post.avatar
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    post.user
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    post.username
                                )}
                            </span>

                        </div>

                    </div>

                    <p>
                        ${escapeHTML(
                            post.text
                        )}
                    </p>

                    <div class="post-stats">

                        <span>
                            ❤️ ${post.likes}
                        </span>

                        <span>
                            💬 ${post.comments}
                        </span>

                    </div>

                `;

                hashtagPostsContainer
                    .appendChild(card);

            }
        );

    }


    hashtagSection.classList.remove(
        "hidden"
    );

    hashtagSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   CLOSE HASHTAG
   ========================================================= */

function closeHashtagSection() {

    hashtagSection.classList.add(
        "hidden"
    );

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    exploreSearch.addEventListener(
        "input",
        handleSearch
    );


    clearSearch.addEventListener(
        "click",
        () => {

            exploreSearch.value =
                "";

            clearSearch.classList.remove(
                "show"
            );

            searchResults.classList.add(
                "hidden"
            );

            exploreSearch.focus();

        }
    );
}


function handleSearch() {

    const query =
        exploreSearch.value
            .trim()
            .toLowerCase();


    clearSearch.classList.toggle(
        "show",
        query.length > 0
    );


    if (!query) {

        searchResults.classList.add(
            "hidden"
        );

        return;

    }


    const matches =
        searchData.filter(
            item =>
                item.searchText.includes(
                    query
                )
        );


    renderSearchResults(
        matches,
        query
    );

}


function renderSearchResults(
    matches,
    query
) {

    searchResults.classList.remove(
        "hidden"
    );

    resultsGrid.innerHTML =
        "";


    searchResultText.textContent =
        `${matches.length} result${
            matches.length === 1
                ? ""
                : "s"
        } for "${query}"`;


    if (matches.length === 0) {

        resultsGrid.innerHTML = `

            <div class="result-card">

                <div class="result-type">
                    NO RESULTS
                </div>

                <h3>
                    Nothing found
                </h3>

                <p>
                    Try another hashtag,
                    topic or creator.
                </p>

            </div>

        `;

        return;

    }


    matches
        .slice(0, 12)
        .forEach(
            result => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "result-card";

                card.innerHTML = `

                    <div class="result-type">
                        ${escapeHTML(
                            result.type
                        )}
                    </div>

                    <h3>
                        ${escapeHTML(
                            result.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            result.description
                        )}
                    </p>

                `;


                card.addEventListener(
                    "click",
                    () => {

                        if (
                            result.type ===
                            "Hashtag"
                        ) {

                            openHashtag(
                                result.title
                            );

                        } else {

                            showToast(
                                `${result.title} selected`,
                                "✓"
                            );

                        }

                    }
                );


                resultsGrid.appendChild(card);

            }
        );
}


/* =========================================================
   TOPIC SEARCH
   ========================================================= */

function searchForTopic(topicName) {

    exploreSearch.value =
        topicName;

    handleSearch();

    exploreSearch.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   REFRESH TRENDING
   ========================================================= */

function setupRefresh() {

    refreshTrends.addEventListener(
        "click",
        refreshTrending
    );

}


function refreshTrending() {

    const shuffled =
        [...hashtags].sort(
            () => Math.random() - 0.5
        );


    hashtagsGrid.innerHTML =
        "";


    shuffled.forEach(
        (tag, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "hashtag-card";

            card.innerHTML = `

                <div class="hashtag-left">

                    <div class="hashtag-number">
                        ${index + 1}
                    </div>

                    <div>

                        <div class="hashtag-name">
                            ${escapeHTML(
                                tag.name
                            )}
                        </div>

                        <div class="hashtag-posts-count">
                            ${formatNumber(
                                tag.posts
                            )}
                            posts · ${tag.trend}
                        </div>

                    </div>

                </div>

                <div class="trending-arrow">
                    →
                </div>

            `;


            card.addEventListener(
                "click",
                () =>
                    openHashtag(
                        tag.name
                    )
            );


            hashtagsGrid.appendChild(
                card
            );

        }
    );


    showToast(
        "Trending topics refreshed",
        "↻"
    );
}


/* =========================================================
   NUMBER FORMAT
   ========================================================= */

function formatNumber(number) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            notation: "compact",
            maximumFractionDigits: 1
        }
    ).format(number);

}


/* =========================================================
   HASHTAG NORMALIZATION
   ========================================================= */

function normalizeHashtag(tag) {

    const clean =
        String(tag)
            .trim()
            .replace(
                /^#+/,
                ""
            );

    return `#${clean}`;
}


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(
    message,
    icon = "✓"
) {

    toastMessage.textContent =
        message;

    toastIcon.textContent =
        icon;

    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.vibeConnectExplore = {

    openHashtag,

    refresh() {

        renderTopics();

        renderHashtags();

        renderCreators();

    },

    getFollowing() {

        return [
            ...followingCreators
        ];

    }

};

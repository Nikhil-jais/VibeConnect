/* =========================================================
   VIBECONNECT
   SAVED POSTS / BOOKMARKS
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const SAVED_STORAGE_KEY = "vibeConnectSavedPosts";

const LIKED_STORAGE_KEY = "vibeConnectLikedPosts";


/* =========================================================
   DEMO SAVED POSTS
   ========================================================= */

const demoSavedPosts = [

    {
        id: "saved-001",

        type: "text",

        user: "Alex Morgan",

        username: "@alexmorgan",

        avatar: "AM",

        text:
            "Small progress every day eventually becomes something huge. Keep building, keep learning, and don't be afraid to start again.",

        likes: 142,

        comments: 23,

        savedAt: Date.now() - 1000 * 60 * 20
    },


    {
        id: "saved-002",

        type: "photo",

        user: "Maya Sharma",

        username: "@mayasharma",

        avatar: "MS",

        text:
            "A little creative inspiration for today ✨",

        media:
            "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=80",

        likes: 284,

        comments: 41,

        savedAt: Date.now() - 1000 * 60 * 55
    },


    {
        id: "saved-003",

        type: "poll",

        user: "Arjun Singh",

        username: "@arjunsingh",

        avatar: "AS",

        text:
            "What should VibeConnect add next?",

        poll: {

            question:
                "Which feature would you use the most?",

            options: [

                {
                    text: "Groups",
                    percent: 38
                },

                {
                    text: "Live Rooms",
                    percent: 27
                },

                {
                    text: "Reels",
                    percent: 22
                },

                {
                    text: "Events",
                    percent: 13
                }

            ]
        },

        likes: 98,

        comments: 17,

        savedAt: Date.now() - 1000 * 60 * 90
    },


    {
        id: "saved-004",

        type: "video",

        user: "Priya Verma",

        username: "@priyaverma",

        avatar: "PV",

        text:
            "A quick look at my latest project setup 💻",

        video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

        likes: 321,

        comments: 52,

        savedAt: Date.now() - 1000 * 60 * 130
    },


    {
        id: "saved-005",

        type: "text",

        user: "Rohan Kapoor",

        username: "@rohank",

        avatar: "RK",

        text:
            "Your future self will thank you for the skills you start learning today. 🚀",

        likes: 76,

        comments: 9,

        savedAt: Date.now() - 1000 * 60 * 180
    }

];


/* =========================================================
   STATE
   ========================================================= */

let savedPosts = [];

let currentFilter = "all";


/* =========================================================
   DOM
   ========================================================= */

const savedGrid =
    document.getElementById("savedGrid");

const emptyState =
    document.getElementById("emptyState");

const savedCount =
    document.getElementById("savedCount");

const likedCount =
    document.getElementById("likedCount");

const mediaCount =
    document.getElementById("mediaCount");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const toastIcon =
    document.getElementById("toastIcon");

const filterButtons =
    document.querySelectorAll(".filter-button");


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeSavedPage
);


function initializeSavedPage() {

    loadSavedPosts();

    setupFilters();

    setupClearButton();

    renderSavedPosts();

    updateStats();
}


/* =========================================================
   LOAD SAVED POSTS
   ========================================================= */

function loadSavedPosts() {

    try {

        const stored =
            localStorage.getItem(
                SAVED_STORAGE_KEY
            );

        if (stored) {

            savedPosts =
                JSON.parse(stored);

        } else {

            savedPosts =
                demoSavedPosts;

            savePosts();

        }

    } catch (error) {

        console.error(
            "Could not load saved posts:",
            error
        );

        savedPosts =
            demoSavedPosts;
    }
}


/* =========================================================
   SAVE POSTS
   ========================================================= */

function savePosts() {

    localStorage.setItem(
        SAVED_STORAGE_KEY,
        JSON.stringify(savedPosts)
    );
}


/* =========================================================
   FILTERS
   ========================================================= */

function setupFilters() {

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                button.classList.add("active");

                currentFilter =
                    button.dataset.filter;

                renderSavedPosts();

            }
        );

    });
}


/* =========================================================
   FILTER POSTS
   ========================================================= */

function getFilteredPosts() {

    if (currentFilter === "all") {

        return savedPosts;

    }

    return savedPosts.filter(
        post =>
            post.type === currentFilter
    );
}


/* =========================================================
   RENDER
   ========================================================= */

function renderSavedPosts() {

    const posts =
        getFilteredPosts();

    savedGrid.innerHTML = "";

    if (posts.length === 0) {

        savedGrid.style.display =
            "none";

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }

    savedGrid.style.display =
        "grid";

    emptyState.classList.add(
        "hidden"
    );


    posts.forEach(post => {

        const card =
            createPostCard(post);

        savedGrid.appendChild(card);

    });
}


/* =========================================================
   CREATE POST CARD
   ========================================================= */

function createPostCard(post) {

    const card =
        document.createElement("article");

    card.className =
        "saved-post";

    card.dataset.id =
        post.id;


    const postHeader =
        document.createElement("div");

    postHeader.className =
        "post-header";


    const userInfo =
        document.createElement("div");

    userInfo.className =
        "user-info";


    const avatar =
        document.createElement("div");

    avatar.className =
        "avatar";

    avatar.textContent =
        post.avatar || "VC";


    const userText =
        document.createElement("div");

    userText.innerHTML = `

        <div class="username">
            ${escapeHTML(post.user)}
        </div>

        <div class="handle">
            ${escapeHTML(post.username)}
        </div>

    `;


    userInfo.appendChild(avatar);

    userInfo.appendChild(userText);


    const savedLabel =
        document.createElement("div");

    savedLabel.className =
        "saved-label";

    savedLabel.innerHTML =
        "🔖 Saved";


    postHeader.appendChild(
        userInfo
    );

    postHeader.appendChild(
        savedLabel
    );


    /* =========================
       BODY
    ========================== */

    const body =
        document.createElement("div");

    body.className =
        "post-body";


    if (post.text) {

        const text =
            document.createElement("p");

        text.className =
            "post-text";

        text.textContent =
            post.text;

        body.appendChild(text);

    }


    /* =========================
       PHOTO
    ========================== */

    if (
        post.type === "photo" &&
        post.media
    ) {

        const image =
            document.createElement("img");

        image.className =
            "post-media";

        image.src =
            post.media;

        image.alt =
            "Saved post photo";

        image.loading =
            "lazy";

        body.appendChild(image);

    }


    /* =========================
       VIDEO
    ========================== */

    if (
        post.type === "video" &&
        post.video
    ) {

        const video =
            document.createElement("video");

        video.className =
            "post-media";

        video.src =
            post.video;

        video.controls =
            true;

        video.preload =
            "metadata";

        body.appendChild(video);

    }


    /* =========================
       POLL
    ========================== */

    if (
        post.type === "poll" &&
        post.poll
    ) {

        const poll =
            document.createElement("div");

        poll.className =
            "poll-box";


        const question =
            document.createElement("div");

        question.className =
            "poll-question";

        question.textContent =
            post.poll.question;


        poll.appendChild(question);


        post.poll.options.forEach(
            option => {

                const optionElement =
                    document.createElement(
                        "div"
                    );

                optionElement.className =
                    "poll-option";


                const optionText =
                    document.createElement(
                        "span"
                    );

                optionText.textContent =
                    option.text;


                const percentage =
                    document.createElement(
                        "span"
                    );

                percentage.className =
                    "poll-percent";

                percentage.textContent =
                    `${option.percent}%`;


                optionElement.appendChild(
                    optionText
                );

                optionElement.appendChild(
                    percentage
                );


                poll.appendChild(
                    optionElement
                );

            }
        );


        body.appendChild(poll);

    }


    /* =========================
       FOOTER
    ========================== */

    const footer =
        document.createElement("div");

    footer.className =
        "post-footer";


    const engagement =
        document.createElement("div");

    engagement.className =
        "engagement";

    engagement.innerHTML = `

        <span>❤️ ${post.likes || 0}</span>

        <span>💬 ${post.comments || 0}</span>

    `;


    const actions =
        document.createElement("div");

    actions.className =
        "post-actions";


    const shareButton =
        document.createElement("button");

    shareButton.className =
        "action-button";

    shareButton.title =
        "Share";

    shareButton.textContent =
        "↗";

    shareButton.addEventListener(
        "click",
        () => sharePost(post)
    );


    const removeButton =
        document.createElement("button");

    removeButton.className =
        "action-button remove";

    removeButton.title =
        "Remove from saved";

    removeButton.textContent =
        "🔖";

    removeButton.addEventListener(
        "click",
        () =>
            removeSavedPost(post.id)
    );


    actions.appendChild(
        shareButton
    );

    actions.appendChild(
        removeButton
    );


    footer.appendChild(
        engagement
    );

    footer.appendChild(
        actions
    );


    card.appendChild(
        postHeader
    );

    card.appendChild(
        body
    );

    card.appendChild(
        footer
    );


    return card;
}


/* =========================================================
   REMOVE SAVED POST
   ========================================================= */

function removeSavedPost(id) {

    const post =
        savedPosts.find(
            item => item.id === id
        );

    savedPosts =
        savedPosts.filter(
            item => item.id !== id
        );

    savePosts();

    renderSavedPosts();

    updateStats();

    showToast(
        "Removed from saved posts",
        "✓"
    );
}


/* =========================================================
   CLEAR ALL
   ========================================================= */

function setupClearButton() {

    clearAllBtn.addEventListener(
        "click",
        clearAllSavedPosts
    );
}


function clearAllSavedPosts() {

    if (savedPosts.length === 0) {

        showToast(
            "There are no saved posts",
            "!"
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to remove all saved posts?"
        );


    if (!confirmed) {
        return;
    }


    savedPosts = [];

    savePosts();

    renderSavedPosts();

    updateStats();

    showToast(
        "All saved posts cleared",
        "✓"
    );
}


/* =========================================================
   STATS
   ========================================================= */

function updateStats() {

    savedCount.textContent =
        savedPosts.length;


    const mediaTotal =
        savedPosts.filter(
            post =>
                post.type === "photo" ||
                post.type === "video"
        ).length;

    mediaCount.textContent =
        mediaTotal;


    let likedPosts = 0;

    try {

        const liked =
            JSON.parse(
                localStorage.getItem(
                    LIKED_STORAGE_KEY
                )
            );

        if (Array.isArray(liked)) {

            likedPosts =
                liked.length;

        }

    } catch {

        likedPosts = 0;

    }


    likedCount.textContent =
        likedPosts;
}


/* =========================================================
   SHARE
   ========================================================= */

async function sharePost(post) {

    const shareText =
        `${post.user}: ${post.text || "Saved post"}`;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({
                title:
                    "VibeConnect Saved Post",

                text:
                    shareText
            });

        } catch {
            // User cancelled sharing
        }

        return;
    }


    try {

        await navigator.clipboard.writeText(
            shareText
        );

        showToast(
            "Post details copied",
            "✓"
        );

    } catch {

        showToast(
            "Sharing is not available",
            "!"
        );

    }
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


    clearTimeout(toastTimer);


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
   ESCAPE HTML
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
   PUBLIC API
   ========================================================= */

window.vibeConnectSaved = {

    getPosts() {
        return savedPosts;
    },

    addPost(post) {

        if (!post.id) {

            post.id =
                `saved-${Date.now()}`;

        }

        savedPosts.unshift(
            post
        );

        savePosts();

        renderSavedPosts();

        updateStats();

    },

    removePost(id) {

        removeSavedPost(id);

    },

    refresh() {

        loadSavedPosts();

        renderSavedPosts();

        updateStats();

    }

};

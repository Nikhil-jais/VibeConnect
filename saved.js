"use strict";

/* =========================================================
VIBECONNECT — SAVED POSTS
Complete Saved Posts System
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   STORAGE
===================================================== */

const SAVED_KEY = "vibeConnectSavedPosts";
const LIKED_KEY = "vibeConnectLikedPosts";


/* =====================================================
   DOM
===================================================== */

const savedGrid = document.getElementById("savedGrid");
const emptyState = document.getElementById("emptyState");

const savedCount = document.getElementById("savedCount");
const likedCount = document.getElementById("likedCount");
const mediaCount = document.getElementById("mediaCount");

const clearAllBtn = document.getElementById("clearAllBtn");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");

const filterButtons =
    document.querySelectorAll(".filter-button");


/* =====================================================
   STATE
===================================================== */

let savedPosts = [];
let currentFilter = "all";
let toastTimer = null;


/* =====================================================
   DEMO POSTS
   ===================================================== */

const demoPosts = [

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

        user: "Trisha",
        username: "@trishajaiswal",
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

        user: "Nikhil Jaiswal",
        username: "@nikhiljaiswal09",
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


/* =====================================================
   LOAD
===================================================== */

function loadSavedPosts() {

    try {

        const stored =
            localStorage.getItem(SAVED_KEY);

        if (!stored) {

            savedPosts =
                demoPosts.map(post => ({
                    ...post
                }));

            saveSavedPosts();

            return;
        }

        const parsed =
            JSON.parse(stored);

        if (Array.isArray(parsed)) {
            savedPosts = parsed;
        } else {
            savedPosts = [];
        }

    } catch (error) {

        console.error(
            "VibeConnect: Could not load saved posts.",
            error
        );

        savedPosts = [];
    }
}


/* =====================================================
   SAVE
===================================================== */

function saveSavedPosts() {

    try {

        localStorage.setItem(
            SAVED_KEY,
            JSON.stringify(savedPosts)
        );

    } catch (error) {

        console.error(
            "VibeConnect: Could not save posts.",
            error
        );
    }
}


/* =====================================================
   FILTERS
===================================================== */

function setupFilters() {

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            currentFilter =
                button.dataset.filter || "all";

            filterButtons.forEach(item => {

                const active =
                    item === button;

                item.classList.toggle(
                    "active",
                    active
                );

                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            });

            render();
        });
    });
}


/* =====================================================
   GET FILTERED POSTS
===================================================== */

function getFilteredPosts() {

    if (currentFilter === "all") {
        return savedPosts;
    }

    return savedPosts.filter(
        post =>
            post &&
            post.type === currentFilter
    );
}


/* =====================================================
   RENDER
===================================================== */

function render() {

    if (!savedGrid || !emptyState) {
        return;
    }

    const posts =
        getFilteredPosts();

    savedGrid.innerHTML = "";

    if (!posts.length) {

        savedGrid.style.display = "none";

        emptyState.classList.remove("hidden");

        return;
    }

    savedGrid.style.display = "";

    emptyState.classList.add("hidden");

    posts.forEach(post => {

        const card =
            createPostCard(post);

        savedGrid.appendChild(card);
    });
}


/* =====================================================
   CREATE POST CARD
===================================================== */

function createPostCard(post) {

    const card =
        document.createElement("article");

    card.className = "saved-post";

    card.dataset.id =
        post.id || "";


    /* =================================================
       HEADER
    ================================================= */

    const header =
        document.createElement("div");

    header.className =
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
        getInitials(
            post.avatar ||
            post.user ||
            "VC"
        );


    const userDetails =
        document.createElement("div");

    userDetails.className =
        "user-details";


    const username =
        document.createElement("div");

    username.className =
        "username";

    username.textContent =
        post.user ||
        "VibeConnect User";


    const handle =
        document.createElement("div");

    handle.className =
        "handle";

    handle.textContent =
        post.username ||
        "@user";


    userDetails.appendChild(username);
    userDetails.appendChild(handle);

    userInfo.appendChild(avatar);
    userInfo.appendChild(userDetails);


    const savedLabel =
        document.createElement("div");

    savedLabel.className =
        "saved-label";

    savedLabel.textContent =
        "🔖 Saved";


    header.appendChild(userInfo);
    header.appendChild(savedLabel);


    /* =================================================
       BODY
    ================================================= */

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


    /* =================================================
       PHOTO
    ================================================= */

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
            "Saved post";

        image.loading =
            "lazy";

        image.onerror = () => {

            image.style.display =
                "none";
        };

        body.appendChild(image);
    }


    /* =================================================
       VIDEO
    ================================================= */

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

        video.controls = true;

        video.preload =
            "metadata";

        video.setAttribute(
            "playsinline",
            ""
        );

        body.appendChild(video);
    }


    /* =================================================
       POLL
    ================================================= */

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
            post.poll.question ||
            "Poll";


        poll.appendChild(question);


        const options =
            Array.isArray(post.poll.options)
                ? post.poll.options
                : [];


        options.forEach(option => {

            const optionElement =
                document.createElement("div");

            optionElement.className =
                "poll-option";


            const optionText =
                document.createElement("span");

            optionText.className =
                "poll-option-text";

            optionText.textContent =
                option.text || "";


            const percent =
                document.createElement("span");

            percent.className =
                "poll-percent";

            percent.textContent =
                ${Number(option.percent) || 0}%`;


            const bar =
                document.createElement("div");

            bar.className =
                "poll-bar";


            const fill =
                document.createElement("div");

            fill.className =
                "poll-bar-fill";

            fill.style.width =
                ${Math.max(
                    0,
                    Math.min(
                        100,
                        Number(option.percent) || 0
                    )
                )}%;


            bar.appendChild(fill);

            optionElement.appendChild(
                optionText
            );

            optionElement.appendChild(
                percent
            );

            optionElement.appendChild(
                bar
            );

            poll.appendChild(
                optionElement
            );
        });


        body.appendChild(poll);
    }


    /* =================================================
       FOOTER
    ================================================= */

    const footer =
        document.createElement("div");

    footer.className =
        "post-footer";


    const engagement =
        document.createElement("div");

    engagement.className =
        "engagement";


    const likes =
        document.createElement("span");

    likes.textContent =
        ❤️ ${Number(post.likes) || 0}`;


    const comments =
        document.createElement("span");

    comments.textContent =
        💬 ${Number(post.comments) || 0}`;


    engagement.appendChild(likes);
    engagement.appendChild(comments);


    const actions =
        document.createElement("div");

    actions.className =
        "post-actions";


    /* SHARE */

    const shareButton =
        document.createElement("button");

    shareButton.type =
        "button";

    shareButton.className =
        "action-button";

    shareButton.title =
        "Share";

    shareButton.setAttribute(
        "aria-label",
        "Share post"
    );

    shareButton.textContent =
        "↗";


    shareButton.addEventListener(
        "click",
        () => sharePost(post)
    );


    /* REMOVE */

    const removeButton =
        document.createElement("button");

    removeButton.type =
        "button";

    removeButton.className =
        "action-button remove";

    removeButton.title =
        "Remove from saved";

    removeButton.setAttribute(
        "aria-label",
        "Remove from saved"
    );

    removeButton.textContent =
        "🔖";


    removeButton.addEventListener(
        "click",
        () => removePost(post.id)
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


    /* =================================================
       BUILD CARD
    ================================================= */

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);


    return card;
}


/* =====================================================
   REMOVE POST
===================================================== */

function removePost(id) {

    const before =
        savedPosts.length;

    savedPosts =
        savedPosts.filter(
            post =>
                post.id !== id
        );


    if (
        savedPosts.length === before
    ) {
        return;
    }


    saveSavedPosts();

    render();

    updateStats();

    showToast(
        "Removed from saved posts",
        "✓"
    );
}


/* =====================================================
   CLEAR ALL
===================================================== */

function setupClearButton() {

    if (!clearAllBtn) {
        return;
    }

    clearAllBtn.addEventListener(
        "click",
        clearAll
    );
}


function clearAll() {

    if (!savedPosts.length) {

        showToast(
            "There are no saved posts",
            "!"
        );

        return;
    }


    const confirmed =
        window.confirm(
            "Are you sure you want to remove all saved posts?"
        );


    if (!confirmed) {
        return;
    }


    savedPosts = [];

    saveSavedPosts();

    render();

    updateStats();

    showToast(
        "All saved posts cleared",
        "✓"
    );
}


/* =====================================================
   STATS
===================================================== */

function updateStats() {

    if (savedCount) {

        savedCount.textContent =
            savedPosts.length;
    }


    const mediaTotal =
        savedPosts.filter(
            post =>
                post.type === "photo" ||
                post.type === "video"
        ).length;


    if (mediaCount) {

        mediaCount.textContent =
            mediaTotal;
    }


    let likedTotal = 0;


    try {

        const stored =
            localStorage.getItem(
                LIKED_KEY
            );


        if (stored) {

            const liked =
                JSON.parse(stored);


            if (Array.isArray(liked)) {

                likedTotal =
                    liked.length;
            }

        }

    } catch (error) {

        console.warn(
            "Could not read liked posts.",
            error
        );
    }


    if (likedCount) {

        likedCount.textContent =
            likedTotal;
    }
}


/* =====================================================
   SHARE
===================================================== */

async function sharePost(post) {

    const text =
        ${post.user || "VibeConnect User"}: ${post.text || "Saved post"}`;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "VibeConnect Saved Post",

                text
            });

            return;

        } catch (error) {

            if (
                error &&
                error.name === "AbortError"
            ) {
                return;
            }
        }
    }


    try {

        await navigator.clipboard.writeText(
            text
        );

        showToast(
            "Post details copied",
            "✓"
        );

    } catch (error) {

        showToast(
            "Sharing is not available",
            "!"
        );
    }
}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message,
    icon = "✓"
) {

    if (
        !toast ||
        !toastMessage ||
        !toastIcon
    ) {
        return;
    }


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
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2600);
}


/* =====================================================
   INITIALS
===================================================== */

function getInitials(value) {

    const text =
        String(value || "VC")
            .trim();


    if (!text) {
        return "VC";
    }


    const parts =
        text.split(/\s+/);


    if (parts.length >= 2) {

        return (
            parts[0][0] +
            parts[1][0]
        ).toUpperCase();
    }


    return text
        .slice(0, 2)
        .toUpperCase();
}


/* =====================================================
   PUBLIC API
   Allows feed/app JavaScript to add/remove saved posts.
===================================================== */

window.vibeConnectSaved = {

    getPosts() {
        return [...savedPosts];
    },


    addPost(post) {

        if (!post || typeof post !== "object") {
            return;
        }


        const newPost = {
            ...post,

            id:
                post.id ||
                `saved-${Date.now()}`
        };


        const exists =
            savedPosts.some(
                item =>
                    item.id === newPost.id
            );


        if (exists) {
            return;
        }


        savedPosts.unshift(
            newPost
        );


        saveSavedPosts();

        render();

        updateStats();

        showToast(
            "Post saved",
            "🔖"
        );
    },


    removePost(id) {

        removePost(id);
    },


    refresh() {

        loadSavedPosts();

        render();

        updateStats();
    }
};


/* =====================================================
   START
===================================================== */

loadSavedPosts();

setupFilters();

setupClearButton();

render();

updateStats();

});

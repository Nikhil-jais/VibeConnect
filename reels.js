/* =========================================================
   VIBECONNECT
   REELS / SHORT VIDEOS
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const REELS_LIKES_KEY =
    "vibeConnectReelLikes";

const REELS_SAVED_KEY =
    "vibeConnectReelSaved";

const REELS_FOLLOWING_KEY =
    "vibeConnectReelFollowing";

const REELS_COMMENTS_KEY =
    "vibeConnectReelComments";


/* =========================================================
   DEMO REELS
   ========================================================= */

const demoReels = [

    {
        id: "reel-001",

        creator: "Alex Morgan",

        username: "@alexmorgan",

        avatar: "AM",

        caption:
            "A quick look at what I'm building today 🚀",

        hashtags: [
            "#Coding",
            "#Technology",
            "#BuildInPublic"
        ],

        video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

        likes: 1842,

        comments: 124,

        shares: 58,

        category: "for-you"
    },


    {
        id: "reel-002",

        creator: "Maya Sharma",

        username: "@mayasharma",

        avatar: "MS",

        caption:
            "Finding inspiration in the little things ✨",

        hashtags: [
            "#Photography",
            "#Creative",
            "#Vibes"
        ],

        video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

        likes: 3280,

        comments: 218,

        shares: 94,

        category: "trending"
    },


    {
        id: "reel-003",

        creator: "Arjun Singh",

        username: "@arjunsingh",

        avatar: "AS",

        caption:
            "Learning something new every single day 🤖",

        hashtags: [
            "#AI",
            "#Learning",
            "#Technology"
        ],

        video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

        likes: 2150,

        comments: 167,

        shares: 73,

        category: "for-you"
    },


    {
        id: "reel-004",

        creator: "Priya Verma",

        username: "@priyaverma",

        avatar: "PV",

        caption:
            "Coding mode: ON 💻",

        hashtags: [
            "#Programming",
            "#Developer",
            "#Coding"
        ],

        video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

        likes: 1450,

        comments: 96,

        shares: 41,

        category: "following"
    },


    {
        id: "reel-005",

        creator: "Rohan Kapoor",

        username: "@rohank",

        avatar: "RK",

        caption:
            "Weekend gaming session 🎮",

        hashtags: [
            "#Gaming",
            "#Gamers",
            "#Weekend"
        ],

        video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

        likes: 4170,

        comments: 304,

        shares: 121,

        category: "trending"
    }

];


/* =========================================================
   STATE
   ========================================================= */

let currentFeed =
    "for-you";

let currentCommentReel =
    null;

let likedReels = [];

let savedReels = [];

let followingCreators = [];

let reelComments = {};


/* =========================================================
   DOM
   ========================================================= */

const reelsFeed =
    document.getElementById(
        "reelsFeed"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const reelTabs =
    document.querySelectorAll(
        ".reel-tab"
    );

const commentsModal =
    document.getElementById(
        "commentsModal"
    );

const commentsOverlay =
    document.getElementById(
        "commentsOverlay"
    );

const closeComments =
    document.getElementById(
        "closeComments"
    );

const commentsList =
    document.getElementById(
        "commentsList"
    );

const commentCount =
    document.getElementById(
        "commentCount"
    );

const commentForm =
    document.getElementById(
        "commentForm"
    );

const commentInput =
    document.getElementById(
        "commentInput"
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
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeReels
);


function initializeReels() {

    loadState();

    setupTabs();

    setupComments();

    renderReels();

}


/* =========================================================
   LOAD STATE
   ========================================================= */

function loadState() {

    likedReels =
        loadArray(
            REELS_LIKES_KEY
        );

    savedReels =
        loadArray(
            REELS_SAVED_KEY
        );

    followingCreators =
        loadArray(
            REELS_FOLLOWING_KEY
        );


    try {

        const stored =
            localStorage.getItem(
                REELS_COMMENTS_KEY
            );

        reelComments =
            stored
                ? JSON.parse(stored)
                : {};

    } catch {

        reelComments = {};

    }

}


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function loadArray(key) {

    try {

        const stored =
            localStorage.getItem(key);

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch {

        return [];

    }

}


function saveArray(
    key,
    value
) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}


/* =========================================================
   TABS
   ========================================================= */

function setupTabs() {

    reelTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                reelTabs.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                tab.classList.add(
                    "active"
                );

                currentFeed =
                    tab.dataset.feed;

                renderReels();

            }
        );

    });

}


/* =========================================================
   GET FEED
   ========================================================= */

function getCurrentReels() {

    if (
        currentFeed ===
        "for-you"
    ) {

        return demoReels;

    }


    if (
        currentFeed ===
        "trending"
    ) {

        return [...demoReels]
            .sort(
                (a, b) =>
                    b.likes - a.likes
            );

    }


    if (
        currentFeed ===
        "following"
    ) {

        return demoReels.filter(
            reel =>
                followingCreators.includes(
                    reel.creator
                )
        );

    }


    return demoReels;
}


/* =========================================================
   RENDER REELS
   ========================================================= */

function renderReels() {

    reelsFeed.innerHTML = "";

    const reels =
        getCurrentReels();


    if (reels.length === 0) {

        reelsFeed.style.display =
            "none";

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    reelsFeed.style.display =
        "flex";

    emptyState.classList.add(
        "hidden"
    );


    reels.forEach(
        reel => {

            const element =
                createReelElement(
                    reel
                );

            reelsFeed.appendChild(
                element
            );

        }
    );


    setupVideoObserver();

}


/* =========================================================
   CREATE REEL
   ========================================================= */

function createReelElement(
    reel
) {

    const article =
        document.createElement(
            "article"
        );

    article.className =
        "reel";

    article.dataset.id =
        reel.id;


    const liked =
        likedReels.includes(
            reel.id
        );

    const saved =
        savedReels.includes(
            reel.id
        );

    const following =
        followingCreators.includes(
            reel.creator
        );


    article.innerHTML = `

        <video
            class="reel-video"
            src="${escapeAttribute(
                reel.video
            )}"
            loop
            muted
            playsinline
            preload="metadata"
        ></video>


        <div class="reel-video-overlay"></div>


        <div class="play-indicator">
            ▶
        </div>


        <div class="reel-top">

            <span class="reel-badge">
                🎬 SHORT VIDEO
            </span>

            <button
                class="mute-button"
                type="button"
                aria-label="Toggle sound"
            >
                🔇
            </button>

        </div>


        <div class="reel-content">

            <div class="reel-user">

                <div class="reel-avatar">
                    ${escapeHTML(
                        reel.avatar
                    )}
                </div>

                <div class="reel-user-info">

                    <strong>
                        ${escapeHTML(
                            reel.creator
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            reel.username
                        )}
                    </span>

                </div>

                <button
                    class="follow-small ${
                        following
                            ? "following"
                            : ""
                    }"
                    type="button"
                >
                    ${
                        following
                            ? "✓ Following"
                            : "Follow"
                    }
                </button>

            </div>


            <p class="reel-caption">
                ${escapeHTML(
                    reel.caption
                )}
            </p>


            <div class="reel-hashtags">

                ${reel.hashtags
                    .map(
                        tag =>
                            `<span class="reel-hashtag">
                                ${escapeHTML(tag)}
                            </span>`
                    )
                    .join("")}

            </div>

        </div>


        <div class="reel-actions">

            <button
                class="reel-action ${
                    liked
                        ? "liked"
                        : ""
                }"
                data-action="like"
                type="button"
            >
                ${
                    liked
                        ? "♥"
                        : "♡"
                }

                <span>
                    ${formatNumber(
                        reel.likes +
                        (
                            liked
                                ? 1
                                : 0
                        )
                    )}
                </span>
            </button>


            <button
                class="reel-action"
                data-action="comment"
                type="button"
            >
                💬

                <span>
                    ${formatNumber(
                        reel.comments +
                        getCommentCount(
                            reel.id
                        )
                    )}
                </span>
            </button>


            <button
                class="reel-action ${
                    saved
                        ? "saved"
                        : ""
                }"
                data-action="save"
                type="button"
            >
                ${
                    saved
                        ? "🔖"
                        : "🔖"
                }

                <span>
                    ${saved
                        ? "Saved"
                        : "Save"}
                </span>
            </button>


            <button
                class="reel-action"
                data-action="share"
                type="button"
            >
                ↗

                <span>
                    ${formatNumber(
                        reel.shares
                    )}
                </span>
            </button>

        </div>

    `;


    const video =
        article.querySelector(
            ".reel-video"
        );


    const muteButton =
        article.querySelector(
            ".mute-button"
        );


    const followButton =
        article.querySelector(
            ".follow-small"
        );


    video.addEventListener(
        "click",
        () =>
            toggleVideo(
                article
            )
    );


    muteButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            video.muted =
                !video.muted;

            muteButton.textContent =
                video.muted
                    ? "🔇"
                    : "🔊";

        }
    );


    followButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleFollow(
                reel.creator
            );

        }
    );


    article
        .querySelectorAll(
            ".reel-action"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        handleAction(
                            button.dataset.action,
                            reel
                        );

                    }
                );

            }
        );


    return article;
}


/* =========================================================
   VIDEO OBSERVER
   ========================================================= */

function setupVideoObserver() {

    const videos =
        document.querySelectorAll(
            ".reel-video"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        const reel =
                            entry.target
                                .closest(
                                    ".reel"
                                );

                        if (
                            entry.isIntersecting &&
                            entry.intersectionRatio >
                                0.65
                        ) {

                            playVideo(
                                entry.target,
                                reel
                            );

                        } else {

                            entry.target.pause();

                        }

                    }
                );

            },
            {
                threshold: [
                    0.2,
                    0.65,
                    0.9
                ]
            }
        );


    videos.forEach(
        video =>
            observer.observe(video)
    );

}


/* =========================================================
   PLAY / PAUSE
   ========================================================= */

function playVideo(
    video,
    reel
) {

    document
        .querySelectorAll(
            ".reel-video"
        )
        .forEach(
            other => {

                if (
                    other !== video
                ) {

                    other.pause();

                }

            }
        );


    video.play()
        .then(() => {

            reel.classList.remove(
                "paused"
            );

        })
        .catch(() => {

            reel.classList.add(
                "paused"
            );

        });

}


function toggleVideo(
    reel
) {

    const video =
        reel.querySelector(
            ".reel-video"
        );


    if (video.paused) {

        video.play();

        reel.classList.remove(
            "paused"
        );

    } else {

        video.pause();

        reel.classList.add(
            "paused"
        );

    }

}


/* =========================================================
   ACTIONS
   ========================================================= */

function handleAction(
    action,
    reel
) {

    if (
        action === "like"
    ) {

        toggleLike(
            reel
        );

        return;

    }


    if (
        action === "comment"
    ) {

        openComments(
            reel
        );

        return;

    }


    if (
        action === "save"
    ) {

        toggleSave(
            reel
        );

        return;

    }


    if (
        action === "share"
    ) {

        shareReel(
            reel
        );

    }

}


/* =========================================================
   LIKE
   ========================================================= */

function toggleLike(
    reel
) {

    const index =
        likedReels.indexOf(
            reel.id
        );


    if (index !== -1) {

        likedReels.splice(
            index,
            1
        );

        showToast(
            "Like removed",
            "♡"
        );

    } else {

        likedReels.push(
            reel.id
        );

        showToast(
            "Liked reel",
            "♥"
        );

    }


    saveArray(
        REELS_LIKES_KEY,
        likedReels
    );

    renderReels();

}


/* =========================================================
   SAVE
   ========================================================= */

function toggleSave(
    reel
) {

    const index =
        savedReels.indexOf(
            reel.id
        );


    if (index !== -1) {

        savedReels.splice(
            index,
            1
        );

        showToast(
            "Removed from saved",
            "🔖"
        );

    } else {

        savedReels.push(
            reel.id
        );

        showToast(
            "Reel saved",
            "🔖"
        );

    }


    saveArray(
        REELS_SAVED_KEY,
        savedReels
    );

    renderReels();

}


/* =========================================================
   FOLLOW
   ========================================================= */

function toggleFollow(
    creator
) {

    const index =
        followingCreators.indexOf(
            creator
        );


    if (index !== -1) {

        followingCreators.splice(
            index,
            1
        );

        showToast(
            `Unfollowed ${creator}`,
            "−"
        );

    } else {

        followingCreators.push(
            creator
        );

        showToast(
            `Following ${creator}`,
            "✓"
        );

    }


    saveArray(
        REELS_FOLLOWING_KEY,
        followingCreators
    );

    renderReels();

}


/* =========================================================
   SHARE
   ========================================================= */

async function shareReel(
    reel
) {

    const text =
        `${reel.creator} on VibeConnect: ${reel.caption}`;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "VibeConnect Reel",

                text:

                    text,

                url:
                    window.location.href

            });

        } catch {

            // Sharing cancelled

        }

        return;
    }


    try {

        await navigator.clipboard.writeText(
            text
        );

        showToast(
            "Reel details copied",
            "✓"
        );

    } catch {

        showToast(
            "Sharing is unavailable",
            "!"
        );

    }

}


/* =========================================================
   COMMENTS
   ========================================================= */

function setupComments() {

    closeComments.addEventListener(
        "click",
        closeCommentsModal
    );


    commentsOverlay.addEventListener(
        "click",
        closeCommentsModal
    );


    commentForm.addEventListener(
        "submit",
        submitComment
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !commentsModal.classList.contains(
                    "hidden"
                )
            ) {

                closeCommentsModal();

            }

        }
    );

}


function openComments(
    reel
) {

    currentCommentReel =
        reel.id;


    renderComments(
        reel
    );


    commentsModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () =>
            commentInput.focus(),
        100
    );

}


function closeCommentsModal() {

    commentsModal.classList.add(
        "hidden"
    );

    currentCommentReel =
        null;

}


function renderComments(
    reel
) {

    const comments =
        getComments(
            reel.id
        );


    commentsList.innerHTML =
        "";


    commentCount.textContent =
        `${reel.comments + comments.length}
         ${
             reel.comments + comments.length === 1
                 ? "comment"
                 : "comments"
         }`;


    if (
        comments.length === 0
    ) {

        commentsList.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:35px 10px;
                    color:#888;
                    font-size:13px;
                "
            >
                Be the first to add a comment.
            </div>

        `;

        return;

    }


    comments.forEach(
        comment => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "comment-item";


            item.innerHTML = `

                <div class="comment-avatar">
                    ${escapeHTML(
                        comment.avatar
                    )}
                </div>

                <div class="comment-content">

                    <strong>
                        ${escapeHTML(
                            comment.user
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            comment.text
                        )}
                    </p>

                </div>

            `;


            commentsList.appendChild(
                item
            );

        }
    );

}


function getComments(
    reelId
) {

    return Array.isArray(
        reelComments[reelId]
    )
        ? reelComments[reelId]
        : [];

}


function getCommentCount(
    reelId
) {

    return getComments(
        reelId
    ).length;

}


function submitComment(
    event
) {

    event.preventDefault();


    const text =
        commentInput.value.trim();


    if (
        !text ||
        !currentCommentReel
    ) {

        return;

    }


    if (
        !reelComments[
            currentCommentReel
        ]
    ) {

        reelComments[
            currentCommentReel
        ] = [];

    }


    reelComments[
        currentCommentReel
    ].push({

        user: "You",

        avatar: "YO",

        text: text

    });


    localStorage.setItem(
        REELS_COMMENTS_KEY,
        JSON.stringify(
            reelComments
        )
    );


    const reel =
        demoReels.find(
            item =>
                item.id ===
                currentCommentReel
        );


    commentInput.value = "";


    if (reel) {

        renderComments(
            reel
        );

    }


    renderReels();


    showToast(
        "Comment added",
        "✓"
    );

}


/* =========================================================
   NUMBER FORMAT
   ========================================================= */

function formatNumber(
    number
) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            notation: "compact",
            maximumFractionDigits: 1
        }
    ).format(number);

}


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
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
            2500
        );

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.vibeConnectReels = {

    refresh() {

        loadState();

        renderReels();

    },

    getReels() {

        return [
            ...demoReels
        ];

    },

    getLiked() {

        return [
            ...likedReels
        ];

    },

    getSaved() {

        return [
            ...savedReels
        ];

    }

};

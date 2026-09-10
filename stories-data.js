```javascript
/* =========================================================
   VIBECONNECT — REAL STORIES & REELS
   STEP 27
   ========================================================= */

"use strict";


/* =========================================================
   STATE
   ========================================================= */

const state = {

    client: null,

    currentUser: null,

    stories: [],

    reels: [],

    activeTab: "stories",

    selectedStory: null

};


/* =========================================================
   ELEMENTS
   ========================================================= */

const elements = {

    connectionStatus:
        document.getElementById(
            "connectionStatus"
        ),

    statusDot:
        document.getElementById(
            "statusDot"
        ),

    loginCard:
        document.getElementById(
            "loginCard"
        ),

    mainContent:
        document.getElementById(
            "mainContent"
        ),

    loginButton:
        document.getElementById(
            "loginButton"
        ),

    backButton:
        document.getElementById(
            "backButton"
        ),

    refreshButton:
        document.getElementById(
            "refreshButton"
        ),

    storiesSection:
        document.getElementById(
            "storiesSection"
        ),

    reelsSection:
        document.getElementById(
            "reelsSection"
        ),

    storyGrid:
        document.getElementById(
            "storyGrid"
        ),

    reelsGrid:
        document.getElementById(
            "reelsGrid"
        ),

    storyCount:
        document.getElementById(
            "storyCount"
        ),

    reelCount:
        document.getElementById(
            "reelCount"
        ),

    storyViewer:
        document.getElementById(
            "storyViewer"
        ),

    viewerBackdrop:
        document.getElementById(
            "viewerBackdrop"
        ),

    viewerClose:
        document.getElementById(
            "viewerClose"
        ),

    viewerProgress:
        document.getElementById(
            "viewerProgress"
        ),

    viewerUser:
        document.getElementById(
            "viewerUser"
        ),

    viewerContent:
        document.getElementById(
            "viewerContent"
        ),

    viewerCaption:
        document.getElementById(
            "viewerCaption"
        ),

    viewerDelete:
        document.getElementById(
            "viewerDelete"
        ),

    toast:
        document.getElementById(
            "toast"
        )

};


/* =========================================================
   SUPABASE CLIENT
   ========================================================= */

function getSupabaseClient() {

    if (
        window.vibeSupabase?.client
    ) {

        return window.vibeSupabase.client;

    }

    if (
        window.vibeSupabase &&
        typeof window.vibeSupabase.from ===
            "function"
    ) {

        return window.vibeSupabase;

    }

    return null;
}


/* =========================================================
   HELPERS
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


function getInitials(
    name,
    username
) {

    const source =
        String(
            name ||
            username ||
            "V"
        ).trim();

    if (!source) {
        return "V";
    }

    const parts =
        source
            .split(/\s+/)
            .filter(Boolean);

    if (
        parts.length >= 2
    ) {

        return (
            parts[0][0] +
            parts[1][0]
        ).toUpperCase();
    }

    return source
        .slice(0, 2)
        .toUpperCase();
}


function formatTime(
    timestamp
) {

    if (!timestamp) {
        return "";
    }

    const date =
        new Date(timestamp);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";
    }

    return date.toLocaleString(
        [],
        {
            dateStyle:
                "medium",
            timeStyle:
                "short"
        }
    );
}


function isStoryActive(
    timestamp
) {

    if (!timestamp) {
        return false;
    }

    const created =
        new Date(timestamp)
            .getTime();

    const now =
        Date.now();

    const twentyFourHours =
        24 * 60 * 60 * 1000;

    return (
        now - created <
        twentyFourHours
    );
}


function showToast(
    message
) {

    elements.toast.textContent =
        message;

    elements.toast.classList.add(
        "show"
    );

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(
            () => {

                elements.toast.classList.remove(
                    "show"
                );

            },
            2600
        );
}


function setConnection(
    message,
    success
) {

    elements.connectionStatus.textContent =
        message;

    elements.statusDot.classList.remove(
        "connected",
        "error"
    );

    if (success === true) {

        elements.statusDot.classList.add(
            "connected"
        );
    }

    if (success === false) {

        elements.statusDot.classList.add(
            "error"
        );
    }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

async function initialize() {

    state.client =
        getSupabaseClient();

    if (!state.client) {

        setConnection(
            "Supabase client not found",
            false
        );

        showLoginState();

        return;
    }

    setConnection(
        "Connected to Supabase",
        true
    );

    await checkAuthentication();
}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

async function checkAuthentication() {

    try {

        const {
            data,
            error
        } =
            await state.client.auth.getUser();

        if (error) {
            throw error;
        }

        state.currentUser =
            data?.user || null;


        if (!state.currentUser) {

            showLoginState();

            return;
        }


        showMainState();

        await loadAllContent();

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        showLoginState();
    }
}


function showLoginState() {

    elements.loginCard.classList.remove(
        "hidden"
    );

    elements.mainContent.classList.add(
        "hidden"
    );
}


function showMainState() {

    elements.loginCard.classList.add(
        "hidden"
    );

    elements.mainContent.classList.remove(
        "hidden"
    );
}


/* =========================================================
   LOAD ALL CONTENT
   ========================================================= */

async function loadAllContent() {

    showStoryLoading();

    showReelLoading();

    await Promise.all([
        loadStories(),
        loadReels()
    ]);
}


/* =========================================================
   LOAD STORIES
   ========================================================= */

async function loadStories() {

    const {
        data,
        error
    } =
        await state.client
            .from("stories")
            .select(`
                id,
                user_id,
                content,
                media_url,
                media_type,
                created_at,
                profiles (
                    display_name,
                    username,
                    avatar_url
                )
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Story loading error:",
            error
        );

        showStoryError(
            error.message
        );

        return;
    }


    state.stories =
        (data || [])
            .filter(
                story =>
                    isStoryActive(
                        story.created_at
                    )
            );


    elements.storyCount.textContent =
        `${state.stories.length} ${
            state.stories.length === 1
                ? "story"
                : "stories"
        }`;


    renderStories();
}


/* =========================================================
   RENDER STORIES
   ========================================================= */

function renderStories() {

    elements.storyGrid.innerHTML =
        "";


    if (!state.stories.length) {

        elements.storyGrid.innerHTML =
            `
                <div class="empty-state">

                    <div class="empty-icon">
                        📸
                    </div>

                    <h3>
                        No active stories
                    </h3>

                    <p>
                        New Stories will appear here
                        when people post them.
                    </p>

                </div>
            `;

        return;
    }


    state.stories.forEach(
        story => {

            const card =
                createStoryCard(
                    story
                );

            elements.storyGrid.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   STORY CARD
   ========================================================= */

function createStoryCard(
    story
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "story-card";


    const profile =
        story.profiles || {};


    const name =
        profile.display_name ||
        profile.username ||
        "VibeConnect User";


    const username =
        profile.username
            ? `@${profile.username}`
            : "@user";


    const avatar =
        profile.avatar_url
            ? `
                <img
                    src="${escapeHTML(
                        profile.avatar_url
                    )}"
                    alt="${escapeHTML(
                        name
                    )}"
                >
              `
            : getInitials(
                name,
                profile.username
            );


    let media = "";


    if (
        story.media_url &&
        story.media_type ===
            "video"
    ) {

        media =
            `
                <video
                    class="story-media"
                    src="${escapeHTML(
                        story.media_url
                    )}"
                    muted
                    playsinline
                    preload="metadata"
                ></video>
            `;

    } else if (
        story.media_url
    ) {

        media =
            `
                <img
                    class="story-media"
                    src="${escapeHTML(
                        story.media_url
                    )}"
                    alt="Story"
                    loading="lazy"
                >
            `;

    } else {

        media =
            `
                <div
                    class="story-media story-text-media"
                    style="
                        background:
                        linear-gradient(
                            135deg,
                            #6d4aff,
                            #9a7cff
                        );
                    "
                ></div>
            `;
    }


    card.innerHTML =
        `
            ${media}

            <div class="story-overlay">

                <div class="story-user">

                    <div class="story-avatar">
                        ${avatar}
                    </div>

                    <div>

                        <div class="story-name">
                            ${escapeHTML(
                                name
                            )}
                        </div>

                        <div class="story-time">
                            ${escapeHTML(
                                formatTime(
                                    story.created_at
                                )
                            )}
                        </div>

                    </div>

                </div>


                <div class="story-caption">

                    ${escapeHTML(
                        story.content ||
                        "VibeConnect Story"
                    )}

                </div>

            </div>
        `;


    card.addEventListener(
        "click",
        () =>
            openStory(
                story
            )
    );


    return card;
}


/* =========================================================
   OPEN STORY
   ========================================================= */

function openStory(
    story
) {

    state.selectedStory =
        story;


    const profile =
        story.profiles || {};


    const name =
        profile.display_name ||
        profile.username ||
        "VibeConnect User";


    elements.viewerUser.textContent =
        `${name} • ${formatTime(
            story.created_at
        )}`;


    elements.viewerCaption.textContent =
        story.content || "";


    elements.viewerContent.innerHTML =
        "";


    if (
        story.media_url &&
        story.media_type ===
            "video"
    ) {

        const video =
            document.createElement(
                "video"
            );

        video.src =
            story.media_url;

        video.controls =
            true;

        video.autoplay =
            true;

        video.playsInline =
            true;

        elements.viewerContent.appendChild(
            video
        );

    } else if (
        story.media_url
    ) {

        const image =
            document.createElement(
                "img"
            );

        image.src =
            story.media_url;

        image.alt =
            "Story";

        elements.viewerContent.appendChild(
            image
        );

    } else {

        const text =
            document.createElement(
                "div"
            );

        text.style.color =
            "white";

        text.style.padding =
            "30px";

        text.style.textAlign =
            "center";

        text.style.fontSize =
            "22px";

        text.textContent =
            story.content ||
            "VibeConnect Story";

        elements.viewerContent.appendChild(
            text
        );
    }


    const isOwner =
        story.user_id ===
        state.currentUser.id;


    elements.viewerDelete.classList.toggle(
        "hidden",
        !isOwner
    );


    elements.storyViewer.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CLOSE STORY
   ========================================================= */

function closeStoryViewer() {

    const video =
        elements.viewerContent.querySelector(
            "video"
        );

    if (video) {

        video.pause();
    }


    elements.viewerContent.innerHTML =
        "";

    elements.storyViewer.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";
}


/* =========================================================
   DELETE STORY
   ========================================================= */

async function deleteStory() {

    const story =
        state.selectedStory;


    if (!story) {
        return;
    }


    if (
        story.user_id !==
        state.currentUser.id
    ) {

        showToast(
            "You can only delete your own story."
        );

        return;
    }


    elements.viewerDelete.disabled =
        true;


    const {
        error
    } =
        await state.client
            .from("stories")
            .delete()
            .eq(
                "id",
                story.id
            )
            .eq(
                "user_id",
                state.currentUser.id
            );


    if (error) {

        console.error(
            "Story deletion error:",
            error
        );

        showToast(
            error.message ||
            "Unable to delete story."
        );

        elements.viewerDelete.disabled =
            false;

        return;
    }


    state.stories =
        state.stories.filter(
            item =>
                item.id !==
                story.id
        );


    closeStoryViewer();

    renderStories();


    elements.storyCount.textContent =
        `${state.stories.length} ${
            state.stories.length === 1
                ? "story"
                : "stories"
        }`;


    showToast(
        "Your story was deleted."
    );

    elements.viewerDelete.disabled =
        false;
}


/* =========================================================
   LOAD REELS
   ========================================================= */

async function loadReels() {

    const {
        data,
        error
    } =
        await state.client
            .from("posts")
            .select(`
                id,
                user_id,
                content,
                media_url,
                media_type,
                created_at,
                profiles (
                    display_name,
                    username,
                    avatar_url
                )
            `)
            .eq(
                "media_type",
                "video"
            )
            .not(
                "media_url",
                "is",
                null
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(30);


    if (error) {

        console.error(
            "Reel loading error:",
            error
        );

        showReelError(
            error.message
        );

        return;
    }


    state.reels =
        data || [];


    elements.reelCount.textContent =
        `${state.reels.length} ${
            state.reels.length === 1
                ? "reel"
                : "reels"
        }`;


    renderReels();
}


/* =========================================================
   RENDER REELS
   ========================================================= */

function renderReels() {

    elements.reelsGrid.innerHTML =
        "";


    if (!state.reels.length) {

        elements.reelsGrid.innerHTML =
            `
                <div class="empty-state">

                    <div class="empty-icon">
                        🎬
                    </div>

                    <h3>
                        No Reels yet
                    </h3>

                    <p>
                        Video posts will appear here
                        automatically.
                    </p>

                </div>
            `;

        return;
    }


    state.reels.forEach(
        reel => {

            const card =
                createReelCard(
                    reel
                );

            elements.reelsGrid.appendChild(
                card
            );
        }
    );


    setupReelPlayback();
}


/* =========================================================
   REEL CARD
   ========================================================= */

function createReelCard(
    reel
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "reel-card";


    const profile =
        reel.profiles || {};


    const name =
        profile.display_name ||
        profile.username ||
        "VibeConnect User";


    const avatar =
        profile.avatar_url
            ? `
                <img
                    src="${escapeHTML(
                        profile.avatar_url
                    )}"
                    alt="${escapeHTML(
                        name
                    )}"
                >
              `
            : getInitials(
                name,
                profile.username
            );


    card.innerHTML =
        `
            <video
                class="reel-video"
                src="${escapeHTML(
                    reel.media_url
                )}"
                playsinline
                muted
                loop
                preload="metadata"
            ></video>


            <div class="reel-overlay">

                <div class="reel-user">

                    <div class="reel-avatar">
                        ${avatar}
                    </div>

                    <div>

                        <div class="reel-name">
                            ${escapeHTML(
                                name
                            )}
                        </div>

                        <div>
                            ${escapeHTML(
                                profile.username
                                    ? `@${profile.username}`
                                    : ""
                            )}
                        </div>

                    </div>

                </div>


                <div class="reel-info">

                    <div class="reel-caption">

                        ${escapeHTML(
                            reel.content ||
                            "VibeConnect Reel"
                        )}

                    </div>

                    <small>
                        ${escapeHTML(
                            formatTime(
                                reel.created_at
                            )
                        )}
                    </small>

                </div>

            </div>


            <div class="reel-play">
                ▶
            </div>
        `;


    const video =
        card.querySelector(
            ".reel-video"
        );


    card.addEventListener(
        "click",
        event => {

            /*
             * Clicking the video toggles
             * play/pause.
             */

            if (
                event.target ===
                video
            ) {

                if (
                    video.paused
                ) {

                    video.play();

                } else {

                    video.pause();
                }
            }

        }
    );


    return card;
}


/* =========================================================
   REEL AUTO PLAY
   ========================================================= */

function setupReelPlayback() {

    const videos =
        document.querySelectorAll(
            ".reel-video"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        const video =
                            entry.target;


                        if (
                            entry.isIntersecting
                        ) {

                            video.play()
                                .catch(
                                    () => {}
                                );

                        } else {

                            video.pause();
                        }

                    }
                );

            },
            {
                threshold:
                    0.6
            }
        );


    videos.forEach(
        video =>
            observer.observe(
                video
            )
    );
}


/* =========================================================
   LOADING STATES
   ========================================================= */

function showStoryLoading() {

    elements.storyGrid.innerHTML =
        `
            <div class="loading-state">

                <div class="spinner"></div>

                <p>
                    Loading stories...
                </p>

            </div>
        `;
}


function showReelLoading() {

    elements.reelsGrid.innerHTML =
        `
            <div class="loading-state">

                <div class="spinner"></div>

                <p>
                    Loading Reels...
                </p>

            </div>
        `;
}


/* =========================================================
   ERRORS
   ========================================================= */

function showStoryError(
    message
) {

    elements.storyGrid.innerHTML =
        `
            <div class="error-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load Stories
                </h3>

                <p>
                    ${escapeHTML(
                        message
                    )}
                </p>

            </div>
        `;
}


function showReelError(
    message
) {

    elements.reelsGrid.innerHTML =
        `
            <div class="error-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load Reels
                </h3>

                <p>
                    ${escapeHTML(
                        message
                    )}
                </p>

            </div>
        `;
}


/* =========================================================
   TABS
   ========================================================= */

document
    .querySelectorAll(".tab")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".tab"
                        )
                        .forEach(
                            tab =>
                                tab.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    state.activeTab =
                        button.dataset.tab;


                    if (
                        state.activeTab ===
                        "stories"
                    ) {

                        elements.storiesSection.classList.remove(
                            "hidden"
                        );

                        elements.reelsSection.classList.add(
                            "hidden"
                        );

                    } else {

                        elements.storiesSection.classList.add(
                            "hidden"
                        );

                        elements.reelsSection.classList.remove(
                            "hidden"
                        );
                    }

                }
            );

        }
    );


/* =========================================================
   VIEWER EVENTS
   ========================================================= */

elements.viewerClose.addEventListener(
    "click",
    closeStoryViewer
);

elements.viewerBackdrop.addEventListener(
    "click",
    closeStoryViewer
);

elements.viewerDelete.addEventListener(
    "click",
    deleteStory
);


/* =========================================================
   LOGIN
   ========================================================= */

elements.loginButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "auth.html";
    }
);


/* =========================================================
   BACK
   ========================================================= */

elements.backButton.addEventListener(
    "click",
    () => {

        if (
            window.history.length > 1
        ) {

            window.history.back();

        } else {

            window.location.href =
                "app.html";
        }
    }
);


/* =========================================================
   REFRESH
   ========================================================= */

elements.refreshButton.addEventListener(
    "click",
    async () => {

        if (
            !state.currentUser
        ) {

            showToast(
                "Please sign in first."
            );

            return;
        }


        elements.refreshButton.disabled =
            true;


        try {

            await loadAllContent();

            showToast(
                "Stories & Reels refreshed."
            );

        } finally {

            elements.refreshButton.disabled =
                false;
        }
    }
);


/* =========================================================
   AUTH LISTENER
   ========================================================= */

function registerAuthListener() {

    if (
        !state.client?.auth
    ) {

        return;
    }


    state.client.auth.onAuthStateChange(
        async (
            _event,
            session
        ) => {

            state.currentUser =
                session?.user || null;


            if (
                !state.currentUser
            ) {

                showLoginState();

                return;
            }


            showMainState();

            await loadAllContent();
        }
    );
}


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !elements.storyViewer.classList.contains(
                "hidden"
            )
        ) {

            closeStoryViewer();
        }

    }
);


/* =========================================================
   PUBLIC API
   ========================================================= */

window.vibeConnectStoriesData = {

    refresh:
        loadAllContent,

    getStories:
        () =>
            [...state.stories],

    getReels:
        () =>
            [...state.reels],

    openStory:
        openStory

};


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initialize();

        registerAuthListener();

    }
);
```

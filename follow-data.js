```javascript
/* =========================================================
   VIBECONNECT — REAL FOLLOW & FRIENDS
   STEP 25
   ========================================================= */

"use strict";


/* =========================================================
   STATE
   ========================================================= */

const state = {
    client: null,
    currentUser: null,

    profiles: [],
    followingIds: new Set(),
    followerIds: new Set(),

    filter: "discover",
    search: ""
};


/* =========================================================
   ELEMENTS
   ========================================================= */

const elements = {
    connectionStatus: document.getElementById("connectionStatus"),
    statusDot: document.getElementById("statusDot"),

    loginCard: document.getElementById("loginCard"),
    mainContent: document.getElementById("mainContent"),

    loginButton: document.getElementById("loginButton"),

    backButton: document.getElementById("backButton"),
    refreshButton: document.getElementById("refreshButton"),

    followingCount: document.getElementById("followingCount"),
    followersCount: document.getElementById("followersCount"),
    mutualCount: document.getElementById("mutualCount"),

    searchInput: document.getElementById("searchInput"),
    clearSearch: document.getElementById("clearSearch"),

    peopleTitle: document.getElementById("peopleTitle"),
    resultCount: document.getElementById("resultCount"),
    peopleList: document.getElementById("peopleList"),

    toast: document.getElementById("toast")
};


/* =========================================================
   HELPERS
   ========================================================= */

function getSupabaseClient() {

    if (window.vibeSupabase?.client) {
        return window.vibeSupabase.client;
    }

    if (
        window.vibeSupabase &&
        typeof window.vibeSupabase.from === "function"
    ) {
        return window.vibeSupabase;
    }

    return null;
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function initials(name, username) {

    const source =
        String(name || username || "V")
            .trim();

    if (!source) {
        return "V";
    }

    const parts = source
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length >= 2) {
        return (
            parts[0][0] +
            parts[1][0]
        ).toUpperCase();
    }

    return source
        .slice(0, 2)
        .toUpperCase();
}


function showToast(message) {

    elements.toast.textContent = message;

    elements.toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        elements.toast.classList.remove("show");
    }, 2500);
}


function setConnection(status, success) {

    elements.connectionStatus.textContent = status;

    elements.statusDot.classList.remove(
        "connected",
        "error"
    );

    if (success === true) {
        elements.statusDot.classList.add("connected");
    }

    if (success === false) {
        elements.statusDot.classList.add("error");
    }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

async function initialize() {

    state.client = getSupabaseClient();

    if (!state.client) {

        setConnection(
            "Supabase client not found",
            false
        );

        showError(
            "The Supabase connection is not available."
        );

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
        } = await state.client.auth.getUser();

        if (error) {
            throw error;
        }

        state.currentUser = data?.user || null;

        if (!state.currentUser) {

            showLoginState();

            return;
        }

        showMainState();

        await loadNetwork();

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        showLoginState();

        showToast(
            "Please sign in to continue."
        );
    }
}


function showLoginState() {

    elements.loginCard.classList.remove("hidden");
    elements.mainContent.classList.add("hidden");
}


function showMainState() {

    elements.loginCard.classList.add("hidden");
    elements.mainContent.classList.remove("hidden");
}


/* =========================================================
   LOAD NETWORK
   ========================================================= */

async function loadNetwork() {

    showLoading();

    try {

        await Promise.all([
            loadProfiles(),
            loadFollowing(),
            loadFollowers()
        ]);

        updateStats();
        renderPeople();

    } catch (error) {

        console.error(
            "Network loading error:",
            error
        );

        showError(
            "Unable to load your network. Check your Supabase tables and RLS policies."
        );
    }
}


/* =========================================================
   LOAD PROFILES
   ========================================================= */

async function loadProfiles() {

    const {
        data,
        error
    } = await state.client
        .from("profiles")
        .select(`
            id,
            display_name,
            username,
            bio,
            avatar_url,
            created_at
        `)
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (error) {
        throw error;
    }

    state.profiles = Array.isArray(data)
        ? data
        : [];
}


/* =========================================================
   LOAD FOLLOWING
   ========================================================= */

async function loadFollowing() {

    const {
        data,
        error
    } = await state.client
        .from("follows")
        .select("following_id")
        .eq(
            "follower_id",
            state.currentUser.id
        );

    if (error) {
        throw error;
    }

    state.followingIds = new Set(
        (data || []).map(
            row => row.following_id
        )
    );
}


/* =========================================================
   LOAD FOLLOWERS
   ========================================================= */

async function loadFollowers() {

    const {
        data,
        error
    } = await state.client
        .from("follows")
        .select("follower_id")
        .eq(
            "following_id",
            state.currentUser.id
        );

    if (error) {
        throw error;
    }

    state.followerIds = new Set(
        (data || []).map(
            row => row.follower_id
        )
    );
}


/* =========================================================
   STATS
   ========================================================= */

function updateStats() {

    elements.followingCount.textContent =
        state.followingIds.size;

    elements.followersCount.textContent =
        state.followerIds.size;

    let mutuals = 0;

    state.followingIds.forEach(id => {

        if (state.followerIds.has(id)) {
            mutuals++;
        }
    });

    elements.mutualCount.textContent =
        mutuals;
}


/* =========================================================
   FILTERING
   ========================================================= */

function getFilteredProfiles() {

    let profiles = state.profiles.filter(
        profile =>
            profile.id !== state.currentUser.id
    );


    if (state.filter === "following") {

        profiles = profiles.filter(
            profile =>
                state.followingIds.has(profile.id)
        );
    }


    if (state.filter === "followers") {

        profiles = profiles.filter(
            profile =>
                state.followerIds.has(profile.id)
        );
    }


    const query =
        state.search
            .trim()
            .toLowerCase();


    if (query) {

        profiles = profiles.filter(profile => {

            const name =
                String(
                    profile.display_name || ""
                ).toLowerCase();

            const username =
                String(
                    profile.username || ""
                ).toLowerCase();

            const bio =
                String(
                    profile.bio || ""
                ).toLowerCase();

            return (
                name.includes(query) ||
                username.includes(query) ||
                bio.includes(query)
            );
        });
    }


    return profiles;
}


/* =========================================================
   RENDER PEOPLE
   ========================================================= */

function renderPeople() {

    const profiles =
        getFilteredProfiles();

    elements.peopleList.innerHTML = "";

    elements.resultCount.textContent =
        `${profiles.length} ${
            profiles.length === 1
                ? "person"
                : "people"
        }`;


    if (state.filter === "following") {

        elements.peopleTitle.textContent =
            "People you follow";

    } else if (state.filter === "followers") {

        elements.peopleTitle.textContent =
            "Your followers";

    } else {

        elements.peopleTitle.textContent =
            "People you may know";
    }


    if (!profiles.length) {

        const empty = document.createElement(
            "div"
        );

        empty.className = "empty-state";

        empty.innerHTML = `
            <div class="empty-icon">👥</div>
            <h3>No people found</h3>
            <p>
                ${
                    state.search
                        ? "Try a different name or username."
                        : "There are no matching profiles yet."
                }
            </p>
        `;

        elements.peopleList.appendChild(
            empty
        );

        return;
    }


    profiles.forEach(profile => {

        const card =
            createPersonCard(profile);

        elements.peopleList.appendChild(card);
    });
}


/* =========================================================
   PERSON CARD
   ========================================================= */

function createPersonCard(profile) {

    const card =
        document.createElement("article");

    card.className = "person-card";

    const name =
        profile.display_name ||
        profile.username ||
        "VibeConnect User";

    const username =
        profile.username
            ? `@${profile.username}`
            : "@user";

    const isFollowing =
        state.followingIds.has(profile.id);

    const avatar =
        profile.avatar_url
            ? `
                <img
                    src="${escapeHTML(profile.avatar_url)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                >
              `
            : `
                ${escapeHTML(
                    initials(
                        name,
                        profile.username
                    )
                )}
              `;


    card.innerHTML = `
        <div class="person-avatar">
            ${avatar}
        </div>

        <div class="person-info">

            <p class="person-name">
                ${escapeHTML(name)}
            </p>

            <p class="person-username">
                ${escapeHTML(username)}
            </p>

            ${
                profile.bio
                    ? `
                        <p class="person-bio">
                            ${escapeHTML(profile.bio)}
                        </p>
                      `
                    : ""
            }

        </div>

        <button
            class="follow-button ${
                isFollowing
                    ? "unfollow"
                    : "follow"
            }"
            data-user-id="${escapeHTML(profile.id)}"
            type="button"
        >
            ${
                isFollowing
                    ? "Following"
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
        () => toggleFollow(
            profile.id,
            button
        )
    );


    return card;
}


/* =========================================================
   FOLLOW / UNFOLLOW
   ========================================================= */

async function toggleFollow(
    targetUserId,
    button
) {

    if (!state.currentUser) {

        showToast(
            "Please sign in first."
        );

        return;
    }


    if (
        targetUserId ===
        state.currentUser.id
    ) {

        showToast(
            "You cannot follow yourself."
        );

        return;
    }


    const isFollowing =
        state.followingIds.has(
            targetUserId
        );


    button.disabled = true;


    try {

        if (isFollowing) {

            const {
                error
            } = await state.client
                .from("follows")
                .delete()
                .eq(
                    "follower_id",
                    state.currentUser.id
                )
                .eq(
                    "following_id",
                    targetUserId
                );

            if (error) {
                throw error;
            }

            state.followingIds.delete(
                targetUserId
            );

            showToast(
                "You unfollowed this person."
            );

        } else {

            const {
                error
            } = await state.client
                .from("follows")
                .insert({
                    follower_id:
                        state.currentUser.id,

                    following_id:
                        targetUserId
                });

            if (error) {
                throw error;
            }

            state.followingIds.add(
                targetUserId
            );

            showToast(
                "You're now following this person! 🎉"
            );
        }


        updateStats();

        renderPeople();

    } catch (error) {

        console.error(
            "Follow action error:",
            error
        );

        if (
            error.code === "23505"
        ) {

            showToast(
                "You are already following this person."
            );

        } else {

            showToast(
                error.message ||
                "Unable to update follow status."
            );
        }

    } finally {

        button.disabled = false;
    }
}


/* =========================================================
   LOADING / ERROR
   ========================================================= */

function showLoading() {

    elements.peopleList.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading people...</p>
        </div>
    `;
}


function showError(message) {

    elements.peopleList.innerHTML = `
        <div class="error-state">
            <div class="empty-icon">⚠️</div>

            <h3>Something went wrong</h3>

            <p>
                ${escapeHTML(message)}
            </p>
        </div>
    `;
}


/* =========================================================
   SEARCH
   ========================================================= */

elements.searchInput.addEventListener(
    "input",
    event => {

        state.search =
            event.target.value;

        elements.clearSearch.classList.toggle(
            "hidden",
            !state.search
        );

        renderPeople();
    }
);


elements.clearSearch.addEventListener(
    "click",
    () => {

        state.search = "";

        elements.searchInput.value = "";

        elements.clearSearch.classList.add(
            "hidden"
        );

        renderPeople();

        elements.searchInput.focus();
    }
);


/* =========================================================
   FILTER BUTTONS
   ========================================================= */

document
    .querySelectorAll(".filter-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-button"
                    )
                    .forEach(item => {
                        item.classList.remove(
                            "active"
                        );
                    });

                button.classList.add(
                    "active"
                );

                state.filter =
                    button.dataset.filter;

                renderPeople();
            }
        );
    });


/* =========================================================
   REFRESH
   ========================================================= */

elements.refreshButton.addEventListener(
    "click",
    async () => {

        if (!state.currentUser) {

            showToast(
                "Please sign in first."
            );

            return;
        }

        elements.refreshButton.disabled =
            true;

        try {

            await loadNetwork();

            showToast(
                "Network refreshed."
            );

        } finally {

            elements.refreshButton.disabled =
                false;
        }
    }
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
   AUTH STATE CHANGES
   ========================================================= */

function registerAuthListener() {

    if (
        !state.client?.auth
    ) {
        return;
    }


    state.client.auth.onAuthStateChange(
        async (_event, session) => {

            state.currentUser =
                session?.user || null;


            if (!state.currentUser) {

                showLoginState();

                return;
            }


            showMainState();

            await loadNetwork();
        }
    );
}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.vibeConnectFollow = {

    refresh: loadNetwork,

    getFollowing: () =>
        [...state.followingIds],

    getFollowers: () =>
        [...state.followerIds],

    getMutuals: () =>
        [...state.followingIds]
            .filter(
                id =>
                    state.followerIds.has(id)
            )
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

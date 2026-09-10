```javascript
/* =========================================================
   VIBECONNECT — HOME
   STEP 31
   Real Supabase Home Feed
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       STATE
       ===================================================== */

    const state = {
        client: null,
        user: null,
        profile: null,
        posts: [],
        likedPosts: new Set(),
        savedPosts: new Set(),
        notificationCount: 0,
        loading: false
    };


    /* =====================================================
       DOM
       ===================================================== */

    const elements = {
        loginState: document.getElementById("loginState"),

        loadingState: document.getElementById("loadingState"),

        emptyState: document.getElementById("emptyState"),

        feedContainer: document.getElementById("feedContainer"),

        refreshButton: document.getElementById("refreshButton"),

        feedRefreshButton:
            document.getElementById("feedRefreshButton"),

        logoutButton:
            document.getElementById("logoutButton"),

        welcomeTitle:
            document.getElementById("welcomeTitle"),

        miniAvatar:
            document.getElementById("miniAvatar"),

        miniName:
            document.getElementById("miniName"),

        miniUsername:
            document.getElementById("miniUsername"),

        topAvatar:
            document.getElementById("topAvatar"),

        notificationBadge:
            document.getElementById("notificationBadge"),

        topNotificationBadge:
            document.getElementById("topNotificationBadge"),

        toast:
            document.getElementById("toast")
    };


    /* =====================================================
       HELPERS
       ===================================================== */

    function getSupabaseClient() {

        if (
            window.vibeSupabase &&
            window.vibeSupabase.client
        ) {
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


    function getInitials(name) {

        const clean = String(name || "V")
            .trim();

        if (!clean) {
            return "V";
        }

        const parts = clean
            .split(/\s+/)
            .slice(0, 2);

        return parts
            .map(part => part.charAt(0))
            .join("")
            .toUpperCase();
    }


    function formatTime(dateValue) {

        if (!dateValue) {
            return "Just now";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Recently";
        }

        const seconds =
            Math.floor(
                (Date.now() - date.getTime()) / 1000
            );

        if (seconds < 60) {
            return "Just now";
        }

        const minutes =
            Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes}m ago`;
        }

        const hours =
            Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours}h ago`;
        }

        const days =
            Math.floor(hours / 24);

        if (days < 7) {
            return `${days}d ago`;
        }

        return date.toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }


    function showToast(message) {

        if (!elements.toast) {
            return;
        }

        elements.toast.textContent = message;

        elements.toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer =
            setTimeout(() => {
                elements.toast.classList.remove("show");
            }, 2600);
    }


    /* =====================================================
       AVATAR
       ===================================================== */

    function avatarHTML(profile, className) {

        const name =
            profile?.display_name ||
            profile?.username ||
            "V";

        const avatar =
            profile?.avatar_url;

        if (avatar) {

            return `
                <div class="${className}">
                    <img
                        src="${escapeHTML(avatar)}"
                        alt="${escapeHTML(name)}"
                    >
                </div>
            `;
        }

        return `
            <div class="${className}">
                ${escapeHTML(getInitials(name))}
            </div>
        `;
    }


    function setTopProfile(profile) {

        const name =
            profile?.display_name ||
            state.user?.user_metadata?.display_name ||
            "Vibe User";

        const username =
            profile?.username ||
            state.user?.user_metadata?.username ||
            "user";

        const avatar =
            profile?.avatar_url ||
            state.user?.user_metadata?.avatar_url ||
            "";


        elements.miniName.textContent = name;

        elements.miniUsername.textContent =
            `@${username}`;


        elements.welcomeTitle.textContent =
            `Welcome back, ${name.split(" ")[0]}!`;


        if (avatar) {

            elements.miniAvatar.innerHTML = `
                <img
                    src="${escapeHTML(avatar)}"
                    alt="${escapeHTML(name)}"
                >
            `;

            elements.topAvatar.innerHTML = `
                <img
                    src="${escapeHTML(avatar)}"
                    alt="${escapeHTML(name)}"
                >
            `;

        } else {

            const initials =
                getInitials(name);

            elements.miniAvatar.textContent =
                initials;

            elements.topAvatar.textContent =
                initials;
        }
    }


    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    async function loadCurrentUser() {

        if (!state.client) {
            return null;
        }

        const {
            data,
            error
        } =
            await state.client.auth.getUser();

        if (error) {
            console.error(
                "Auth error:",
                error
            );

            return null;
        }

        return data?.user || null;
    }


    async function loadProfile() {

        if (!state.client || !state.user) {
            return;
        }

        const {
            data,
            error
        } =
            await state.client
                .from("profiles")
                .select(`
                    id,
                    display_name,
                    username,
                    bio,
                    avatar_url,
                    cover_url
                `)
                .eq("id", state.user.id)
                .maybeSingle();


        if (error) {

            console.warn(
                "Profile query warning:",
                error
            );

            state.profile = {
                display_name:
                    state.user.user_metadata?.display_name,

                username:
                    state.user.user_metadata?.username,

                avatar_url:
                    state.user.user_metadata?.avatar_url
            };

            setTopProfile(state.profile);

            return;
        }


        state.profile =
            data ||
            {
                display_name:
                    state.user.user_metadata?.display_name,

                username:
                    state.user.user_metadata?.username,

                avatar_url:
                    state.user.user_metadata?.avatar_url
            };


        setTopProfile(state.profile);
    }


    /* =====================================================
       LOAD POSTS
       ===================================================== */

    async function loadPosts() {

        if (!state.client || !state.user) {
            return;
        }


        setLoading(true);


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
                .order("created_at", {
                    ascending: false
                })
                .limit(50);


        if (error) {

            console.error(
                "Post loading error:",
                error
            );

            setLoading(false);

            showFeedError(
                "We couldn't load the feed.",
                error.message
            );

            return;
        }


        state.posts =
            Array.isArray(data)
                ? data
                : [];


        await loadInteractionState();


        renderFeed();


        setLoading(false);
    }


    /* =====================================================
       LOAD LIKES / SAVES
       ===================================================== */

    async function loadInteractionState() {

        state.likedPosts.clear();

        state.savedPosts.clear();


        if (
            !state.client ||
            !state.user ||
            !state.posts.length
        ) {
            return;
        }


        const postIds =
            state.posts.map(post => post.id);


        /* LIKES */

        const {
            data: likes,
            error: likesError
        } =
            await state.client
                .from("likes")
                .select("post_id")
                .eq("user_id", state.user.id)
                .in("post_id", postIds);


        if (!likesError && likes) {

            likes.forEach(item => {
                state.likedPosts.add(
                    item.post_id
                );
            });
        }


        /* SAVES */

        const {
            data: saves,
            error: savesError
        } =
            await state.client
                .from("saved_posts")
                .select("post_id")
                .eq("user_id", state.user.id)
                .in("post_id", postIds);


        if (!savesError && saves) {

            saves.forEach(item => {
                state.savedPosts.add(
                    item.post_id
                );
            });
        }
    }


    /* =====================================================
       LOAD NOTIFICATIONS
       ===================================================== */

    async function loadNotificationCount() {

        if (!state.client || !state.user) {
            return;
        }


        const {
            count,
            error
        } =
            await state.client
                .from("notifications")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )
                .eq(
                    "user_id",
                    state.user.id
                )
                .eq(
                    "is_read",
                    false
                );


        if (error) {

            console.warn(
                "Notification count:",
                error
            );

            return;
        }


        state.notificationCount =
            count || 0;


        renderNotificationCount();
    }


    function renderNotificationCount() {

        const count =
            state.notificationCount;


        if (count > 0) {

            const display =
                count > 99
                    ? "99+"
                    : String(count);


            elements.notificationBadge.textContent =
                display;

            elements.notificationBadge.classList.remove(
                "hidden"
            );


            elements.topNotificationBadge.textContent =
                display;

            elements.topNotificationBadge.classList.remove(
                "hidden"
            );

        } else {

            elements.notificationBadge.classList.add(
                "hidden"
            );

            elements.topNotificationBadge.classList.add(
                "hidden"
            );
        }
    }


    /* =====================================================
       RENDER FEED
       ===================================================== */

    function renderFeed() {

        if (!elements.feedContainer) {
            return;
        }


        elements.feedContainer.innerHTML = "";


        if (!state.posts.length) {

            elements.emptyState.classList.remove(
                "hidden"
            );

            return;
        }


        elements.emptyState.classList.add(
            "hidden"
        );


        state.posts.forEach(post => {

            const card =
                createPostCard(post);

            elements.feedContainer.appendChild(
                card
            );
        });
    }


    function createPostCard(post) {

        const article =
            document.createElement("article");

        article.className = "post-card";

        article.dataset.postId =
            post.id;


        const profile =
            Array.isArray(post.profiles)
                ? post.profiles[0]
                : post.profiles;


        const displayName =
            profile?.display_name ||
            profile?.username ||
            "VibeConnect User";


        const username =
            profile?.username ||
            "user";


        const liked =
            state.likedPosts.has(post.id);


        const saved =
            state.savedPosts.has(post.id);


        const media =
            createMediaHTML(post);


        article.innerHTML = `

            <div class="post-header">

                <div class="post-author">

                    ${avatarHTML(
                        profile,
                        "post-avatar"
                    )}

                    <div class="post-author-info">

                        <strong>
                            ${escapeHTML(displayName)}
                        </strong>

                        <span>
                            @${escapeHTML(username)}
                            ·
                            ${escapeHTML(
                                formatTime(
                                    post.created_at
                                )
                            )}
                        </span>

                    </div>

                </div>

                <button
                    class="post-menu"
                    type="button"
                    title="Post options"
                    data-action="menu"
                >
                    ⋯
                </button>

            </div>


            ${
                post.content
                    ? `
                        <div class="post-content">
                            ${escapeHTML(post.content)}
                        </div>
                    `
                    : ""
            }


            ${media}


            <div class="post-actions">

                <button
                    class="post-action ${liked ? "active" : ""}"
                    type="button"
                    data-action="like"
                    data-post-id="${escapeHTML(post.id)}"
                >
                    ${liked ? "❤️" : "🤍"}
                    <span data-like-count>
                        Like
                    </span>
                </button>


                <button
                    class="post-action"
                    type="button"
                    data-action="comment"
                    data-post-id="${escapeHTML(post.id)}"
                >
                    💬
                    Comment
                </button>


                <button
                    class="post-action ${saved ? "active" : ""}"
                    type="button"
                    data-action="save"
                    data-post-id="${escapeHTML(post.id)}"
                >
                    ${saved ? "🔖" : "📑"}
                    ${saved ? "Saved" : "Save"}
                </button>

            </div>

        `;


        article.addEventListener(
            "click",
            handlePostAction
        );


        return article;
    }


    function createMediaHTML(post) {

        if (
            !post.media_url ||
            !post.media_type
        ) {
            return "";
        }


        const url =
            escapeHTML(post.media_url);


        const type =
            String(post.media_type)
                .toLowerCase();


        if (
            type.includes("video")
        ) {

            return `
                <video
                    class="post-media"
                    controls
                    playsinline
                    preload="metadata"
                >
                    <source
                        src="${url}"
                        type="${urlType(type)}"
                    >
                    Your browser does not support video.
                </video>
            `;
        }


        if (
            type.includes("image") ||
            type === "photo"
        ) {

            return `
                <img
                    class="post-media"
                    src="${url}"
                    alt="Post media"
                    loading="lazy"
                >
            `;
        }


        return "";
    }


    function urlType(type) {

        if (type.includes("mp4")) {
            return "video/mp4";
        }

        if (type.includes("webm")) {
            return "video/webm";
        }

        if (type.includes("ogg")) {
            return "video/ogg";
        }

        return "video/mp4";
    }


    /* =====================================================
       POST ACTIONS
       ===================================================== */

    async function handlePostAction(event) {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const postId =
            button.dataset.postId;


        if (action === "like") {

            await toggleLike(
                postId,
                button
            );

            return;
        }


        if (action === "save") {

            await toggleSave(
                postId,
                button
            );

            return;
        }


        if (action === "comment") {

            openComments(postId);

            return;
        }


        if (action === "menu") {

            showToast(
                "Post options will be expanded in a future update."
            );
        }
    }


    /* =====================================================
       LIKE
       ===================================================== */

    async function toggleLike(
        postId,
        button
    ) {

        if (!state.user) {

            showToast(
                "Please sign in to like posts."
            );

            return;
        }


        const isLiked =
            state.likedPosts.has(postId);


        button.disabled = true;


        if (isLiked) {

            const {
                error
            } =
                await state.client
                    .from("likes")
                    .delete()
                    .eq(
                        "post_id",
                        postId
                    )
                    .eq(
                        "user_id",
                        state.user.id
                    );


            if (error) {

                console.error(error);

                showToast(
                    "Couldn't remove the like."
                );

            } else {

                state.likedPosts.delete(
                    postId
                );

                updateLikeButton(
                    button,
                    false
                );

                showToast(
                    "Like removed"
                );
            }

        } else {

            const {
                error
            } =
                await state.client
                    .from("likes")
                    .insert({
                        post_id: postId,
                        user_id: state.user.id
                    });


            if (error) {

                console.error(error);

                showToast(
                    "Couldn't like this post."
                );

            } else {

                state.likedPosts.add(
                    postId
                );

                updateLikeButton(
                    button,
                    true
                );

                showToast(
                    "❤️ Liked"
                );
            }
        }


        button.disabled = false;
    }


    function updateLikeButton(
        button,
        liked
    ) {

        button.classList.toggle(
            "active",
            liked
        );


        const count =
            button.querySelector(
                "[data-like-count]"
            );


        if (liked) {

            button.firstChild.textContent =
                "❤️ ";

        } else {

            button.firstChild.textContent =
                "🤍 ";
        }


        if (count) {
            count.textContent = "Like";
        }
    }


    /* =====================================================
       SAVE
       ===================================================== */

    async function toggleSave(
        postId,
        button
    ) {

        if (!state.user) {

            showToast(
                "Please sign in to save posts."
            );

            return;
        }


        const isSaved =
            state.savedPosts.has(postId);


        button.disabled = true;


        if (isSaved) {

            const {
                error
            } =
                await state.client
                    .from("saved_posts")
                    .delete()
                    .eq(
                        "post_id",
                        postId
                    )
                    .eq(
                        "user_id",
                        state.user.id
                    );


            if (error) {

                console.error(error);

                showToast(
                    "Couldn't unsave this post."
                );

            } else {

                state.savedPosts.delete(
                    postId
                );

                updateSaveButton(
                    button,
                    false
                );

                showToast(
                    "Removed from saved"
                );
            }

        } else {

            const {
                error
            } =
                await state.client
                    .from("saved_posts")
                    .insert({
                        post_id: postId,
                        user_id: state.user.id
                    });


            if (error) {

                console.error(error);

                showToast(
                    "Couldn't save this post."
                );

            } else {

                state.savedPosts.add(
                    postId
                );

                updateSaveButton(
                    button,
                    true
                );

                showToast(
                    "🔖 Post saved"
                );
            }
        }


        button.disabled = false;
    }


    function updateSaveButton(
        button,
        saved
    ) {

        button.classList.toggle(
            "active",
            saved
        );


        button.textContent =
            saved
                ? "🔖 Saved"
                : "📑 Save";
    }


    /* =====================================================
       COMMENTS
       ===================================================== */

    function openComments(postId) {

        const post =
            state.posts.find(
                item => item.id === postId
            );


        if (!post) {
            return;
        }


        const comment =
            window.prompt(
                "Write a comment:"
            );


        if (
            comment === null ||
            !comment.trim()
        ) {
            return;
        }


        addComment(
            postId,
            comment.trim()
        );
    }


    async function addComment(
        postId,
        content
    ) {

        if (!state.user) {

            showToast(
                "Please sign in to comment."
            );

            return;
        }


        const {
            error
        } =
            await state.client
                .from("comments")
                .insert({
                    post_id: postId,
                    user_id: state.user.id,
                    content
                });


        if (error) {

            console.error(
                "Comment error:",
                error
            );

            showToast(
                "Couldn't add your comment."
            );

            return;
        }


        showToast(
            "💬 Comment added"
        );
    }


    /* =====================================================
       ERROR / LOADING STATES
       ===================================================== */

    function setLoading(isLoading) {

        state.loading =
            isLoading;


        if (isLoading) {

            elements.loadingState.classList.remove(
                "hidden"
            );

            elements.feedContainer.innerHTML = "";

            elements.feedContainer.appendChild(
                elements.loadingState
            );

            elements.emptyState.classList.add(
                "hidden"
            );

        } else {

            elements.loadingState.classList.add(
                "hidden"
            );
        }
    }


    function showFeedError(
        title,
        message
    ) {

        elements.feedContainer.innerHTML = `

            <div class="state-card">

                <div class="state-icon">
                    ⚠️
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(
                        message ||
                        "Please try again."
                    )}
                </p>

                <button
                    class="primary-button"
                    id="errorRetryButton"
                >
                    🔄 Try Again
                </button>

            </div>
        `;


        const retry =
            document.getElementById(
                "errorRetryButton"
            );


        if (retry) {

            retry.addEventListener(
                "click",
                loadPosts
            );
        }
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    async function logout() {

        if (!state.client) {
            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to sign out?"
            );


        if (!confirmed) {
            return;
        }


        const {
            error
        } =
            await state.client.auth.signOut();


        if (error) {

            showToast(
                "Couldn't sign out."
            );

            console.error(error);

            return;
        }


        window.location.href =
            "auth.html";
    }


    /* =====================================================
       REFRESH
       ===================================================== */

    async function refreshEverything() {

        if (!state.user) {

            showToast(
                "Please sign in first."
            );

            return;
        }


        showToast(
            "🔄 Refreshing your feed..."
        );


        await Promise.all([
            loadProfile(),
            loadPosts(),
            loadNotificationCount()
        ]);
    }


    /* =====================================================
       REALTIME NOTIFICATIONS
       ===================================================== */

    function subscribeToNotifications() {

        if (
            !state.client ||
            !state.user
        ) {
            return;
        }


        try {

            state.client
                .channel(
                    `home-notifications-${state.user.id}`
                )
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "notifications",
                        filter:
                            `user_id=eq.${state.user.id}`
                    },
                    () => {

                        state.notificationCount++;

                        renderNotificationCount();

                        showToast(
                            "🔔 New notification"
                        );
                    }
                )
                .subscribe();

        } catch (error) {

            console.warn(
                "Realtime notification setup failed:",
                error
            );
        }
    }


    /* =====================================================
       AUTH STATE
       ===================================================== */

    function showLoggedOutState() {

        elements.loginState.classList.remove(
            "hidden"
        );

        elements.feedContainer.innerHTML = "";

        elements.emptyState.classList.add(
            "hidden"
        );

        elements.welcomeTitle.textContent =
            "Welcome to VibeConnect!";
    }


    function showLoggedInState() {

        elements.loginState.classList.add(
            "hidden"
        );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    async function initialize() {

        state.client =
            getSupabaseClient();


        if (!state.client) {

            console.error(
                "Supabase client not found."
            );

            showFeedError(
                "Supabase is not connected.",
                "Check supabase.js and your Supabase project configuration."
            );

            return;
        }


        state.user =
            await loadCurrentUser();


        if (!state.user) {

            showLoggedOutState();

            return;
        }


        showLoggedInState();


        await loadProfile();

        await loadPosts();

        await loadNotificationCount();


        subscribeToNotifications();


        console.log(
            "VibeConnect Home initialized successfully."
        );
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    if (elements.refreshButton) {

        elements.refreshButton.addEventListener(
            "click",
            refreshEverything
        );
    }


    if (elements.feedRefreshButton) {

        elements.feedRefreshButton.addEventListener(
            "click",
            refreshEverything
        );
    }


    if (elements.logoutButton) {

        elements.logoutButton.addEventListener(
            "click",
            logout
        );
    }


    /* =====================================================
       AUTH LISTENER
       ===================================================== */

    function registerAuthListener() {

        if (!state.client) {
            return;
        }


        state.client.auth.onAuthStateChange(
            async (event, session) => {

                if (event === "SIGNED_OUT") {

                    state.user = null;

                    showLoggedOutState();

                    return;
                }


                if (
                    event === "SIGNED_IN" ||
                    event === "TOKEN_REFRESHED"
                ) {

                    state.user =
                        session?.user ||
                        await loadCurrentUser();


                    if (state.user) {

                        showLoggedInState();

                        await loadProfile();

                        await loadPosts();

                        await loadNotificationCount();
                    }
                }
            }
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.vibeConnectHome = {

        refresh: refreshEverything,

        getPosts: function () {
            return [...state.posts];
        },

        getCurrentUser: function () {
            return state.user;
        },

        getProfile: function () {
            return state.profile;
        },

        getNotificationCount: function () {
            return state.notificationCount;
        }
    };


    /* =====================================================
       START
       ===================================================== */

    initialize().then(() => {

        registerAuthListener();

    });


})();
```

```javascript
/* =========================================================
   VIBECONNECT — FINAL INTEGRATION
   STEP 30
   ========================================================= */

(() => {

    "use strict";


    /* =====================================================
       STATE
       ===================================================== */

    const state = {
        client: null,
        user: null,
        profile: null,
        unreadNotifications: 0
    };


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const el = {

        userName:
            document.getElementById("userName"),

        headerUsername:
            document.getElementById("headerUsername"),

        userAvatar:
            document.getElementById("userAvatar"),

        connectionTitle:
            document.getElementById("connectionTitle"),

        connectionMessage:
            document.getElementById("connectionMessage"),

        connectionDot:
            document.getElementById("connectionDot"),

        notificationBadge:
            document.getElementById("notificationBadge"),

        headerNotificationBadge:
            document.getElementById(
                "headerNotificationBadge"
            ),

        notificationStat:
            document.getElementById(
                "notificationStat"
            ),

        profileStat:
            document.getElementById(
                "profileStat"
            ),

        securityStat:
            document.getElementById(
                "securityStat"
            ),

        toast:
            document.getElementById("toast")
    };


    /* =====================================================
       SUPABASE CLIENT
       ===================================================== */

    function getClient() {

        if (
            window.vibeSupabase &&
            window.vibeSupabase.client
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


    /* =====================================================
       TOAST
       ===================================================== */

    let toastTimer;

    function showToast(message) {

        if (!el.toast) {
            return;
        }

        el.toast.textContent = message;

        el.toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            el.toast.classList.remove("show");

        }, 2500);
    }


    /* =====================================================
       CONNECTION UI
       ===================================================== */

    function setConnection(
        connected,
        title,
        message
    ) {

        el.connectionTitle.textContent =
            title;

        el.connectionMessage.textContent =
            message;

        el.connectionDot.style.background =
            connected
                ? "#25a244"
                : "#e05252";
    }


    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    async function loadUser() {

        if (!state.client) {

            setConnection(
                false,
                "Supabase unavailable",
                "Check your supabase.js configuration."
            );

            return null;
        }

        const {
            data,
            error
        } =
            await state.client.auth.getUser();

        if (error) {

            console.error(
                "Authentication error:",
                error
            );

            setConnection(
                false,
                "Authentication error",
                error.message
            );

            return null;
        }

        state.user =
            data?.user || null;

        if (!state.user) {

            setConnection(
                false,
                "You're not signed in",
                "Sign in to VibeConnect to access your real account."
            );

            el.userName.textContent =
                "there";

            el.headerUsername.textContent =
                "Sign in";

            el.profileStat.textContent =
                "Guest";

            el.securityStat.textContent =
                "—";

            return null;
        }

        setConnection(
            true,
            "VibeConnect connected",
            "Your account is securely connected to Supabase."
        );

        return state.user;
    }


    /* =====================================================
       LOAD PROFILE
       ===================================================== */

    async function loadProfile() {

        if (
            !state.client ||
            !state.user
        ) {
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
                .eq(
                    "id",
                    state.user.id
                )
                .maybeSingle();

        if (error) {

            console.warn(
                "Profile loading issue:",
                error
            );

            useAuthMetadata();

            return;
        }

        state.profile =
            data || null;

        if (!state.profile) {

            useAuthMetadata();

            return;
        }

        renderProfile(
            state.profile
        );
    }


    /* =====================================================
       AUTH METADATA FALLBACK
       ===================================================== */

    function useAuthMetadata() {

        const metadata =
            state.user?.user_metadata || {};

        const fallback = {

            display_name:
                metadata.display_name ||
                "VibeConnect User",

            username:
                metadata.username ||
                "user",

            avatar_url:
                metadata.avatar_url ||
                ""
        };

        state.profile =
            fallback;

        renderProfile(
            fallback
        );
    }


    /* =====================================================
       RENDER PROFILE
       ===================================================== */

    function renderProfile(
        profile
    ) {

        const displayName =
            profile.display_name ||
            "VibeConnect User";

        const username =
            profile.username ||
            "user";

        el.userName.textContent =
            displayName;

        el.headerUsername.textContent =
            `@${username}`;

        el.profileStat.textContent =
            `@${username}`;


        if (
            profile.avatar_url
        ) {

            el.userAvatar.innerHTML = "";

            const image =
                document.createElement("img");

            image.src =
                profile.avatar_url;

            image.alt =
                displayName;

            image.onerror = () => {

                el.userAvatar.textContent =
                    getInitial(
                        displayName
                    );

            };

            el.userAvatar.appendChild(
                image
            );

        } else {

            el.userAvatar.textContent =
                getInitial(
                    displayName
                );
        }
    }


    /* =====================================================
       INITIAL
       ===================================================== */

    function getInitial(
        name
    ) {

        if (!name) {
            return "?";
        }

        return name
            .trim()
            .charAt(0)
            .toUpperCase();
    }


    /* =====================================================
       LOAD NOTIFICATIONS
       ===================================================== */

    async function loadNotificationCount() {

        if (
            !state.client ||
            !state.user
        ) {
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

        state.unreadNotifications =
            count || 0;

        renderNotificationCount();
    }


    /* =====================================================
       NOTIFICATION COUNT UI
       ===================================================== */

    function renderNotificationCount() {

        const count =
            state.unreadNotifications;

        const display =
            count > 99
                ? "99+"
                : String(count);

        el.notificationBadge.textContent =
            display;

        el.headerNotificationBadge.textContent =
            display;

        el.notificationStat.textContent =
            count;
    }


    /* =====================================================
       REAL-TIME NOTIFICATION LISTENER
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
                    `notifications-${state.user.id}`
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

                        state.unreadNotifications++;

                        renderNotificationCount();

                        showToast(
                            "🔔 New notification"
                        );

                    }
                )
                .subscribe();

        } catch (error) {

            console.warn(
                "Realtime notification subscription failed:",
                error
            );
        }
    }


    /* =====================================================
       AUTH STATE LISTENER
       ===================================================== */

    function subscribeToAuth() {

        if (
            !state.client?.auth
        ) {
            return;
        }

        state.client.auth.onAuthStateChange(
            async (
                event,
                session
            ) => {

                state.user =
                    session?.user || null;

                if (!state.user) {

                    setConnection(
                        false,
                        "You're not signed in",
                        "Sign in to VibeConnect to continue."
                    );

                    return;
                }

                await loadProfile();

                await loadNotificationCount();
            }
        );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    async function initialize() {

        state.client =
            getClient();

        if (!state.client) {

            setConnection(
                false,
                "Supabase unavailable",
                "Make sure supabase.js is configured correctly."
            );

            return;
        }

        const user =
            await loadUser();

        if (!user) {
            return;
        }

        await loadProfile();

        await loadNotificationCount();

        subscribeToNotifications();

        subscribeToAuth();
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.vibeConnectFinal = {

        getUser:
            () => state.user,

        getProfile:
            () => state.profile,

        getUnreadNotifications:
            () =>
                state.unreadNotifications,

        refresh:
            async () => {

                await loadUser();

                await loadProfile();

                await loadNotificationCount();
            }
    };


    /* =====================================================
       START
       ===================================================== */

    initialize();

})();
```

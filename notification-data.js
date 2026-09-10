```javascript
/* =========================================================
   VIBECONNECT — REAL NOTIFICATIONS
   STEP 28
   ========================================================= */

(() => {

    "use strict";

    /* =====================================================
       STATE
       ===================================================== */

    const state = {
        client: null,
        currentUser: null,
        notifications: [],
        activeFilter: "all"
    };

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const elements = {
        connectionStatus:
            document.getElementById("connectionStatus"),

        connectionMessage:
            document.getElementById("connectionMessage"),

        statusDot:
            document.getElementById("statusDot"),

        notificationsList:
            document.getElementById("notificationsList"),

        totalCount:
            document.getElementById("totalCount"),

        unreadCount:
            document.getElementById("unreadCount"),

        activityCount:
            document.getElementById("activityCount"),

        refreshBtn:
            document.getElementById("refreshBtn"),

        markAllBtn:
            document.getElementById("markAllBtn"),

        clearFilterBtn:
            document.getElementById("clearFilterBtn"),

        toast:
            document.getElementById("toast"),

        filters:
            [...document.querySelectorAll(".filter")]
    };

    /* =====================================================
       SUPABASE CLIENT
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

    /* =====================================================
       TOAST
       ===================================================== */

    let toastTimer;

    function showToast(message) {

        elements.toast.textContent = message;

        elements.toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            elements.toast.classList.remove("show");
        }, 2800);
    }

    /* =====================================================
       CONNECTION STATUS
       ===================================================== */

    function setConnectionStatus(
        connected,
        title,
        message
    ) {

        elements.connectionStatus.textContent = title;

        elements.connectionMessage.textContent = message;

        elements.statusDot.style.background =
            connected ? "#24a148" : "#e05252";

        elements.statusDot.style.boxShadow =
            connected
                ? "0 0 0 6px #e3f7e8"
                : "0 0 0 6px #fde8e8";
    }

    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    async function getCurrentUser() {

        if (!state.client) {
            return null;
        }

        const {
            data,
            error
        } = await state.client.auth.getUser();

        if (error) {
            console.error(
                "Authentication error:",
                error
            );

            return null;
        }

        return data?.user || null;
    }

    /* =====================================================
       LOAD NOTIFICATIONS
       ===================================================== */

    async function loadNotifications() {

        if (!state.client) {

            setConnectionStatus(
                false,
                "Supabase not connected",
                "Check your supabase.js configuration."
            );

            renderEmpty(
                "Connect Supabase first",
                "Your notification database is not connected yet."
            );

            return;
        }

        state.currentUser =
            await getCurrentUser();

        if (!state.currentUser) {

            setConnectionStatus(
                true,
                "Supabase connected",
                "Please sign in to view your notifications."
            );

            renderEmpty(
                "Login required",
                "Sign in to your VibeConnect account to see real notifications."
            );

            updateSummary([]);

            return;
        }

        setConnectionStatus(
            true,
            "Database connected",
            "Loading notifications for your account."
        );

        showLoading();

        const {
            data,
            error
        } = await state.client
            .from("notifications")
            .select(`
                id,
                user_id,
                type,
                title,
                message,
                post_id,
                actor_id,
                is_read,
                created_at
            `)
            .eq(
                "user_id",
                state.currentUser.id
            )
            .order(
                "created_at",
                { ascending: false }
            )
            .limit(100);

        if (error) {

            console.error(
                "Notification query error:",
                error
            );

            setConnectionStatus(
                false,
                "Notification query failed",
                error.message
            );

            renderEmpty(
                "Could not load notifications",
                error.message
            );

            return;
        }

        state.notifications =
            data || [];

        updateSummary(
            state.notifications
        );

        renderNotifications();

    }

    /* =====================================================
       SUMMARY
       ===================================================== */

    function updateSummary(list) {

        const unread =
            list.filter(
                notification =>
                    !notification.is_read
            ).length;

        const activity =
            list.filter(
                notification =>
                    [
                        "like",
                        "comment",
                        "follow"
                    ].includes(
                        notification.type
                    )
            ).length;

        elements.totalCount.textContent =
            list.length;

        elements.unreadCount.textContent =
            unread;

        elements.activityCount.textContent =
            activity;
    }

    /* =====================================================
       FILTERING
       ===================================================== */

    function getFilteredNotifications() {

        if (
            state.activeFilter === "all"
        ) {
            return state.notifications;
        }

        if (
            state.activeFilter === "unread"
        ) {
            return state.notifications.filter(
                notification =>
                    !notification.is_read
            );
        }

        return state.notifications.filter(
            notification =>
                notification.type ===
                state.activeFilter
        );
    }

    /* =====================================================
       RENDER
       ===================================================== */

    function renderNotifications() {

        const list =
            getFilteredNotifications();

        if (!list.length) {

            renderEmpty(
                state.activeFilter === "all"
                    ? "No notifications yet"
                    : "Nothing here",
                state.activeFilter === "all"
                    ? "Activity from your VibeConnect account will appear here."
                    : "There are no notifications matching this filter."
            );

            return;
        }

        elements.notificationsList.innerHTML = "";

        list.forEach(notification => {

            const item =
                createNotificationElement(
                    notification
                );

            elements.notificationsList.appendChild(
                item
            );

        });
    }

    /* =====================================================
       CREATE NOTIFICATION ELEMENT
       ===================================================== */

    function createNotificationElement(
        notification
    ) {

        const article =
            document.createElement("article");

        article.className =
            "notification" +
            (
                notification.is_read
                    ? ""
                    : " unread"
            );

        const icon =
            document.createElement("div");

        icon.className =
            "notification-icon";

        icon.textContent =
            getNotificationIcon(
                notification.type
            );

        const content =
            document.createElement("div");

        content.className =
            "notification-content";

        const title =
            document.createElement("div");

        title.className =
            "notification-title";

        title.textContent =
            notification.title ||
            getDefaultTitle(
                notification.type
            );

        const message =
            document.createElement("div");

        message.className =
            "notification-message";

        message.textContent =
            notification.message ||
            "";

        const time =
            document.createElement("div");

        time.className =
            "notification-time";

        time.textContent =
            formatTime(
                notification.created_at
            );

        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(time);

        article.appendChild(icon);
        article.appendChild(content);

        if (!notification.is_read) {

            const unreadDot =
                document.createElement("div");

            unreadDot.className =
                "unread-dot";

            article.appendChild(
                unreadDot
            );
        }

        article.addEventListener(
            "click",
            () => markNotificationRead(
                notification.id
            )
        );

        return article;
    }

    /* =====================================================
       ICONS
       ===================================================== */

    function getNotificationIcon(type) {

        const icons = {
            like: "❤️",
            comment: "💬",
            follow: "👤",
            mention: "🔔",
            system: "⚙️",
            message: "✉️"
        };

        return icons[type] || "🔔";
    }

    /* =====================================================
       DEFAULT TITLES
       ===================================================== */

    function getDefaultTitle(type) {

        const titles = {
            like: "Someone liked your post",
            comment: "Someone commented on your post",
            follow: "You have a new follower",
            mention: "You were mentioned",
            system: "VibeConnect update",
            message: "You have a new message"
        };

        return titles[type] ||
            "New VibeConnect notification";
    }

    /* =====================================================
       MARK ONE AS READ
       ===================================================== */

    async function markNotificationRead(
        notificationId
    ) {

        if (
            !state.client ||
            !state.currentUser
        ) {
            return;
        }

        const notification =
            state.notifications.find(
                item =>
                    item.id === notificationId
            );

        if (
            !notification ||
            notification.is_read
        ) {
            return;
        }

        const {
            error
        } = await state.client
            .from("notifications")
            .update({
                is_read: true
            })
            .eq(
                "id",
                notificationId
            )
            .eq(
                "user_id",
                state.currentUser.id
            );

        if (error) {

            console.error(
                "Mark read error:",
                error
            );

            showToast(
                "Could not mark notification as read."
            );

            return;
        }

        notification.is_read = true;

        updateSummary(
            state.notifications
        );

        renderNotifications();
    }

    /* =====================================================
       MARK ALL AS READ
       ===================================================== */

    async function markAllAsRead() {

        if (
            !state.client ||
            !state.currentUser
        ) {

            showToast(
                "Please sign in first."
            );

            return;
        }

        const unread =
            state.notifications.filter(
                notification =>
                    !notification.is_read
            );

        if (!unread.length) {

            showToast(
                "Everything is already read."
            );

            return;
        }

        const {
            error
        } = await state.client
            .from("notifications")
            .update({
                is_read: true
            })
            .eq(
                "user_id",
                state.currentUser.id
            )
            .eq(
                "is_read",
                false
            );

        if (error) {

            console.error(
                "Mark all read error:",
                error
            );

            showToast(
                "Could not update notifications."
            );

            return;
        }

        state.notifications.forEach(
            notification => {
                notification.is_read = true;
            }
        );

        updateSummary(
            state.notifications
        );

        renderNotifications();

        showToast(
            "All notifications marked as read."
        );
    }

    /* =====================================================
       EMPTY STATE
       ===================================================== */

    function renderEmpty(
        title,
        message
    ) {

        elements.notificationsList.innerHTML = "";

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "empty-state";

        const icon =
            document.createElement("div");

        icon.className =
            "empty-icon";

        icon.textContent = "🔔";

        const heading =
            document.createElement("h3");

        heading.textContent =
            title;

        const text =
            document.createElement("p");

        text.textContent =
            message;

        wrapper.appendChild(icon);
        wrapper.appendChild(heading);
        wrapper.appendChild(text);

        elements.notificationsList.appendChild(
            wrapper
        );
    }

    /* =====================================================
       LOADING
       ===================================================== */

    function showLoading() {

        elements.notificationsList.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading notifications...</p>
            </div>
        `;
    }

    /* =====================================================
       TIME FORMAT
       ===================================================== */

    function formatTime(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(dateString);

        const now =
            new Date();

        const seconds =
            Math.floor(
                (now - date) / 1000
            );

        if (seconds < 60) {
            return "Just now";
        }

        const minutes =
            Math.floor(
                seconds / 60
            );

        if (minutes < 60) {
            return `${minutes}m ago`;
        }

        const hours =
            Math.floor(
                minutes / 60
            );

        if (hours < 24) {
            return `${hours}h ago`;
        }

        const days =
            Math.floor(
                hours / 24
            );

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

    /* =====================================================
       FILTER EVENTS
       ===================================================== */

    elements.filters.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    elements.filters.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                    button.classList.add(
                        "active"
                    );

                    state.activeFilter =
                        button.dataset.filter;

                    renderNotifications();
                }
            );
        }
    );

    /* =====================================================
       CLEAR FILTER
       ===================================================== */

    elements.clearFilterBtn.addEventListener(
        "click",
        () => {

            state.activeFilter = "all";

            elements.filters.forEach(
                button =>
                    button.classList.remove(
                        "active"
                    )
            );

            const allButton =
                elements.filters.find(
                    button =>
                        button.dataset.filter ===
                        "all"
                );

            if (allButton) {
                allButton.classList.add(
                    "active"
                );
            }

            renderNotifications();
        }
    );

    /* =====================================================
       REFRESH
       ===================================================== */

    elements.refreshBtn.addEventListener(
        "click",
        async () => {

            elements.refreshBtn.disabled =
                true;

            await loadNotifications();

            elements.refreshBtn.disabled =
                false;

            showToast(
                "Notifications refreshed."
            );
        }
    );

    /* =====================================================
       MARK ALL BUTTON
       ===================================================== */

    elements.markAllBtn.addEventListener(
        "click",
        markAllAsRead
    );

    /* =====================================================
       INITIALIZE
       ===================================================== */

    async function initialize() {

        state.client =
            getSupabaseClient();

        if (!state.client) {

            setConnectionStatus(
                false,
                "Supabase unavailable",
                "The VibeConnect Supabase client could not be found."
            );

            renderEmpty(
                "Backend unavailable",
                "Make sure supabase.js is configured correctly."
            );

            return;
        }

        await loadNotifications();

        if (
            state.client.auth &&
            state.client.auth.onAuthStateChange
        ) {

            state.client.auth.onAuthStateChange(
                async () => {
                    await loadNotifications();
                }
            );
        }
    }

    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.vibeConnectNotificationsData = {

        refresh:
            loadNotifications,

        markAllRead:
            markAllAsRead,

        getNotifications:
            () => [
                ...state.notifications
            ],

        getUnreadCount:
            () =>
                state.notifications.filter(
                    notification =>
                        !notification.is_read
                ).length
    };

    initialize();

})();
```

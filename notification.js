/* =========================================================
   VIBECONNECT
   NOTIFICATIONS SYSTEM
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           ELEMENTS
        ================================================= */

        const notificationList =
            document.getElementById(
                "notificationList"
            );


        const emptyState =
            document.getElementById(
                "emptyState"
            );


        const unreadCount =
            document.getElementById(
                "unreadCount"
            );


        const markAllButton =
            document.getElementById(
                "markAllButton"
            );


        const filterButtons =
            document.querySelectorAll(
                ".filter-button"
            );


        const toast =
            document.getElementById(
                "toast"
            );


        /* =================================================
           STORAGE
        ================================================= */

        const STORAGE_KEY =
            "vibeConnectNotifications";


        /* =================================================
           DEFAULT NOTIFICATIONS
        ================================================= */

        const defaultNotifications = [

            {
                id: 1,

                type: "likes",

                icon: "❤️",

                avatar: "👨‍💻",

                user: "Alex",

                message:
                    "liked your recent post.",

                time:
                    "2 minutes ago",

                unread: true
            },


            {
                id: 2,

                type: "comments",

                icon: "💬",

                avatar: "👩‍🎨",

                user: "Maya",

                message:
                    "commented on your post.",

                time:
                    "18 minutes ago",

                unread: true
            },


            {
                id: 3,

                type: "follows",

                icon: "👤",

                avatar: "🧑‍💻",

                user: "Arjun",

                message:
                    "started following you.",

                time:
                    "1 hour ago",

                unread: true
            },


            {
                id: 4,

                type: "likes",

                icon: "❤️",

                avatar: "👨‍🎨",

                user: "Rohan",

                message:
                    "liked your photo.",

                time:
                    "3 hours ago",

                unread: false
            },


            {
                id: 5,

                type: "comments",

                icon: "💬",

                avatar: "👩‍💻",

                user: "Priya",

                message:
                    "commented on your video.",

                time:
                    "Yesterday",

                unread: false
            },


            {
                id: 6,

                type: "follows",

                icon: "👤",

                avatar: "🧑‍🎨",

                user: "Kabir",

                message:
                    "started following you.",

                time:
                    "Yesterday",

                unread: false
            },


            {
                id: 7,

                type: "system",

                icon: "⚙️",

                avatar: "✦",

                user: "VibeConnect",

                message:
                    "Your profile setup is ready.",

                time:
                    "2 days ago",

                unread: false
            }

        ];


        /* =================================================
           STATE
        ================================================= */

        let notifications = [];

        let currentFilter = "all";


        /* =================================================
           LOAD
        ================================================= */

        loadNotifications();


        /* =================================================
           FILTER BUTTONS
        ================================================= */

        filterButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        filterButtons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        currentFilter =
                            button.dataset.filter;


                        renderNotifications();

                    }
                );

            }
        );


        /* =================================================
           MARK ALL AS READ
        ================================================= */

        markAllButton.addEventListener(
            "click",
            () => {

                let changed = false;


                notifications.forEach(
                    notification => {

                        if (
                            notification.unread
                        ) {

                            notification.unread =
                                false;

                            changed = true;

                        }

                    }
                );


                if (changed) {

                    saveNotifications();

                    renderNotifications();

                    showToast(
                        "All notifications marked as read ✓"
                    );

                } else {

                    showToast(
                        "You're already all caught up!"
                    );

                }

            }
        );


        /* =================================================
           LOAD NOTIFICATIONS
        ================================================= */

        function loadNotifications() {

            try {

                const saved =
                    localStorage.getItem(
                        STORAGE_KEY
                    );


                if (saved) {

                    notifications =
                        JSON.parse(saved);

                } else {

                    notifications =
                        defaultNotifications;

                    saveNotifications();

                }

            } catch (error) {

                console.error(
                    "Could not load notifications:",
                    error
                );

                notifications =
                    defaultNotifications;

            }


            renderNotifications();

        }


        /* =================================================
           SAVE NOTIFICATIONS
        ================================================= */

        function saveNotifications() {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        notifications
                    )
                );

            } catch (error) {

                console.error(
                    "Could not save notifications:",
                    error
                );

            }

        }


        /* =================================================
           RENDER
        ================================================= */

        function renderNotifications() {

            notificationList.innerHTML = "";


            const filtered =
                currentFilter === "all"
                    ? notifications
                    : notifications.filter(
                        notification =>
                            notification.type ===
                            currentFilter
                    );


            updateUnreadCount();


            if (
                filtered.length === 0
            ) {

                emptyState.hidden = false;

                return;

            }


            emptyState.hidden = true;


            filtered.forEach(
                notification => {

                    const element =
                        createNotificationElement(
                            notification
                        );


                    notificationList.appendChild(
                        element
                    );

                }
            );

        }


        /* =================================================
           CREATE NOTIFICATION
        ================================================= */

        function createNotificationElement(
            notification
        ) {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                `notification-item ${
                    notification.unread
                        ? "unread"
                        : ""
                }`;


            item.dataset.id =
                notification.id;


            item.innerHTML = `

                ${
                    notification.unread
                        ? `
                            <span
                                class="unread-dot"
                            ></span>
                        `
                        : ""
                }


                <div
                    class="notification-avatar"
                >
                    ${escapeHTML(
                        notification.avatar
                    )}
                </div>


                <div
                    class="notification-content"
                >

                    <p
                        class="notification-message"
                    >

                        <strong>
                            ${escapeHTML(
                                notification.user
                            )}
                        </strong>

                        ${escapeHTML(
                            notification.message
                        )}

                    </p>


                    <span
                        class="notification-time"
                    >
                        ${escapeHTML(
                            notification.time
                        )}
                    </span>

                </div>


                <div
                    class="
                        notification-type
                        ${escapeHTML(
                            notification.type
                        )}
                    "
                >
                    ${escapeHTML(
                        notification.icon
                    )}
                </div>

            `;


            item.addEventListener(
                "click",
                () => {

                    markNotificationRead(
                        notification.id
                    );

                }
            );


            return item;

        }


        /* =================================================
           MARK ONE AS READ
        ================================================= */

        function markNotificationRead(
            id
        ) {

            const notification =
                notifications.find(
                    item =>
                        item.id === id
                );


            if (
                !notification ||
                !notification.unread
            ) {

                return;

            }


            notification.unread =
                false;


            saveNotifications();

            renderNotifications();


            showToast(
                "Notification marked as read"
            );

        }


        /* =================================================
           UNREAD COUNT
        ================================================= */

        function updateUnreadCount() {

            const count =
                notifications.filter(
                    notification =>
                        notification.unread
                ).length;


            unreadCount.textContent =
                `${count} ${
                    count === 1
                        ? "unread"
                        : "unread"
                }`;


            if (count === 0) {

                unreadCount.textContent =
                    "All caught up";

            }

        }


        /* =================================================
           ADD NOTIFICATION
           Future features can use this function.
        ================================================= */

        window.addVibeNotification =
            function (
                type,
                user,
                message,
                avatar = "✦"
            ) {

                const icons = {

                    likes: "❤️",

                    comments: "💬",

                    follows: "👤",

                    system: "⚙️"

                };


                const newNotification = {

                    id:
                        Date.now(),

                    type:
                        type,

                    icon:
                        icons[type] || "🔔",

                    avatar:
                        avatar,

                    user:
                        user,

                    message:
                        message,

                    time:
                        "Just now",

                    unread:
                        true

                };


                notifications.unshift(
                    newNotification
                );


                saveNotifications();

                renderNotifications();

                showToast(
                    "New notification 🔔"
                );

            };


        /* =================================================
           TOAST
        ================================================= */

        function showToast(
            message
        ) {

            toast.textContent =
                message;


            toast.classList.add(
                "show"
            );


            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2400
            );

        }


        /* =================================================
           ESCAPE HTML
        ================================================= */

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

    }
);

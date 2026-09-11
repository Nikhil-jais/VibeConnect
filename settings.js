/* ========================================================
   SETTINGS & PRIVACY
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const SETTINGS_STORAGE = {
    privateAccount: "vibeConnectPrivateAccount",
    allowComments: "vibeConnectAllowComments",
    messageRequests: "vibeConnectMessageRequests",
    activityStatus: "vibeConnectActivityStatus",

    likeNotifications: "vibeConnectLikeNotifications",
    commentNotifications: "vibeConnectCommentNotifications",
    followNotifications: "vibeConnectFollowNotifications",
    systemNotifications: "vibeConnectSystemNotifications",

    theme: "vibeConnectTheme"
};


/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const defaults = {

    privateAccount: false,

    allowComments: true,

    messageRequests: true,

    activityStatus: true,

    likeNotifications: true,

    commentNotifications: true,

    followNotifications: true,

    systemNotifications: true,

    theme: "light"

};


/* =========================================================
   DOM
   ========================================================= */

const controls = {

    privateAccount:
        document.getElementById("privateAccount"),

    allowComments:
        document.getElementById("allowComments"),

    messageRequests:
        document.getElementById("messageRequests"),

    activityStatus:
        document.getElementById("activityStatus"),

    likeNotifications:
        document.getElementById("likeNotifications"),

    commentNotifications:
        document.getElementById("commentNotifications"),

    followNotifications:
        document.getElementById("followNotifications"),

    systemNotifications:
        document.getElementById("systemNotifications")

};


const toast =
    document.getElementById("settingsToast");


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function getSetting(key, fallback) {

    const stored =
        localStorage.getItem(key);


    if (stored === null) {

        return fallback;
    }


    if (
        stored === "true" ||
        stored === "false"
    ) {

        return stored === "true";
    }


    return stored;
}


function setSetting(key, value) {

    localStorage.setItem(
        key,
        String(value)
    );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timeout
    );

    showToast.timeout =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);
}


/* =========================================================
   LOAD SETTINGS
   ========================================================= */

function loadSettings() {

    controls.privateAccount.checked =
        getSetting(
            SETTINGS_STORAGE.privateAccount,
            defaults.privateAccount
        );

    controls.allowComments.checked =
        getSetting(
            SETTINGS_STORAGE.allowComments,
            defaults.allowComments
        );

    controls.messageRequests.checked =
        getSetting(
            SETTINGS_STORAGE.messageRequests,
            defaults.messageRequests
        );

    controls.activityStatus.checked =
        getSetting(
            SETTINGS_STORAGE.activityStatus,
            defaults.activityStatus
        );


    controls.likeNotifications.checked =
        getSetting(
            SETTINGS_STORAGE.likeNotifications,
            defaults.likeNotifications
        );

    controls.commentNotifications.checked =
        getSetting(
            SETTINGS_STORAGE.commentNotifications,
            defaults.commentNotifications
        );

    controls.followNotifications.checked =
        getSetting(
            SETTINGS_STORAGE.followNotifications,
            defaults.followNotifications
        );

    controls.systemNotifications.checked =
        getSetting(
            SETTINGS_STORAGE.systemNotifications,
            defaults.systemNotifications
        );


    const theme =
        getSetting(
            SETTINGS_STORAGE.theme,
            defaults.theme
        );

    applyTheme(theme);
}


/* =========================================================
   SAVE TOGGLE
   ========================================================= */

function connectToggle(element, storageKey, label) {

    element.addEventListener(
        "change",
        () => {

            setSetting(
                storageKey,
                element.checked
            );

            showToast(
                `${label} ${
                    element.checked
                        ? "enabled"
                        : "disabled"
                }`
            );
        }
    );
}


/* =========================================================
   CONNECT SETTINGS
   ========================================================= */

connectToggle(
    controls.privateAccount,
    SETTINGS_STORAGE.privateAccount,
    "Private account"
);


connectToggle(
    controls.allowComments,
    SETTINGS_STORAGE.allowComments,
    "Comments"
);


connectToggle(
    controls.messageRequests,
    SETTINGS_STORAGE.messageRequests,
    "Message requests"
);


connectToggle(
    controls.activityStatus,
    SETTINGS_STORAGE.activityStatus,
    "Activity status"
);


connectToggle(
    controls.likeNotifications,
    SETTINGS_STORAGE.likeNotifications,
    "Like notifications"
);


connectToggle(
    controls.commentNotifications,
    SETTINGS_STORAGE.commentNotifications,
    "Comment notifications"
);


connectToggle(
    controls.followNotifications,
    SETTINGS_STORAGE.followNotifications,
    "Follower notifications"
);


connectToggle(
    controls.systemNotifications,
    SETTINGS_STORAGE.systemNotifications,
    "VibeConnect updates"
);


/* =========================================================
   THEME
   ========================================================= */

const themeCards =
    document.querySelectorAll(
        ".theme-card"
    );


function applyTheme(theme) {

    document.body.classList.remove(
        "dark-mode"
    );


    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );
    }


    if (theme === "system") {

        if (
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {

            document.body.classList.add(
                "dark-mode"
            );
        }
    }


    themeCards.forEach(card => {

        card.classList.toggle(
            "active",
            card.dataset.theme === theme
        );

    });


    setSetting(
        SETTINGS_STORAGE.theme,
        theme
    );
}


themeCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const theme =
                card.dataset.theme;

            applyTheme(theme);

            showToast(
                `Theme changed to ${theme}`
            );
        }
    );

});


/* =========================================================
   ACTION BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-action]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                switch (action) {

                    case "username":

                        showToast(
                            "Username editing will connect to your account backend later."
                        );

                        break;


                    case "email":

                        showToast(
                            "Email management will connect to authentication later."
                        );

                        break;


                    case "password":

                        showToast(
                            "Password management will connect to authentication later."
                        );

                        break;


                    case "sessions":

                        showToast(
                            "Login activity will be available after authentication is connected."
                        );

                        break;


                    case "twofactor":

                        showToast(
                            "Two-factor authentication will be added with the secure backend."
                        );

                        break;


                    case "download":

                        downloadUserData();

                        break;


                    case "clear":

                        clearLocalData();

                        break;
                }

            }
        );

    });


/* =========================================================
   DOWNLOAD LOCAL DATA
   ========================================================= */

function downloadUserData() {

    const data = {

        app: "VibeConnect",

        exportedAt:
            new Date().toISOString(),

        settings: {

            privateAccount:
                controls.privateAccount.checked,

            allowComments:
                controls.allowComments.checked,

            messageRequests:
                controls.messageRequests.checked,

            activityStatus:
                controls.activityStatus.checked,

            likeNotifications:
                controls.likeNotifications.checked,

            commentNotifications:
                controls.commentNotifications.checked,

            followNotifications:
                controls.followNotifications.checked,

            systemNotifications:
                controls.systemNotifications.checked,

            theme:
                getSetting(
                    SETTINGS_STORAGE.theme,
                    defaults.theme
                )
        }

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "vibeconnect-data.json";


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);


    showToast(
        "Your data export is ready 📥"
    );
}


/* =========================================================
   CLEAR LOCAL DATA
   ========================================================= */

function clearLocalData() {

    const confirmed =
        window.confirm(
            "Clear VibeConnect settings stored in this browser?"
        );


    if (!confirmed) {

        return;
    }


    Object.values(
        SETTINGS_STORAGE
    ).forEach(key => {

        localStorage.removeItem(key);

    });


    showToast(
        "Local settings cleared"
    );


    setTimeout(() => {

        location.reload();

    }, 800);
}


/* =========================================================
   SYSTEM THEME LISTENER
   ========================================================= */

const systemTheme =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );


systemTheme.addEventListener(
    "change",
    () => {

        const currentTheme =
            getSetting(
                SETTINGS_STORAGE.theme,
                defaults.theme
            );


        if (currentTheme === "system") {

            applyTheme("system");
        }

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

loadSettings();


/* =========================================================
   PUBLIC API
   ========================================================= */

window.vibeConnectSettings = {

    get(key) {

        return getSetting(
            SETTINGS_STORAGE[key],
            defaults[key]
        );

    },

    set(key, value) {

        if (
            !SETTINGS_STORAGE[key]
        ) {

            return false;
        }

        setSetting(
            SETTINGS_STORAGE[key],
            value
        );

        return true;
    },

    reset() {

        Object.values(
            SETTINGS_STORAGE
        ).forEach(key => {

            localStorage.removeItem(key);

        });

        loadSettings();

        showToast(
            "Settings restored to default"
        );
    }

};

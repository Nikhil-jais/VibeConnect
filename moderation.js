/* =========================================================
   VIBECONNECT — STEP 17
   BLOCK • MUTE • REPORT
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const MODERATION_STORAGE = {

    blocked:
        "vibeConnectBlockedUsers",

    muted:
        "vibeConnectMutedUsers",

    reports:
        "vibeConnectReports"

};


/* =========================================================
   DEMO DATA
   ========================================================= */

const demoUsers = [

    {
        username: "alexmorgan",
        name: "Alex Morgan",
        avatar: "A"
    },

    {
        username: "mayasharma",
        name: "Maya Sharma",
        avatar: "M"
    },

    {
        username: "arjunsingh",
        name: "Arjun Singh",
        avatar: "A"
    },

    {
        username: "priyaverma",
        name: "Priya Verma",
        avatar: "P"
    },

    {
        username: "rohankapoor",
        name: "Rohan Kapoor",
        avatar: "R"
    }

];


/* =========================================================
   STATE
   ========================================================= */

let blockedUsers =
    loadData(
        MODERATION_STORAGE.blocked
    );

let mutedUsers =
    loadData(
        MODERATION_STORAGE.muted
    );

let reports =
    loadData(
        MODERATION_STORAGE.reports
    );


let currentAction = null;

let selectedReason = null;


/* =========================================================
   DOM
   ========================================================= */

const blockedList =
    document.getElementById(
        "blockedList"
    );

const mutedList =
    document.getElementById(
        "mutedList"
    );

const reportList =
    document.getElementById(
        "reportList"
    );

const blockedCount =
    document.getElementById(
        "blockedCount"
    );

const mutedCount =
    document.getElementById(
        "mutedCount"
    );

const reportCount =
    document.getElementById(
        "reportCount"
    );


const modal =
    document.getElementById(
        "actionModal"
    );

const modalIcon =
    document.getElementById(
        "modalIcon"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalDescription =
    document.getElementById(
        "modalDescription"
    );

const modalInput =
    document.getElementById(
        "modalInput"
    );

const reportReasonArea =
    document.getElementById(
        "reportReasonArea"
    );

const toast =
    document.getElementById(
        "moderationToast"
    );


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function loadData(key) {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(key)
            );

        return Array.isArray(data)
            ? data
            : [];

    } catch {

        return [];
    }
}


function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);
}


/* =========================================================
   FIND USER
   ========================================================= */

function findUser(username) {

    const clean =
        username
            .trim()
            .replace(/^@/, "")
            .toLowerCase();


    return demoUsers.find(
        user =>
            user.username.toLowerCase() ===
            clean
    );
}


/* =========================================================
   RENDER BLOCKED
   ========================================================= */

function renderBlocked() {

    blockedCount.textContent =
        blockedUsers.length;


    if (!blockedUsers.length) {

        blockedList.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    🛡️
                </div>

                <h3>
                    No blocked accounts
                </h3>

                <p>
                    Accounts you block will appear here.
                </p>

            </div>
        `;

        return;
    }


    blockedList.innerHTML =
        blockedUsers
            .map(user => {

                return `
                    <div class="person-row">

                        <div class="person-avatar">
                            ${escapeHTML(
                                user.avatar
                            )}
                        </div>

                        <div class="person-info">

                            <strong>
                                ${escapeHTML(
                                    user.name
                                )}
                            </strong>

                            <span>
                                @${escapeHTML(
                                    user.username
                                )}
                            </span>

                        </div>

                        <button
                            class="restore-btn"
                            data-unblock="${
                                escapeHTML(
                                    user.username
                                )
                            }">

                            Unblock

                        </button>

                    </div>
                `;

            })
            .join("");


    blockedList
        .querySelectorAll(
            "[data-unblock]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    unblockUser(
                        button.dataset.unblock
                    );

                }
            );

        });
}


/* =========================================================
   RENDER MUTED
   ========================================================= */

function renderMuted() {

    mutedCount.textContent =
        mutedUsers.length;


    if (!mutedUsers.length) {

        mutedList.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    🔈
                </div>

                <h3>
                    No muted accounts
                </h3>

                <p>
                    Accounts you mute will appear here.
                </p>

            </div>
        `;

        return;
    }


    mutedList.innerHTML =
        mutedUsers
            .map(user => {

                return `
                    <div class="person-row">

                        <div class="person-avatar">
                            ${escapeHTML(
                                user.avatar
                            )}
                        </div>

                        <div class="person-info">

                            <strong>
                                ${escapeHTML(
                                    user.name
                                )}
                            </strong>

                            <span>
                                @${escapeHTML(
                                    user.username
                                )}
                            </span>

                        </div>

                        <button
                            class="restore-btn"
                            data-unmute="${
                                escapeHTML(
                                    user.username
                                )
                            }">

                            Unmute

                        </button>

                    </div>
                `;

            })
            .join("");


    mutedList
        .querySelectorAll(
            "[data-unmute]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    unmuteUser(
                        button.dataset.unmute
                    );

                }
            );

        });
}


/* =========================================================
   RENDER REPORTS
   ========================================================= */

function renderReports() {

    reportCount.textContent =
        reports.length;


    if (!reports.length) {

        reportList.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    📋
                </div>

                <h3>
                    No reports yet
                </h3>

                <p>
                    Your submitted reports will appear here.
                </p>

            </div>
        `;

        return;
    }


    reportList.innerHTML =
        reports
            .slice()
            .reverse()
            .map(report => {

                return `
                    <div class="report-row">

                        <div class="report-icon">
                            ⚠️
                        </div>

                        <div class="report-info">

                            <strong>
                                @${escapeHTML(
                                    report.username
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    report.reason
                                )}
                                ·
                                ${escapeHTML(
                                    report.date
                                )}
                            </span>

                        </div>

                        <span class="report-status">
                            RECEIVED
                        </span>

                    </div>
                `;

            })
            .join("");
}


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderAll() {

    renderBlocked();

    renderMuted();

    renderReports();

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openAction(action) {

    currentAction =
        action;

    selectedReason =
        null;


    reportReasonArea
        .classList.add(
            "hidden"
        );


    modalInput.value = "";


    if (action === "block") {

        modalIcon.textContent =
            "🚫";

        modalTitle.textContent =
            "Block Someone";

        modalDescription.textContent =
            "Enter the username of the account you want to block.";

        modalInput.placeholder =
            "@username";

        modalInput.classList.remove(
            "hidden"
        );

    }


    if (action === "mute") {

        modalIcon.textContent =
            "🔇";

        modalTitle.textContent =
            "Mute Someone";

        modalDescription.textContent =
            "Enter the username of the account whose posts you want to hide.";

        modalInput.placeholder =
            "@username";

        modalInput.classList.remove(
            "hidden"
        );

    }


    if (action === "report") {

        modalIcon.textContent =
            "⚠️";

        modalTitle.textContent =
            "Report Content";

        modalDescription.textContent =
            "Enter the username connected to the content you want to report.";

        modalInput.placeholder =
            "@username";

        reportReasonArea
            .classList.remove(
                "hidden"
            );

    }


    modal.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        modalInput.focus();

    }, 100);
}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    modal.classList.add(
        "hidden"
    );

    currentAction =
        null;

    selectedReason =
        null;
}


/* =========================================================
   BLOCK
   ========================================================= */

function blockUser() {

    const user =
        findUser(
            modalInput.value
        );


    if (!user) {

        showToast(
            "Demo user not found. Try @alexmorgan."
        );

        return;
    }


    if (
        blockedUsers.some(
            item =>
                item.username ===
                user.username
        )
    ) {

        showToast(
            "This account is already blocked."
        );

        return;
    }


    blockedUsers.push(user);


    saveData(
        MODERATION_STORAGE.blocked,
        blockedUsers
    );


    renderBlocked();

    closeModal();

    showToast(
        `@${user.username} has been blocked.`
    );
}


/* =========================================================
   MUTE
   ========================================================= */

function muteUser() {

    const user =
        findUser(
            modalInput.value
        );


    if (!user) {

        showToast(
            "Demo user not found. Try @mayasharma."
        );

        return;
    }


    if (
        mutedUsers.some(
            item =>
                item.username ===
                user.username
        )
    ) {

        showToast(
            "This account is already muted."
        );

        return;
    }


    mutedUsers.push(user);


    saveData(
        MODERATION_STORAGE.muted,
        mutedUsers
    );


    renderMuted();

    closeModal();

    showToast(
        `@${user.username} has been muted.`
    );
}


/* =========================================================
   REPORT
   ========================================================= */

function reportContent() {

    const username =
        modalInput.value
            .trim()
            .replace(/^@/, "")
            .toLowerCase();


    if (!username) {

        showToast(
            "Enter a username first."
        );

        return;
    }


    if (!selectedReason) {

        showToast(
            "Please select a report reason."
        );

        return;
    }


    const report = {

        id:
            Date.now().toString(),

        username,

        reason:
            selectedReason,

        date:
            new Date()
                .toLocaleDateString(
                    "en-IN"
                )

    };


    reports.push(report);


    saveData(
        MODERATION_STORAGE.reports,
        reports
    );


    renderReports();

    closeModal();

    showToast(
        "Report received. Thank you."
    );
}


/* =========================================================
   CONFIRM ACTION
   ========================================================= */

document
    .getElementById(
        "confirmAction"
    )
    .addEventListener(
        "click",
        () => {

            if (
                currentAction ===
                "block"
            ) {

                blockUser();

                return;
            }


            if (
                currentAction ===
                "mute"
            ) {

                muteUser();

                return;
            }


            if (
                currentAction ===
                "report"
            ) {

                reportContent();

            }

        }
    );


/* =========================================================
   UNBLOCK
   ========================================================= */

function unblockUser(username) {

    blockedUsers =
        blockedUsers.filter(
            user =>
                user.username !==
                username
        );


    saveData(
        MODERATION_STORAGE.blocked,
        blockedUsers
    );


    renderBlocked();

    showToast(
        `@${username} has been unblocked.`
    );
}


/* =========================================================
   UNMUTE
   ========================================================= */

function unmuteUser(username) {

    mutedUsers =
        mutedUsers.filter(
            user =>
                user.username !==
                username
        );


    saveData(
        MODERATION_STORAGE.muted,
        mutedUsers
    );


    renderMuted();

    showToast(
        `@${username} has been unmuted.`
    );
}


/* =========================================================
   QUICK ACTION EVENTS
   ========================================================= */

document
    .querySelectorAll(
        ".quick-card"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openAction(
                    button.dataset.action
                );

            }
        );

    });


/* =========================================================
   REPORT REASONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-reason]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        "[data-reason]"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "selected"
                        );

                    });


                button.classList.add(
                    "selected"
                );


                selectedReason =
                    button.dataset.reason;

            }
        );

    });


/* =========================================================
   CLOSE EVENTS
   ========================================================= */

document
    .getElementById(
        "closeModal"
    )
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById(
        "cancelAction"
    )
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modal
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

renderAll();


/* =========================================================
   PUBLIC API
   ========================================================= */

window.vibeConnectModeration = {

    getBlocked() {

        return [
            ...blockedUsers
        ];

    },

    getMuted() {

        return [
            ...mutedUsers
        ];

    },

    getReports() {

        return [
            ...reports
        ];

    },

    block(username) {

        const user =
            findUser(username);

        if (!user) {
            return false;
        }

        if (
            blockedUsers.some(
                item =>
                    item.username ===
                    user.username
            )
        ) {
            return false;
        }

        blockedUsers.push(user);

        saveData(
            MODERATION_STORAGE.blocked,
            blockedUsers
        );

        renderBlocked();

        return true;
    },

    mute(username) {

        const user =
            findUser(username);

        if (!user) {
            return false;
        }

        if (
            mutedUsers.some(
                item =>
                    item.username ===
                    user.username
            )
        ) {
            return false;
        }

        mutedUsers.push(user);

        saveData(
            MODERATION_STORAGE.muted,
            mutedUsers
        );

        renderMuted();

        return true;
    }

};

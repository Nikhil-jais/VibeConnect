```javascript
/* =========================================================
   VIBECONNECT — REAL MESSAGING
   STEP 26
   ========================================================= */

"use strict";


/* =========================================================
   STATE
   ========================================================= */

const state = {

    client: null,

    currentUser: null,

    profiles: [],

    messages: [],

    selectedUser: null,

    search: ""

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

    messagesApp:
        document.getElementById(
            "messagesApp"
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

    conversationList:
        document.getElementById(
            "conversationList"
        ),

    conversationCount:
        document.getElementById(
            "conversationCount"
        ),

    userSearch:
        document.getElementById(
            "userSearch"
        ),

    chatEmpty:
        document.getElementById(
            "chatEmpty"
        ),

    activeChat:
        document.getElementById(
            "activeChat"
        ),

    chatAvatar:
        document.getElementById(
            "chatAvatar"
        ),

    chatName:
        document.getElementById(
            "chatName"
        ),

    chatUsername:
        document.getElementById(
            "chatUsername"
        ),

    closeChat:
        document.getElementById(
            "closeChat"
        ),

    messagesList:
        document.getElementById(
            "messagesList"
        ),

    messageForm:
        document.getElementById(
            "messageForm"
        ),

    messageInput:
        document.getElementById(
            "messageInput"
        ),

    sendButton:
        document.getElementById(
            "sendButton"
        ),

    characterCount:
        document.getElementById(
            "characterCount"
        ),

    toast:
        document.getElementById(
            "toast"
        )

};


/* =========================================================
   SUPABASE
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


function initials(
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


function formatTime(timestamp) {

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
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


function showToast(message) {

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
            2500
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

        return;
    }

    setConnection(
        "Connected to Supabase",
        true
    );

    await checkAuthentication();
}


/* =========================================================
   AUTH
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

        if (
            !state.currentUser
        ) {

            showLoginState();

            return;
        }

        showMainState();

        await loadProfiles();

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

    elements.messagesApp.classList.add(
        "hidden"
    );
}


function showMainState() {

    elements.loginCard.classList.add(
        "hidden"
    );

    elements.messagesApp.classList.remove(
        "hidden"
    );
}


/* =========================================================
   LOAD PROFILES
   ========================================================= */

async function loadProfiles() {

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
                avatar_url
            `)
            .neq(
                "id",
                state.currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {
        throw error;
    }

    state.profiles =
        Array.isArray(data)
            ? data
            : [];

    await loadConversationUsers();

}


/* =========================================================
   FIND USERS WHO HAVE MESSAGED
   ========================================================= */

async function loadConversationUsers() {

    const {
        data,
        error
    } =
        await state.client
            .from("messages")
            .select(`
                sender_id,
                receiver_id
            `)
            .or(
                `sender_id.eq.${state.currentUser.id},receiver_id.eq.${state.currentUser.id}`
            );

    if (error) {

        console.error(
            "Conversation lookup error:",
            error
        );

        renderConversationList(
            state.profiles
        );

        return;
    }


    const ids =
        new Set();

    (data || []).forEach(
        row => {

            if (
                row.sender_id !==
                state.currentUser.id
            ) {

                ids.add(
                    row.sender_id
                );
            }

            if (
                row.receiver_id !==
                state.currentUser.id
            ) {

                ids.add(
                    row.receiver_id
                );
            }

        }
    );


    /*
     * Put people who have already
     * messaged first.
     */

    const conversationProfiles =
        state.profiles
            .filter(
                profile =>
                    ids.has(profile.id)
            );

    const otherProfiles =
        state.profiles
            .filter(
                profile =>
                    !ids.has(profile.id)
            );


    state.profiles =
        [
            ...conversationProfiles,
            ...otherProfiles
        ];


    renderConversationList(
        state.profiles
    );
}


/* =========================================================
   CONVERSATION LIST
   ========================================================= */

function getVisibleProfiles() {

    const query =
        state.search
            .trim()
            .toLowerCase();

    if (!query) {

        return state.profiles;
    }

    return state.profiles.filter(
        profile => {

            const name =
                String(
                    profile.display_name ||
                    ""
                ).toLowerCase();

            const username =
                String(
                    profile.username ||
                    ""
                ).toLowerCase();

            return (
                name.includes(query) ||
                username.includes(query)
            );
        }
    );
}


function renderConversationList(
    profiles
) {

    elements.conversationList.innerHTML =
        "";

    const visibleProfiles =
        profiles.filter(
            profile => {

                const query =
                    state.search
                        .trim()
                        .toLowerCase();

                if (!query) {
                    return true;
                }

                return (
                    String(
                        profile.display_name ||
                        ""
                    )
                    .toLowerCase()
                    .includes(query)
                    ||
                    String(
                        profile.username ||
                        ""
                    )
                    .toLowerCase()
                    .includes(query)
                );
            }
        );


    elements.conversationCount.textContent =
        visibleProfiles.length;


    if (!visibleProfiles.length) {

        elements.conversationList.innerHTML =
            `
                <div class="empty-state">
                    <div class="empty-icon">
                        👥
                    </div>

                    <p>
                        No people found.
                    </p>
                </div>
            `;

        return;
    }


    visibleProfiles.forEach(
        profile => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "conversation-item";


            if (
                state.selectedUser?.id ===
                profile.id
            ) {

                button.classList.add(
                    "active"
                );
            }


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


            button.innerHTML =
                `
                    <div class="avatar">
                        ${avatar}
                    </div>

                    <div class="conversation-info">

                        <span class="conversation-name">
                            ${escapeHTML(name)}
                        </span>

                        <span class="conversation-username">
                            ${escapeHTML(username)}
                        </span>

                    </div>
                `;


            button.addEventListener(
                "click",
                () => {

                    openChat(
                        profile
                    );

                }
            );


            elements.conversationList
                .appendChild(
                    button
                );

        }
    );
}


/* =========================================================
   OPEN CHAT
   ========================================================= */

async function openChat(
    profile
) {

    state.selectedUser =
        profile;


    elements.chatEmpty.classList.add(
        "hidden"
    );

    elements.activeChat.classList.remove(
        "hidden"
    );


    renderChatHeader(
        profile
    );


    renderConversationList(
        state.profiles
    );


    await loadMessages();


    elements.messageInput.focus();
}


/* =========================================================
   CHAT HEADER
   ========================================================= */

function renderChatHeader(
    profile
) {

    const name =
        profile.display_name ||
        profile.username ||
        "VibeConnect User";

    const username =
        profile.username
            ? `@${profile.username}`
            : "@user";


    elements.chatName.textContent =
        name;

    elements.chatUsername.textContent =
        username;


    if (
        profile.avatar_url
    ) {

        elements.chatAvatar.innerHTML =
            `
                <img
                    src="${escapeHTML(
                        profile.avatar_url
                    )}"
                    alt="${escapeHTML(
                        name
                    )}"
                >
            `;

    } else {

        elements.chatAvatar.textContent =
            initials(
                name,
                profile.username
            );
    }
}


/* =========================================================
   LOAD MESSAGES
   ========================================================= */

async function loadMessages() {

    if (
        !state.selectedUser
    ) {
        return;
    }


    elements.messagesList.innerHTML =
        `
            <div class="loading-state">

                <div class="spinner"></div>

                <p>
                    Loading messages...
                </p>

            </div>
        `;


    const myId =
        state.currentUser.id;

    const otherId =
        state.selectedUser.id;


    const {
        data,
        error
    } =
        await state.client
            .from("messages")
            .select(`
                id,
                sender_id,
                receiver_id,
                content,
                created_at
            `)
            .or(
                `and(sender_id.eq.${myId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${myId})`
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Message loading error:",
            error
        );

        showMessageError(
            error.message
        );

        return;
    }


    state.messages =
        Array.isArray(data)
            ? data
            : [];


    renderMessages();
}


/* =========================================================
   RENDER MESSAGES
   ========================================================= */

function renderMessages() {

    elements.messagesList.innerHTML =
        "";


    if (
        !state.messages.length
    ) {

        elements.messagesList.innerHTML =
            `
                <div class="empty-state">

                    <div class="empty-icon">
                        👋
                    </div>

                    <p>
                        No messages yet.
                        Say hello!
                    </p>

                </div>
            `;

        return;
    }


    state.messages.forEach(
        message => {

            const mine =
                message.sender_id ===
                state.currentUser.id;


            const row =
                document.createElement(
                    "div"
                );

            row.className =
                `message-row ${
                    mine
                        ? "mine"
                        : "theirs"
                }`;


            const bubble =
                document.createElement(
                    "div"
                );

            bubble.className =
                "message-bubble";


            const content =
                document.createElement(
                    "div"
                );

            /*
             * textContent prevents
             * HTML injection.
             */

            content.textContent =
                message.content || "";


            const time =
                document.createElement(
                    "span"
                );

            time.className =
                "message-time";

            time.textContent =
                formatTime(
                    message.created_at
                );


            bubble.appendChild(
                content
            );

            bubble.appendChild(
                time
            );


            if (mine) {

                const deleteButton =
                    document.createElement(
                        "button"
                    );

                deleteButton.type =
                    "button";

                deleteButton.className =
                    "message-delete";

                deleteButton.textContent =
                    "Delete";

                deleteButton.addEventListener(
                    "click",
                    () =>
                        deleteMessage(
                            message.id
                        )
                );

                bubble.appendChild(
                    deleteButton
                );
            }


            row.appendChild(
                bubble
            );

            elements.messagesList
                .appendChild(
                    row
                );

        }
    );


    requestAnimationFrame(
        () => {

            elements.messagesList.scrollTop =
                elements.messagesList.scrollHeight;

        }
    );
}


/* =========================================================
   SEND MESSAGE
   ========================================================= */

async function sendMessage(
    event
) {

    event.preventDefault();


    if (
        !state.currentUser ||
        !state.selectedUser
    ) {

        return;
    }


    const content =
        elements.messageInput.value
            .trim();


    if (!content) {

        showToast(
            "Write a message first."
        );

        return;
    }


    elements.sendButton.disabled =
        true;


    const {
        error
    } =
        await state.client
            .from("messages")
            .insert({
                sender_id:
                    state.currentUser.id,

                receiver_id:
                    state.selectedUser.id,

                content:
                    content
            });


    if (error) {

        console.error(
            "Send message error:",
            error
        );

        showToast(
            error.message ||
            "Unable to send message."
        );

        elements.sendButton.disabled =
            false;

        return;
    }


    elements.messageInput.value =
        "";

    updateCharacterCount();


    await loadMessages();

    await loadProfiles();


    showToast(
        "Message sent 💬"
    );


    elements.sendButton.disabled =
        false;

    elements.messageInput.focus();
}


/* =========================================================
   DELETE MESSAGE
   ========================================================= */

async function deleteMessage(
    messageId
) {

    const {
        error
    } =
        await state.client
            .from("messages")
            .delete()
            .eq(
                "id",
                messageId
            )
            .eq(
                "sender_id",
                state.currentUser.id
            );


    if (error) {

        console.error(
            "Delete message error:",
            error
        );

        showToast(
            error.message ||
            "Unable to delete message."
        );

        return;
    }


    state.messages =
        state.messages.filter(
            message =>
                message.id !==
                messageId
        );


    renderMessages();

    showToast(
        "Message deleted."
    );
}


/* =========================================================
   SEARCH
   ========================================================= */

elements.userSearch.addEventListener(
    "input",
    event => {

        state.search =
            event.target.value;

        renderConversationList(
            state.profiles
        );
    }
);


/* =========================================================
   CHARACTER COUNT
   ========================================================= */

function updateCharacterCount() {

    const length =
        elements.messageInput
            .value.length;

    elements.characterCount.textContent =
        `${length} / 2000`;
}


elements.messageInput.addEventListener(
    "input",
    updateCharacterCount
);


/* =========================================================
   ENTER TO SEND
   ========================================================= */

elements.messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            elements.messageForm.requestSubmit();
        }
    }
);


/* =========================================================
   FORM
   ========================================================= */

elements.messageForm.addEventListener(
    "submit",
    sendMessage
);


/* =========================================================
   CLOSE CHAT
   ========================================================= */

elements.closeChat.addEventListener(
    "click",
    () => {

        state.selectedUser =
            null;

        elements.activeChat.classList.add(
            "hidden"
        );

        elements.chatEmpty.classList.remove(
            "hidden"
        );

        renderConversationList(
            state.profiles
        );
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

            await loadProfiles();

            if (
                state.selectedUser
            ) {

                await loadMessages();
            }

            showToast(
                "Messages refreshed."
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

            try {

                await loadProfiles();

            } catch (error) {

                console.error(
                    error
                );
            }
        }
    );
}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.vibeConnectMessagesData = {

    refresh:
        async () => {

            await loadProfiles();

            if (
                state.selectedUser
            ) {

                await loadMessages();
            }
        },

    openChat:
        openChat,

    getCurrentConversation:
        () =>
            state.selectedUser,

    getMessages:
        () =>
            [...state.messages]
};


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await initialize();

        registerAuthListener();

        updateCharacterCount();
    }
);
```

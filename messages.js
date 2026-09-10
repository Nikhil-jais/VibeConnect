/* =========================================================
   VIBECONNECT — MESSAGES & CHAT
   ========================================================= */

const MESSAGES_STORAGE_KEY =
    "vibeConnectMessages";


/* =========================================================
   DEMO USERS
   ========================================================= */

const chatPeople = [

    {
        id: "alex",
        name: "Alex Morgan",
        username: "@alexmorgan",
        avatar: "👨🏻‍💻",
        online: true
    },

    {
        id: "maya",
        name: "Maya Sharma",
        username: "@mayasharma",
        avatar: "👩🏻‍🎨",
        online: true
    },

    {
        id: "arjun",
        name: "Arjun Singh",
        username: "@arjunsingh",
        avatar: "🧑🏻‍🚀",
        online: false
    },

    {
        id: "priya",
        name: "Priya Verma",
        username: "@priyaverma",
        avatar: "👩🏻‍💻",
        online: true
    },

    {
        id: "rohan",
        name: "Rohan Mehta",
        username: "@rohanmehta",
        avatar: "🧑🏻‍🎮",
        online: false
    },

    {
        id: "kabir",
        name: "Kabir Khan",
        username: "@kabirkhan",
        avatar: "🧑🏻‍🎵",
        online: true
    }

];


/* =========================================================
   DEFAULT CONVERSATIONS
   ========================================================= */

const defaultConversations = {

    alex: {

        unread: 2,

        messages: [

            {
                id: 1,
                sender: "them",
                text: "Hey! Welcome to VibeConnect 👋",
                time: "10:42 AM"
            },

            {
                id: 2,
                sender: "me",
                text: "Thanks! I'm building my profile here.",
                time: "10:44 AM"
            },

            {
                id: 3,
                sender: "them",
                text: "Nice! The app is looking really cool.",
                time: "10:45 AM"
            }

        ]

    },


    maya: {

        unread: 1,

        messages: [

            {
                id: 1,
                sender: "them",
                text: "Did you see the new photography section?",
                time: "Yesterday"
            },

            {
                id: 2,
                sender: "me",
                text: "Not yet, I'll check it out!",
                time: "Yesterday"
            }

        ]

    },


    arjun: {

        unread: 0,

        messages: [

            {
                id: 1,
                sender: "me",
                text: "Are you working on the AI project?",
                time: "Mon"
            },

            {
                id: 2,
                sender: "them",
                text: "Yep! Almost finished 🚀",
                time: "Mon"
            }

        ]

    },


    priya: {

        unread: 3,

        messages: [

            {
                id: 1,
                sender: "them",
                text: "Hey! How's your coding going?",
                time: "Sun"
            }

        ]

    },


    rohan: {

        unread: 0,

        messages: [

            {
                id: 1,
                sender: "them",
                text: "Want to talk about gaming sometime?",
                time: "Sat"
            }

        ]

    },


    kabir: {

        unread: 0,

        messages: [

            {
                id: 1,
                sender: "me",
                text: "That new song was amazing!",
                time: "Fri"
            },

            {
                id: 2,
                sender: "them",
                text: "Glad you liked it 😄",
                time: "Fri"
            }

        ]

    }

};


/* =========================================================
   STATE
   ========================================================= */

let conversations = {};

let activePersonId = null;

let searchTerm = "";


/* =========================================================
   ELEMENTS
   ========================================================= */

const conversationList =
    document.getElementById(
        "conversationList"
    );

const emptyConversations =
    document.getElementById(
        "emptyConversations"
    );

const conversationSearch =
    document.getElementById(
        "conversationSearch"
    );

const conversationCount =
    document.getElementById(
        "conversationCount"
    );

const chatEmpty =
    document.getElementById(
        "chatEmpty"
    );

const activeChat =
    document.getElementById(
        "activeChat"
    );

const chatAvatar =
    document.getElementById(
        "chatAvatar"
    );

const chatName =
    document.getElementById(
        "chatName"
    );

const chatStatus =
    document.getElementById(
        "chatStatus"
    );

const messageList =
    document.getElementById(
        "messageList"
    );

const messageForm =
    document.getElementById(
        "messageForm"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );

const typingIndicator =
    document.getElementById(
        "typingIndicator"
    );

const newChatButton =
    document.getElementById(
        "newChatButton"
    );

const emptyNewChatButton =
    document.getElementById(
        "emptyNewChatButton"
    );

const newChatModal =
    document.getElementById(
        "newChatModal"
    );

const closeModalButton =
    document.getElementById(
        "closeModalButton"
    );

const newChatPeople =
    document.getElementById(
        "newChatPeople"
    );

const messageToast =
    document.getElementById(
        "messageToast"
    );

const emojiButton =
    document.getElementById(
        "emojiButton"
    );

const chatInfoButton =
    document.getElementById(
        "chatInfoButton"
    );


/* =========================================================
   LOAD DATA
   ========================================================= */

function loadMessages() {

    const saved =
        localStorage.getItem(
            MESSAGES_STORAGE_KEY
        );

    if (saved) {

        try {

            conversations =
                JSON.parse(saved);

        } catch (error) {

            console.warn(
                "Could not load messages:",
                error
            );

            conversations =
                structuredClone(
                    defaultConversations
                );

            saveMessages();
        }

    } else {

        conversations =
            structuredClone(
                defaultConversations
            );

        saveMessages();
    }


    /*
     * Make sure every demo person has
     * a conversation object.
     */

    chatPeople.forEach(person => {

        if (!conversations[person.id]) {

            conversations[person.id] = {
                unread: 0,
                messages: []
            };

        }

    });

    saveMessages();
}


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveMessages() {

    localStorage.setItem(
        MESSAGES_STORAGE_KEY,
        JSON.stringify(conversations)
    );
}


/* =========================================================
   RENDER CONVERSATIONS
   ========================================================= */

function renderConversations() {

    conversationList.innerHTML = "";

    const filteredPeople =
        chatPeople.filter(person => {

            if (!searchTerm.trim()) {
                return true;
            }

            const query =
                searchTerm
                    .toLowerCase()
                    .trim();

            const conversation =
                conversations[person.id];

            const lastMessage =
                conversation &&
                conversation.messages.length
                    ? conversation.messages[
                        conversation.messages.length - 1
                    ].text
                    : "";

            return (
                person.name
                    .toLowerCase()
                    .includes(query) ||

                person.username
                    .toLowerCase()
                    .includes(query) ||

                lastMessage
                    .toLowerCase()
                    .includes(query)
            );

        });


    conversationCount.textContent =
        `${chatPeople.length} conversation${
            chatPeople.length === 1
                ? ""
                : "s"
        }`;


    if (filteredPeople.length === 0) {

        emptyConversations.classList.remove(
            "hidden"
        );

        return;
    }


    emptyConversations.classList.add(
        "hidden"
    );


    filteredPeople.forEach(person => {

        const conversation =
            conversations[person.id];

        const lastMessage =
            conversation.messages.length
                ? conversation.messages[
                    conversation.messages.length - 1
                ]
                : null;


        const item =
            document.createElement("div");

        item.className =
            "conversation-item";


        if (
            activePersonId === person.id
        ) {

            item.classList.add("active");
        }


        const unread =
            conversation.unread || 0;


        item.innerHTML = `

            <div class="conversation-avatar">

                ${escapeHTML(person.avatar)}

                ${
                    person.online
                        ? `<span class="online-dot"></span>`
                        : ""
                }

            </div>


            <div class="conversation-details">

                <div class="conversation-top">

                    <span class="conversation-name">
                        ${escapeHTML(person.name)}
                    </span>

                    ${
                        lastMessage
                            ? `
                                <span class="conversation-time">
                                    ${escapeHTML(lastMessage.time)}
                                </span>
                              `
                            : ""
                    }

                </div>


                <div class="conversation-preview">

                    ${
                        lastMessage
                            ? escapeHTML(
                                lastMessage.text
                            )
                            : "Start a conversation"
                    }

                </div>

            </div>


            ${
                unread > 0
                    ? `
                        <div class="unread-badge">
                            ${unread}
                        </div>
                      `
                    : ""
            }

        `;


        item.addEventListener(
            "click",
            () => {

                openConversation(
                    person.id
                );

            }
        );


        conversationList.appendChild(item);

    });

}


/* =========================================================
   OPEN CONVERSATION
   ========================================================= */

function openConversation(personId) {

    const person =
        chatPeople.find(
            item => item.id === personId
        );


    if (!person) {
        return;
    }


    activePersonId =
        personId;


    /*
     * Clear unread count
     */

    conversations[personId].unread = 0;

    saveMessages();


    chatEmpty.classList.add(
        "hidden"
    );

    activeChat.classList.remove(
        "hidden"
    );


    chatAvatar.innerHTML =
        escapeHTML(person.avatar);


    chatName.textContent =
        person.name;


    chatStatus.textContent =
        person.online
            ? "Online"
            : "Offline";


    renderMessages();

    renderConversations();


    setTimeout(() => {

        messageInput.focus();

    }, 100);

}


/* =========================================================
   RENDER MESSAGES
   ========================================================= */

function renderMessages() {

    if (!activePersonId) {
        return;
    }


    const conversation =
        conversations[activePersonId];


    messageList.innerHTML = "";


    if (
        !conversation ||
        conversation.messages.length === 0
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty-messages";

        empty.textContent =
            "No messages yet. Say hello! 👋";

        messageList.appendChild(empty);

        return;
    }


    conversation.messages.forEach(message => {

        const row =
            document.createElement("div");

        row.className =
            `message-row ${
                message.sender === "me"
                    ? "sent"
                    : "received"
            }`;


        const bubble =
            document.createElement("div");

        bubble.className =
            "message-bubble";


        const text =
            document.createElement("div");

        text.textContent =
            message.text;


        const time =
            document.createElement("span");

        time.className =
            "message-time";

        time.textContent =
            message.time;


        bubble.appendChild(text);

        bubble.appendChild(time);

        row.appendChild(bubble);

        messageList.appendChild(row);

    });


    messageList.scrollTop =
        messageList.scrollHeight;
}


/* =========================================================
   SEND MESSAGE
   ========================================================= */

messageForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!activePersonId) {

            showToast(
                "Choose a conversation first."
            );

            return;
        }


        const text =
            messageInput.value.trim();


        if (!text) {
            return;
        }


        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


        conversations[
            activePersonId
        ].messages.push({

            id:
                Date.now(),

            sender:
                "me",

            text:
                text,

            time:
                time

        });


        saveMessages();

        messageInput.value = "";

        renderMessages();

        renderConversations();


        simulateReply(
            activePersonId
        );

    }
);


/* =========================================================
   SIMULATED REPLY
   ========================================================= */

function simulateReply(personId) {

    const person =
        chatPeople.find(
            item => item.id === personId
        );


    if (!person) {
        return;
    }


    typingIndicator.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        typingIndicator.classList.add(
            "hidden"
        );


        const replies = [

            "Sounds good! 😄",

            "Nice! Tell me more.",

            "That's interesting 👀",

            "Absolutely!",

            "Cool! 🚀",

            "Haha, nice 😄",

            "I'll check it out!"

        ];


        const reply =
            replies[
                Math.floor(
                    Math.random() *
                    replies.length
                )
            ];


        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


        conversations[personId].messages.push({

            id:
                Date.now(),

            sender:
                "them",

            text:
                reply,

            time:
                time

        });


        saveMessages();


        if (
            activePersonId === personId
        ) {

            renderMessages();

        } else {

            conversations[
                personId
            ].unread++;

        }


        renderConversations();

    }, 1400);

}


/* =========================================================
   SEARCH
   ========================================================= */

conversationSearch.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value;

        renderConversations();

    }
);


/* =========================================================
   NEW CHAT MODAL
   ========================================================= */

function openNewChatModal() {

    newChatPeople.innerHTML = "";


    chatPeople.forEach(person => {

        const item =
            document.createElement("div");

        item.className =
            "new-chat-person";


        item.innerHTML = `

            <div class="new-chat-avatar">
                ${escapeHTML(person.avatar)}
            </div>

            <div>

                <strong>
                    ${escapeHTML(person.name)}
                </strong>

                <small>
                    ${escapeHTML(person.username)}
                </small>

            </div>

        `;


        item.addEventListener(
            "click",
            () => {

                closeNewChatModal();

                openConversation(
                    person.id
                );

            }
        );


        newChatPeople.appendChild(item);

    });


    newChatModal.classList.remove(
        "hidden"
    );

}


function closeNewChatModal() {

    newChatModal.classList.add(
        "hidden"
    );

}


newChatButton.addEventListener(
    "click",
    openNewChatModal
);


emptyNewChatButton.addEventListener(
    "click",
    openNewChatModal
);


closeModalButton.addEventListener(
    "click",
    closeNewChatModal
);


newChatModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            newChatModal
        ) {

            closeNewChatModal();

        }

    }
);


/* =========================================================
   EMOJI BUTTON
   ========================================================= */

emojiButton.addEventListener(
    "click",
    () => {

        const emojis = [
            "😊",
            "😂",
            "❤️",
            "🔥",
            "🚀",
            "👍",
            "🎉",
            "👀"
        ];


        const emoji =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];


        messageInput.value += emoji;

        messageInput.focus();

    }
);


/* =========================================================
   CHAT INFO
   ========================================================= */

chatInfoButton.addEventListener(
    "click",
    () => {

        if (!activePersonId) {
            return;
        }


        const person =
            chatPeople.find(
                item => item.id === activePersonId
            );


        if (!person) {
            return;
        }


        showToast(
            `${person.name} • ${person.username}`
        );

    }
);


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(message) {

    messageToast.textContent =
        message;

    messageToast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            messageToast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =========================================================
   HTML ESCAPE
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
   START APPLICATION
   ========================================================= */

loadMessages();

renderConversations();


/* =========================================================
   GLOBAL API
   ========================================================= */

window.vibeConnectMessages = {

    openChat(personId) {

        openConversation(
            personId
        );

    },

    sendMessage(text) {

        if (!activePersonId || !text) {
            return;
        }

        messageInput.value =
            text;

        messageForm.requestSubmit();

    },

    refresh() {

        loadMessages();

        renderConversations();

        if (activePersonId) {
            renderMessages();
        }

    }

};


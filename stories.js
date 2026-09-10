/* =========================================================
   VIBECONNECT — STORIES
   ========================================================= */

const STORIES_STORAGE_KEY =
    "vibeConnectStories";


/* =========================================================
   DEMO USERS
   ========================================================= */

const storyUsers = {

    me: {
        name: "You",
        username: "@you",
        avatar: "✦"
    },

    alex: {
        name: "Alex Morgan",
        username: "@alexmorgan",
        avatar: "👨🏻‍💻"
    },

    maya: {
        name: "Maya Sharma",
        username: "@mayasharma",
        avatar: "👩🏻‍🎨"
    },

    arjun: {
        name: "Arjun Singh",
        username: "@arjunsingh",
        avatar: "🧑🏻‍🚀"
    },

    priya: {
        name: "Priya Verma",
        username: "@priyaverma",
        avatar: "👩🏻‍💻"
    }

};


/* =========================================================
   DEFAULT STORIES
   ========================================================= */

const defaultStories = [

    {
        id: "story-1",

        userId: "alex",

        type: "text",

        text: "Building something exciting today 🚀",

        createdAt:
            Date.now() - 25 * 60 * 1000
    },

    {
        id: "story-2",

        userId: "maya",

        type: "text",

        text: "New creative ideas loading... ✨",

        createdAt:
            Date.now() - 70 * 60 * 1000
    },

    {
        id: "story-3",

        userId: "arjun",

        type: "text",

        text: "Learning AI one step at a time 🤖",

        createdAt:
            Date.now() - 2 * 60 * 60 * 1000
    },

    {
        id: "story-4",

        userId: "priya",

        type: "text",

        text: "Coding mode: ON 💻",

        createdAt:
            Date.now() - 3 * 60 * 60 * 1000
    }

];


/* =========================================================
   STATE
   ========================================================= */

let stories = [];

let currentStoryIndex = 0;


/* =========================================================
   ELEMENTS
   ========================================================= */

const storyTypeButtons =
    document.querySelectorAll(
        ".story-type"
    );

const textStoryCreator =
    document.getElementById(
        "textStoryCreator"
    );

const imageStoryCreator =
    document.getElementById(
        "imageStoryCreator"
    );

const storyText =
    document.getElementById(
        "storyText"
    );

const storyCharacterCount =
    document.getElementById(
        "storyCharacterCount"
    );

const publishTextStory =
    document.getElementById(
        "publishTextStory"
    );

const storyImageInput =
    document.getElementById(
        "storyImageInput"
    );

const storyImagePreview =
    document.getElementById(
        "storyImagePreview"
    );

const imagePreviewContainer =
    document.getElementById(
        "imagePreviewContainer"
    );

const removeStoryImage =
    document.getElementById(
        "removeStoryImage"
    );

const storyCaption =
    document.getElementById(
        "storyCaption"
    );

const publishImageStory =
    document.getElementById(
        "publishImageStory"
    );

const storiesGrid =
    document.getElementById(
        "storiesGrid"
    );

const emptyStories =
    document.getElementById(
        "emptyStories"
    );

const storyCount =
    document.getElementById(
        "storyCount"
    );

const storyViewer =
    document.getElementById(
        "storyViewer"
    );

const viewerStory =
    document.getElementById(
        "viewerStory"
    );

const viewerUser =
    document.getElementById(
        "viewerUser"
    );

const viewerProgress =
    document.getElementById(
        "viewerProgress"
    );

const closeViewer =
    document.getElementById(
        "closeViewer"
    );

const previousStory =
    document.getElementById(
        "previousStory"
    );

const nextStory =
    document.getElementById(
        "nextStory"
    );

const storiesToast =
    document.getElementById(
        "storiesToast"
    );


/* =========================================================
   LOAD STORIES
   ========================================================= */

function loadStories() {

    const saved =
        localStorage.getItem(
            STORIES_STORAGE_KEY
        );


    if (saved) {

        try {

            stories =
                JSON.parse(saved);

        } catch (error) {

            console.warn(
                "Could not load stories:",
                error
            );

            stories =
                [...defaultStories];

            saveStories();
        }

    } else {

        stories =
            [...defaultStories];

        saveStories();
    }


    /*
     * Remove stories older than 24 hours.
     */

    const twentyFourHours =
        24 * 60 * 60 * 1000;


    const now =
        Date.now();


    const beforeCleanup =
        stories.length;


    stories =
        stories.filter(
            story =>
                now - story.createdAt <
                twentyFourHours
        );


    if (
        stories.length !==
        beforeCleanup
    ) {

        saveStories();
    }

}


/* =========================================================
   SAVE
   ========================================================= */

function saveStories() {

    localStorage.setItem(
        STORIES_STORAGE_KEY,
        JSON.stringify(stories)
    );
}


/* =========================================================
   FORMAT TIME
   ========================================================= */

function formatStoryTime(timestamp) {

    const difference =
        Date.now() - timestamp;


    const minutes =
        Math.floor(
            difference / 60000
        );


    if (minutes < 1) {
        return "Just now";
    }


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


    return "Yesterday";
}


/* =========================================================
   RENDER STORIES
   ========================================================= */

function renderStories() {

    storiesGrid.innerHTML = "";


    storyCount.textContent =
        `${stories.length} ${
            stories.length === 1
                ? "story"
                : "stories"
        }`;


    if (stories.length === 0) {

        emptyStories.classList.remove(
            "hidden"
        );

        return;
    }


    emptyStories.classList.add(
        "hidden"
    );


    const sortedStories =
        [...stories].sort(
            (a, b) =>
                b.createdAt -
                a.createdAt
        );


    sortedStories.forEach(
        (story, index) => {

            const user =
                storyUsers[
                    story.userId
                ] || storyUsers.me;


            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "story-card";


            let visualHTML = "";


            if (
                story.type ===
                "image" &&
                story.image
            ) {

                visualHTML = `
                    <img
                        class="story-card-image"
                        src="${story.image}"
                        alt="Story"
                    >
                `;

            }


            const textContent =
                story.type === "text"
                    ? `
                        <div>
                            <div class="story-card-text">
                                ${escapeHTML(
                                    story.text
                                )}
                            </div>
                        </div>
                    `
                    : `
                        <div>
                            ${
                                story.caption
                                    ? `
                                        <div class="story-card-caption">
                                            ${escapeHTML(
                                                story.caption
                                            )}
                                        </div>
                                      `
                                    : ""
                            }
                        </div>
                    `;


            const isOwnStory =
                story.userId === "me";


            card.innerHTML = `

                ${visualHTML}

                <div class="story-card-overlay">

                    <div class="story-user">

                        <div class="story-avatar">
                            ${escapeHTML(
                                user.avatar
                            )}
                        </div>

                        <div>

                            <div class="story-user-name">
                                ${escapeHTML(
                                    user.name
                                )}
                            </div>

                            <span class="story-time">
                                ${formatStoryTime(
                                    story.createdAt
                                )}
                            </span>

                        </div>

                    </div>


                    ${textContent}

                </div>


                ${
                    isOwnStory
                        ? `
                            <button
                                class="story-delete"
                                data-delete-story="${story.id}"
                                title="Delete story"
                            >
                                🗑️
                            </button>
                          `
                        : ""
                }

            `;


            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".story-delete"
                        )
                    ) {
                        return;
                    }


                    const actualIndex =
                        stories.findIndex(
                            item =>
                                item.id ===
                                story.id
                        );


                    openStory(
                        actualIndex
                    );

                }
            );


            storiesGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   STORY TYPE SWITCH
   ========================================================= */

storyTypeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                storyTypeButtons.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                const type =
                    button.dataset.type;


                if (type === "text") {

                    textStoryCreator.classList.remove(
                        "hidden"
                    );

                    imageStoryCreator.classList.add(
                        "hidden"
                    );

                } else {

                    textStoryCreator.classList.add(
                        "hidden"
                    );

                    imageStoryCreator.classList.remove(
                        "hidden"
                    );

                }

            }
        );

    }
);


/* =========================================================
   CHARACTER COUNT
   ========================================================= */

storyText.addEventListener(
    "input",
    () => {

        storyCharacterCount.textContent =
            `${storyText.value.length} / 220`;

    }
);


/* =========================================================
   CREATE TEXT STORY
   ========================================================= */

publishTextStory.addEventListener(
    "click",
    () => {

        const text =
            storyText.value.trim();


        if (!text) {

            showToast(
                "Write something for your story first."
            );

            storyText.focus();

            return;
        }


        const newStory = {

            id:
                `story-${Date.now()}`,

            userId:
                "me",

            type:
                "text",

            text:
                text,

            createdAt:
                Date.now()

        };


        stories.unshift(
            newStory
        );


        saveStories();

        renderStories();


        storyText.value = "";

        storyCharacterCount.textContent =
            "0 / 220";


        showToast(
            "Your story is live! ✨"
        );

    }
);


/* =========================================================
   IMAGE SELECT
   ========================================================= */

storyImageInput.addEventListener(
    "change",
    () => {

        const file =
            storyImageInput.files[0];


        if (!file) {
            return;
        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showToast(
                "Please choose an image."
            );

            storyImageInput.value =
                "";

            return;
        }


        if (
            file.size >
            10 * 1024 * 1024
        ) {

            showToast(
                "Image must be smaller than 10 MB."
            );

            storyImageInput.value =
                "";

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                storyImagePreview.src =
                    event.target.result;

                imagePreviewContainer.classList.remove(
                    "hidden"
                );

            };


        reader.readAsDataURL(
            file
        );

    }
);


/* =========================================================
   REMOVE IMAGE
   ========================================================= */

removeStoryImage.addEventListener(
    "click",
    () => {

        storyImageInput.value =
            "";

        storyImagePreview.src =
            "";

        imagePreviewContainer.classList.add(
            "hidden"
        );

    }
);


/* =========================================================
   CREATE IMAGE STORY
   ========================================================= */

publishImageStory.addEventListener(
    "click",
    () => {

        const image =
            storyImagePreview.src;


        if (!image) {

            showToast(
                "Choose a photo first."
            );

            return;
        }


        const caption =
            storyCaption.value.trim();


        const newStory = {

            id:
                `story-${Date.now()}`,

            userId:
                "me",

            type:
                "image",

            image:
                image,

            caption:
                caption,

            createdAt:
                Date.now()

        };


        stories.unshift(
            newStory
        );


        saveStories();

        renderStories();


        storyImageInput.value =
            "";

        storyImagePreview.src =
            "";

        storyCaption.value =
            "";

        imagePreviewContainer.classList.add(
            "hidden"
        );


        showToast(
            "Photo story published! 📸"
        );

    }
);


/* =========================================================
   DELETE STORY
   ========================================================= */

storiesGrid.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-delete-story]"
            );


        if (!button) {
            return;
        }


        event.stopPropagation();


        const storyId =
            button.dataset.deleteStory;


        const storyIndex =
            stories.findIndex(
                story =>
                    story.id ===
                    storyId
            );


        if (storyIndex === -1) {
            return;
        }


        stories.splice(
            storyIndex,
            1
        );


        saveStories();

        renderStories();


        showToast(
            "Story deleted."
        );

    }
);


/* =========================================================
   OPEN VIEWER
   ========================================================= */

function openStory(index) {

    if (
        index < 0 ||
        index >= stories.length
    ) {
        return;
    }


    currentStoryIndex =
        index;


    storyViewer.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    renderViewerStory();

}


/* =========================================================
   RENDER VIEWER
   ========================================================= */

function renderViewerStory() {

    const story =
        stories[
            currentStoryIndex
        ];


    if (!story) {
        closeStoryViewer();
        return;
    }


    const user =
        storyUsers[
            story.userId
        ] || storyUsers.me;


    viewerUser.textContent =
        `${user.avatar}  ${user.name} • ${
            formatStoryTime(
                story.createdAt
            )
        }`;


    viewerProgress.style.width =
        `${
            (
                (currentStoryIndex + 1) /
                stories.length
            ) * 100
        }%`;


    viewerStory.innerHTML = "";


    if (
        story.type === "image" &&
        story.image
    ) {

        const image =
            document.createElement(
                "img"
            );

        image.src =
            story.image;

        image.alt =
            "Story";


        viewerStory.appendChild(
            image
        );


        if (story.caption) {

            const caption =
                document.createElement(
                    "div"
                );

            caption.className =
                "viewer-caption";

            caption.textContent =
                story.caption;


            viewerStory.appendChild(
                caption
            );

        }

    } else {

        const text =
            document.createElement(
                "div"
            );

        text.className =
            "viewer-story-text";

        text.textContent =
            story.text;


        viewerStory.appendChild(
            text
        );

    }

}


/* =========================================================
   CLOSE VIEWER
   ========================================================= */

function closeStoryViewer() {

    storyViewer.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   NAVIGATION
   ========================================================= */

previousStory.addEventListener(
    "click",
    () => {

        if (
            currentStoryIndex >
            0
        ) {

            currentStoryIndex--;

            renderViewerStory();

        }

    }
);


nextStory.addEventListener(
    "click",
    () => {

        if (
            currentStoryIndex <
            stories.length - 1
        ) {

            currentStoryIndex++;

            renderViewerStory();

        } else {

            closeStoryViewer();

        }

    }
);


closeViewer.addEventListener(
    "click",
    closeStoryViewer
);


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            storyViewer.classList.contains(
                "hidden"
            )
        ) {
            return;
        }


        if (
            event.key ===
            "Escape"
        ) {

            closeStoryViewer();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousStory.click();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextStory.click();

        }

    }
);


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(message) {

    storiesToast.textContent =
        message;

    storiesToast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                storiesToast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   START
   ========================================================= */

loadStories();

renderStories();


/* =========================================================
   GLOBAL API
   ========================================================= */

window.vibeConnectStories = {

    refresh() {

        loadStories();

        renderStories();

    },

    getStories() {

        return stories;

    }

};

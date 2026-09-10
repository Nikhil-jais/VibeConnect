/* =========================================================
   VIBECONNECT — CREATE POST
   ========================================================= */


/* =========================================================
   VARIABLES
   ========================================================= */

let selectedMedia = [];

let pollEnabled = false;


/* =========================================================
   LOAD PROFILE
   ========================================================= */

function loadCreatorProfile() {

    const saved =
        localStorage.getItem(
            "vibeConnectProfile"
        );

    if (!saved) {
        return;
    }

    try {

        const profile =
            JSON.parse(saved);

        const name =
            document.getElementById(
                "creatorName"
            );

        const avatar =
            document.getElementById(
                "creatorAvatar"
            );

        if (name && profile.name) {

            name.textContent =
                profile.name;

        }

        if (
            avatar &&
            profile.avatar
        ) {

            avatar.innerHTML = `
                <img
                    src="${profile.avatar}"
                    alt="Profile picture"
                >
            `;

        }

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }
}


/* =========================================================
   CHARACTER COUNTER
   ========================================================= */

function updateCharacterCount() {

    const text =
        document.getElementById(
            "postText"
        );

    const counter =
        document.getElementById(
            "characterCount"
        );

    if (!text || !counter) {
        return;
    }

    counter.textContent =
        text.value.length;
}


/* =========================================================
   PHOTO UPLOAD
   ========================================================= */

function openPhotoPicker() {

    document
        .getElementById("photoInput")
        .click();
}


function handlePhotoSelection(event) {

    const files =
        Array.from(
            event.target.files
        );

    files.forEach(file => {

        if (
            file.type.startsWith("image/")
        ) {

            selectedMedia.push({
                file: file,
                type: "image"
            });

        }

    });

    renderMediaPreview();

    event.target.value = "";
}


/* =========================================================
   VIDEO UPLOAD
   ========================================================= */

function openVideoPicker() {

    document
        .getElementById("videoInput")
        .click();
}


function handleVideoSelection(event) {

    const files =
        Array.from(
            event.target.files
        );

    files.forEach(file => {

        if (
            file.type.startsWith("video/")
        ) {

            selectedMedia.push({
                file: file,
                type: "video"
            });

        }

    });

    renderMediaPreview();

    event.target.value = "";
}


/* =========================================================
   MEDIA PREVIEW
   ========================================================= */

function renderMediaPreview() {

    const container =
        document.getElementById(
            "mediaPreview"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (selectedMedia.length === 0) {

        container.classList.add(
            "hidden"
        );

        return;
    }

    container.classList.remove(
        "hidden"
    );


    selectedMedia.forEach(
        (media, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "preview-item";


            const remove =
                document.createElement(
                    "button"
                );

            remove.className =
                "remove-media";

            remove.type =
                "button";

            remove.textContent =
                "×";


            remove.addEventListener(
                "click",
                () => {

                    selectedMedia.splice(
                        index,
                        1
                    );

                    renderMediaPreview();

                }
            );


            if (
                media.type === "image"
            ) {

                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    URL.createObjectURL(
                        media.file
                    );

                image.alt =
                    "Selected image";

                item.appendChild(
                    image
                );

            }


            if (
                media.type === "video"
            ) {

                const video =
                    document.createElement(
                        "video"
                    );

                video.src =
                    URL.createObjectURL(
                        media.file
                    );

                video.controls =
                    true;

                item.appendChild(
                    video
                );

            }


            item.appendChild(
                remove
            );

            container.appendChild(
                item
            );

        }
    );
}


/* =========================================================
   POLL
   ========================================================= */

function openPoll() {

    pollEnabled = true;

    document
        .getElementById("pollCreator")
        .classList.remove("hidden");
}


function closePoll() {

    pollEnabled = false;

    document
        .getElementById("pollCreator")
        .classList.add("hidden");
}


function addPollOption() {

    const options =
        document.getElementById(
            "pollOptions"
        );

    const count =
        options.querySelectorAll(
            ".poll-option"
        ).length;

    if (count >= 6) {

        alert(
            "You can have a maximum of 6 options."
        );

        return;
    }

    const input =
        document.createElement(
            "input"
        );

    input.type =
        "text";

    input.className =
        "poll-option";

    input.placeholder =
        `Option ${count + 1}`;

    input.maxLength =
        100;

    options.appendChild(
        input
    );
}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function clearPost() {

    const confirmed =
        confirm(
            "Clear everything you've entered?"
        );

    if (!confirmed) {
        return;
    }

    document
        .getElementById("postText")
        .value = "";

    selectedMedia = [];

    renderMediaPreview();

    closePoll();

    document
        .getElementById("pollQuestion")
        .value = "";

    document
        .getElementById("pollOptions")
        .innerHTML = `
            <input
                class="poll-option"
                type="text"
                placeholder="Option 1"
                maxlength="100"
            >

            <input
                class="poll-option"
                type="text"
                placeholder="Option 2"
                maxlength="100"
            >
        `;

    updateCharacterCount();
}


/* =========================================================
   CREATE POST
   ========================================================= */

function createPost() {

    const text =
        document
            .getElementById("postText")
            .value
            .trim();


    /* -----------------------------------------
       POLL DATA
       ----------------------------------------- */

    let poll = null;

    if (pollEnabled) {

        const question =
            document
                .getElementById(
                    "pollQuestion"
                )
                .value
                .trim();

        const optionInputs =
            document.querySelectorAll(
                ".poll-option"
            );

        const options =
            Array.from(
                optionInputs
            )
                .map(
                    input =>
                        input.value.trim()
                )
                .filter(
                    value => value.length > 0
                );


        if (!question) {

            alert(
                "Please enter your poll question."
            );

            return;
        }


        if (options.length < 2) {

            alert(
                "A poll needs at least 2 options."
            );

            return;
        }


        poll = {
            question: question,
            options: options
        };
    }


    /* -----------------------------------------
       CHECK CONTENT
       ----------------------------------------- */

    if (
        !text &&
        selectedMedia.length === 0 &&
        !poll
    ) {

        alert(
            "Add some text, a photo, a video, or a poll first."
        );

        return;
    }


    /* -----------------------------------------
       CREATE LOCAL POST
       ----------------------------------------- */

    const savedPosts =
        JSON.parse(
            localStorage.getItem(
                "vibeConnectPosts"
            ) || "[]"
        );


    const post = {

        id:
            Date.now(),

        text:
            text,

        media:
            selectedMedia.map(
                media => ({
                    name:
                        media.file.name,

                    type:
                        media.type,

                    url:
                        URL.createObjectURL(
                            media.file
                        )
                })
            ),

        poll:
            poll,

        createdAt:
            new Date().toISOString()

    };


    savedPosts.unshift(
        post
    );


    localStorage.setItem(
        "vibeConnectPosts",
        JSON.stringify(
            savedPosts
        )
    );


    /* -----------------------------------------
       UPDATE PROFILE POST COUNT
       ----------------------------------------- */

    try {

        const profile =
            JSON.parse(
                localStorage.getItem(
                    "vibeConnectProfile"
                ) || "{}"
            );

        profile.posts =
            (profile.posts || 0) + 1;

        localStorage.setItem(
            "vibeConnectProfile",
            JSON.stringify(
                profile
            )
        );

    } catch (error) {

        console.error(
            "Unable to update post count:",
            error
        );

    }


    alert(
        "Post created successfully! 🎉"
    );


    window.location.href =
        "feed.html";
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCreatorProfile();

        updateCharacterCount();


        document
            .getElementById("postText")
            .addEventListener(
                "input",
                updateCharacterCount
            );


        document
            .getElementById("photoButton")
            .addEventListener(
                "click",
                openPhotoPicker
            );


        document
            .getElementById("photoInput")
            .addEventListener(
                "change",
                handlePhotoSelection
            );


        document
            .getElementById("videoButton")
            .addEventListener(
                "click",
                openVideoPicker
            );


        document
            .getElementById("videoInput")
            .addEventListener(
                "change",
                handleVideoSelection
            );


        document
            .getElementById("pollButton")
            .addEventListener(
                "click",
                openPoll
            );


        document
            .getElementById("closePollButton")
            .addEventListener(
                "click",
                closePoll
            );


        document
            .getElementById("addPollOption")
            .addEventListener(
                "click",
                addPollOption
            );


        document
            .getElementById("clearButton")
            .addEventListener(
                "click",
                clearPost
            );


        document
            .getElementById("createPostButton")
            .addEventListener(
                "click",
                createPost
            );

    }
);

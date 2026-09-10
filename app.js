/* =========================================================
   VIBECONNECT APP
   Functional social experience
========================================================= */


/* =========================================================
   APP STATE
========================================================= */

const state = {

    currentPage: "home",

    posts: Number(
        localStorage.getItem("vibePosts") || 2
    ),

    profile: JSON.parse(
        localStorage.getItem("vibeProfile") ||
        JSON.stringify({
            name: "Nikhil Jaiswal",
            username: "@nikhil-jais",
            bio:
                "Full Stack Developer • Dreamer • Gamer 🚀\n" +
                "Building cool things and sharing the journey."
        })
    )

};


/* =========================================================
   HELPERS
========================================================= */

function $(selector) {
    return document.querySelector(selector);
}


function $$(selector) {
    return document.querySelectorAll(selector);
}


function showToast(message) {

    const oldToast = $(".vibe-toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");

    toast.className = "vibe-toast";

    toast.textContent = message;

    Object.assign(toast.style, {
        position: "fixed",
        left: "50%",
        bottom: "90px",
        transform: "translateX(-50%)",
        padding: "12px 18px",
        borderRadius: "13px",
        background: "#191b2d",
        border: "1px solid rgba(255,255,255,.1)",
        color: "white",
        zIndex: "999",
        boxShadow: "0 15px 40px rgba(0,0,0,.4)",
        fontSize: "13px"
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2200);
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageName) {

    state.currentPage = pageName;

    $$(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = $(`#page-${pageName}`);

    if (target) {
        target.classList.add("active");
    }


    $$(".nav-item[data-page]").forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageName
        );

    });


    $$(".mobile-nav-item[data-page]").forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageName
        );

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* Desktop navigation */

$$(".nav-item[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});


/* Mobile navigation */

$$(".mobile-nav-item[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});


/* Top profile */

$$("[data-page='profile']").forEach(button => {

    button.addEventListener("click", () => {

        showPage("profile");

    });

});


/* =========================================================
   CREATE MODAL
========================================================= */

const createModal = $("#createModal");


function openCreateModal() {

    createModal.classList.add("open");

    document.body.style.overflow = "hidden";

}


function closeCreateModal() {

    createModal.classList.remove("open");

    document.body.style.overflow = "";

}


$("#createNav")?.addEventListener(
    "click",
    openCreateModal
);


$("#mobileCreate")?.addEventListener(
    "click",
    openCreateModal
);


$("#openComposer")?.addEventListener(
    "click",
    openCreateModal
);


$("#closeCreateModal")?.addEventListener(
    "click",
    closeCreateModal
);


createModal?.addEventListener("click", event => {

    if (event.target === createModal) {
        closeCreateModal();
    }

});


/* =========================================================
   PHOTO / VIDEO UPLOAD
========================================================= */

const photoInput = $("#photoInput");
const videoInput = $("#videoInput");
const uploadPreview = $("#uploadPreview");


function showMediaPreview(file) {

    if (!file) {
        return;
    }

    uploadPreview.innerHTML = "";

    uploadPreview.classList.remove("hidden");

    const url = URL.createObjectURL(file);


    if (file.type.startsWith("image/")) {

        const image = document.createElement("img");

        image.src = url;

        image.alt = "Selected post image";

        uploadPreview.appendChild(image);

    }


    else if (file.type.startsWith("video/")) {

        const video = document.createElement("video");

        video.src = url;

        video.controls = true;

        uploadPreview.appendChild(video);

    }


    showToast(
        `${file.name} selected`
    );

}


$("#addPhotoButton")?.addEventListener(
    "click",
    () => photoInput.click()
);


$("#quickPhoto")?.addEventListener(
    "click",
    () => {

        openCreateModal();

        photoInput.click();

    }
);


photoInput?.addEventListener(
    "change",
    event => {

        showMediaPreview(
            event.target.files[0]
        );

    }
);


$("#addVideoButton")?.addEventListener(
    "click",
    () => videoInput.click()
);


$("#quickVideo")?.addEventListener(
    "click",
    () => {

        openCreateModal();

        videoInput.click();

    }
);


videoInput?.addEventListener(
    "change",
    event => {

        showMediaPreview(
            event.target.files[0]
        );

    }
);


/* =========================================================
   CREATE POST
========================================================= */

$("#publishPost")?.addEventListener(
    "click",
    () => {

        const caption =
            $("#postCaption").value.trim();


        if (!caption && !photoInput.files.length &&
            !videoInput.files.length) {

            showToast(
                "Add something before publishing."
            );

            return;

        }


        const feed = $("#feed");

        const post = document.createElement("article");

        post.className = "post";


        let mediaHTML = "";


        const selectedPhoto =
            photoInput.files[0];


        const selectedVideo =
            videoInput.files[0];


        if (selectedPhoto) {

            const url =
                URL.createObjectURL(selectedPhoto);

            mediaHTML = `
                <div class="post-media">
                    <img
                        src="${url}"
                        alt="Uploaded post"
                        style="
                            width:100%;
                            height:100%;
                            max-height:500px;
                            object-fit:cover;
                        "
                    >
                </div>
            `;

        }


        else if (selectedVideo) {

            const url =
                URL.createObjectURL(selectedVideo);

            mediaHTML = `
                <div class="post-media">
                    <video
                        src="${url}"
                        controls
                        style="
                            width:100%;
                            max-height:500px;
                        "
                    ></video>
                </div>
            `;

        }


        else {

            mediaHTML = `
                <div
                    class="post-media"
                    style="
                        background:
                        linear-gradient(
                            135deg,
                            #33215d,
                            #4b72d6
                        );
                    "
                >
                    <strong
                        style="
                            font-size:28px;
                        "
                    >
                        Your Vibe ✨
                    </strong>
                </div>
            `;

        }


        post.innerHTML = `

            <div class="post-header">

                <div class="user-info">

                    <div class="post-avatar">
                        NJ
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                state.profile.name
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                state.profile.username
                            )} · just now
                        </span>

                    </div>

                </div>

                <button class="post-menu">
                    ⋯
                </button>

            </div>


            ${
                caption
                    ? `
                        <div class="post-text">
                            ${escapeHTML(caption)}
                        </div>
                    `
                    : ""
            }


            ${mediaHTML}


            <div class="post-stats">

                <span>
                    ❤️ 0
                </span>

                <span>
                    💬 0 comments
                </span>

                <span>
                    ↗ 0 shares
                </span>

            </div>


            <div class="post-actions">

                <button class="post-action like-button">
                    ♡
                    <span>Like</span>
                </button>

                <button class="post-action comment-button">
                    ◯
                    <span>Comment</span>
                </button>

                <button class="post-action share-button">
                    ↗
                    <span>Share</span>
                </button>

                <button class="post-action save-button">
                    ♧
                    <span>Save</span>
                </button>

            </div>


            <div class="comment-box hidden">

                <input
                    type="text"
                    placeholder="Write a comment..."
                >

                <button>
                    Post
                </button>

            </div>

        `;


        feed.prepend(post);


        state.posts++;

        localStorage.setItem(
            "vibePosts",
            state.posts
        );


        $("#profilePostCount").textContent =
            state.posts;


        $("#postCaption").value = "";

        photoInput.value = "";

        videoInput.value = "";

        uploadPreview.innerHTML = "";

        uploadPreview.classList.add("hidden");


        closeCreateModal();


        bindPostActions(post);


        showToast(
            "Your post is live on VibeConnect 🎉"
        );

    }
);


/* =========================================================
   POST ACTIONS
========================================================= */

function bindPostActions(post) {

    const like =
        post.querySelector(".like-button");


    like?.addEventListener(
        "click",
        () => {

            like.classList.toggle("liked");

            like.querySelector("span").textContent =
                like.classList.contains("liked")
                    ? "Liked"
                    : "Like";

        }
    );


    const save =
        post.querySelector(".save-button");


    save?.addEventListener(
        "click",
        () => {

            save.classList.toggle("saved");

            save.querySelector("span").textContent =
                save.classList.contains("saved")
                    ? "Saved"
                    : "Save";

        }
    );


    const comment =
        post.querySelector(".comment-button");


    comment?.addEventListener(
        "click",
        () => {

            post
                .querySelector(".comment-box")
                ?.classList.toggle("hidden");

        }
    );


    const share =
        post.querySelector(".share-button");


    share?.addEventListener(
        "click",
        async () => {

            const shareText =
                "Check this out on VibeConnect!";

            try {

                if (
                    navigator.share
                ) {

                    await navigator.share({
                        title: "VibeConnect",
                        text: shareText,
                        url: window.location.href
                    });

                }

                else if (
                    navigator.clipboard
                ) {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    showToast(
                        "Post link copied!"
                    );

                }

                else {

                    showToast(
                        "Share link ready!"
                    );

                }

            }

            catch {
                /* User cancelled sharing */
            }

        }
    );


    const commentBox =
        post.querySelector(".comment-box");


    const commentInput =
        commentBox?.querySelector("input");


    const commentButton =
        commentBox?.querySelector("button");


    commentButton?.addEventListener(
        "click",
        () => {

            const value =
                commentInput.value.trim();


            if (!value) {
                return;
            }


            const newComment =
                document.createElement("div");


            newComment.style.cssText = `
                padding:10px 16px;
                border-top:1px solid rgba(255,255,255,.06);
                font-size:13px;
            `;


            newComment.innerHTML = `
                <strong>
                    ${escapeHTML(
                        state.profile.name
                    )}
                </strong>
                ${escapeHTML(value)}
            `;


            post.appendChild(newComment);


            commentInput.value = "";

            showToast(
                "Comment added 💬"
            );

        }
    );

}


$$(".post").forEach(
    bindPostActions
);


/* =========================================================
   FOLLOW BUTTONS
========================================================= */

$$(".follow-button").forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const following =
                    button.dataset.following === "true";


                if (following) {

                    button.textContent =
                        "Follow";

                    button.dataset.following =
                        "false";

                }

                else {

                    button.textContent =
                        "Following";

                    button.dataset.following =
                        "true";

                }

            }
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

$("#globalSearch")?.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Enter") {
            return;
        }


        const query =
            event.target.value.trim();


        if (!query) {
            return;
        }


        showPage("explore");


        showToast(
            `Searching VibeConnect for "${query}"`
        );

    }
);


/* =========================================================
   CHAT
========================================================= */

$("#chatForm")?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const input =
            $("#messageInput");


        const text =
            input.value.trim();


        if (!text) {
            return;
        }


        const message =
            document.createElement("div");


        message.className =
            "message sent";


        message.textContent =
            text;


        $("#chatMessages")
            .appendChild(message);


        input.value = "";


        $("#chatMessages").scrollTop =
            $("#chatMessages").scrollHeight;

    }
);


/* =========================================================
   STORY UPLOAD
========================================================= */

const storyModal =
    $("#storyModal");


const storyInput =
    $("#storyInput");


$("#storyUploadButton")?.addEventListener(
    "click",
    () => {

        storyModal.classList.add("open");

        document.body.style.overflow = "hidden";

    }
);


$("#closeStoryModal")?.addEventListener(
    "click",
    closeStoryModal
);


function closeStoryModal() {

    storyModal.classList.remove("open");

    document.body.style.overflow = "";

}


$("#storyChooseButton")?.addEventListener(
    "click",
    () => {

        storyInput.click();

    }
);


storyInput?.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        const url =
            URL.createObjectURL(file);


        const preview =
            $("#storyPreview");


        preview.classList.remove("hidden");


        if (
            file.type.startsWith("image/")
        ) {

            preview.innerHTML = `
                <img
                    src="${url}"
                    alt="Story preview"
                >
            `;

        }

        else {

            preview.innerHTML = `
                <video
                    src="${url}"
                    controls
                ></video>
            `;

        }


        $("#storyChooseButton").textContent =
            "Story selected ✓";


        showToast(
            "Story ready to share!"
        );

    }
);


/* =========================================================
   QUICK REEL
========================================================= */

$("#quickReel")?.addEventListener(
    "click",
    () => {

        openCreateModal();

        showToast(
            "Choose Add Video to create your Reel 🎬"
        );

    }
);


$("#addReelButton")?.addEventListener(
    "click",
    () => {

        videoInput.click();

    }
);


/* =========================================================
   LIVE
========================================================= */

$("#quickLive")?.addEventListener(
    "click",
    () => {

        showToast(
            "Live mode is ready for the next build stage 🔴"
        );

    }
);


$("#liveButton")?.addEventListener(
    "click",
    () => {

        showToast(
            "Live mode is ready for the next build stage 🔴"
        );

    }
);


/* =========================================================
   POLL
========================================================= */

$("#pollButton")?.addEventListener(
    "click",
    () => {

        const caption =
            $("#postCaption");


        caption.value +=
            "\n\n📊 Poll: What should I build next?\n" +
            "• Social app features\n" +
            "• AI tools";


        caption.focus();

        showToast(
            "Poll added to your post!"
        );

    }
);


/* =========================================================
   GALLERY
========================================================= */

$("#galleryButton")?.addEventListener(
    "click",
    () => {

        photoInput.click();

    }
);


/* =========================================================
   EDIT PROFILE
========================================================= */

const profileModal =
    $("#profileModal");


$("#editProfileButton")?.addEventListener(
    "click",
    () => {

        $("#editName").value =
            state.profile.name;

        $("#editUsername").value =
            state.profile.username;

        $("#editBio").value =
            state.profile.bio;

        profileModal.classList.add("open");

        document.body.style.overflow =
            "hidden";

    }
);


$("#closeProfileModal")?.addEventListener(
    "click",
    closeProfileModal
);


function closeProfileModal() {

    profileModal.classList.remove("open");

    document.body.style.overflow = "";

}


$("#saveProfile")?.addEventListener(
    "click",
    () => {

        state.profile.name =
            $("#editName").value.trim() ||
            "Nikhil Jaiswal";


        state.profile.username =
            $("#editUsername").value.trim() ||
            "@nikhil-jais";


        state.profile.bio =
            $("#editBio").value.trim();


        localStorage.setItem(
            "vibeProfile",
            JSON.stringify(state.profile)
        );


        updateProfile();


        closeProfileModal();


        showToast(
            "Profile updated ✓"
        );

    }
);


function updateProfile() {

    const name =
        $(".profile-name-row h1");


    const username =
        $(".profile-name-row p");


    const bio =
        $(".profile-bio");


    if (name) {
        name.textContent =
            state.profile.name;
    }


    if (username) {
        username.textContent =
            state.profile.username;
    }


    if (bio) {
        bio.innerHTML =
            escapeHTML(
                state.profile.bio
            ).replace(
                /\n/g,
                "<br>"
            );
    }

}


updateProfile();


/* =========================================================
   PROFILE TABS
========================================================= */

$$(".profile-tab").forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                $$(".profile-tab")
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                tab.classList.add(
                    "active"
                );


                showToast(
                    `${tab.textContent} selected`
                );

            }
        );

    }
);


/* =========================================================
   EXPLORE TABS
========================================================= */

$$(".explore-tab").forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                $$(".explore-tab")
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                tab.classList.add(
                    "active"
                );

            }
        );

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        closeCreateModal();

        closeStoryModal();

        closeProfileModal();

    }
);


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
   INITIALISE
========================================================= */

$("#profilePostCount").textContent =
    state.posts;


console.log(
    "VibeConnect app loaded successfully 🚀"
);

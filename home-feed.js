/* =========================================================
   VIBECONNECT
   HOME FEED ENGINE
   STEP 3
========================================================= */

const VibeHomeFeed = (() => {

    const STORAGE_KEY = "vibeconnect_posts";

    let posts = [];

    /* ---------------------------------------------------------
       INITIALIZE
    --------------------------------------------------------- */

    function init() {
        loadPosts();
        renderFeed();
        setupEvents();
    }

    /* ---------------------------------------------------------
       LOAD POSTS
    --------------------------------------------------------- */

    function loadPosts() {
        try {
            posts = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];
        } catch (error) {
            console.error(
                "Unable to load VibeConnect posts:",
                error
            );

            posts = [];
        }
    }

    /* ---------------------------------------------------------
       SAVE POSTS
    --------------------------------------------------------- */

    function savePosts() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(posts)
        );
    }

    /* ---------------------------------------------------------
       CREATE POST
    --------------------------------------------------------- */

    function createPost({
        media,
        mediaType,
        caption,
        location
    }) {

        const post = {
            id: Date.now().toString(),

            username: "You",

            avatar: "https://ui-avatars.com/api/?name=You&background=6d4aff&color=fff",

            media,

            mediaType,

            caption: caption || "",

            location: location || "",

            likes: 0,

            liked: false,

            saved: false,

            comments: [],

            createdAt: new Date().toISOString()
        };

        posts.unshift(post);

        savePosts();

        renderFeed();

        showMessage("Post created successfully ✨");
    }

    /* ---------------------------------------------------------
       RENDER FEED
    --------------------------------------------------------- */

    function renderFeed() {

        const feed =
            document.getElementById("vibeHomeFeed");

        if (!feed) {
            return;
        }

        if (!posts.length) {

            feed.innerHTML = `
                <div class="vibe-empty-feed">

                    <div class="vibe-empty-icon">
                        ✨
                    </div>

                    <h3>Your Vibe starts here</h3>

                    <p>
                        Share your first photo or video
                        with the VibeConnect community.
                    </p>

                    <button
                        class="vibe-primary-button"
                        id="emptyCreatePost"
                    >
                        + Create your first post
                    </button>

                </div>
            `;

            const button =
                document.getElementById("emptyCreatePost");

            if (button) {
                button.addEventListener(
                    "click",
                    openComposer
                );
            }

            return;
        }

        feed.innerHTML =
            posts.map(renderPost).join("");

        attachPostEvents();
    }

    /* ---------------------------------------------------------
       RENDER SINGLE POST
    --------------------------------------------------------- */

    function renderPost(post) {

        const commentsHTML =
            post.comments
                .map(comment => `
                    <div class="vibe-comment">
                        <strong>
                            ${escapeHTML(comment.username)}
                        </strong>

                        <span>
                            ${escapeHTML(comment.text)}
                        </span>
                    </div>
                `)
                .join("");

        const mediaHTML =
            post.mediaType === "video"

                ? `
                    <video
                        class="vibe-post-media"
                        controls
                        preload="metadata"
                    >
                        <source
                            src="${post.media}"
                            type="video/mp4"
                        >
                    </video>
                `

                : `
                    <img
                        class="vibe-post-media"
                        src="${post.media}"
                        alt="VibeConnect post"
                    >
                `;

        return `
            <article
                class="vibe-post"
                data-post-id="${post.id}"
            >

                <!-- POST HEADER -->

                <div class="vibe-post-header">

                    <div class="vibe-user-info">

                        <img
                            class="vibe-avatar"
                            src="${post.avatar}"
                            alt="Profile"
                        >

                        <div>

                            <strong>
                                ${escapeHTML(post.username)}
                            </strong>

                            ${
                                post.location
                                    ? `
                                        <small>
                                            📍
                                            ${escapeHTML(post.location)}
                                        </small>
                                      `
                                    : ""
                            }

                        </div>

                    </div>

                    <button
                        class="vibe-post-menu"
                        data-action="delete"
                        title="Delete post"
                    >
                        ⋯
                    </button>

                </div>


                <!-- MEDIA -->

                <div class="vibe-post-media-container">

                    ${mediaHTML}

                </div>


                <!-- ACTIONS -->

                <div class="vibe-post-actions">

                    <div class="vibe-action-left">

                        <button
                            class="vibe-action-button ${
                                post.liked
                                    ? "liked"
                                    : ""
                            }"
                            data-action="like"
                        >
                            ${
                                post.liked
                                    ? "❤️"
                                    : "♡"
                            }
                        </button>

                        <button
                            class="vibe-action-button"
                            data-action="comment"
                        >
                            💬
                        </button>

                        <button
                            class="vibe-action-button"
                            data-action="share"
                        >
                            ↗
                        </button>

                    </div>

                    <button
                        class="vibe-action-button ${
                            post.saved
                                ? "saved"
                                : ""
                        }"
                        data-action="save"
                    >
                        ${
                            post.saved
                                ? "🔖"
                                : "🏷️"
                        }
                    </button>

                </div>


                <!-- LIKES -->

                <div class="vibe-like-count">

                    ${
                        post.likes
                            ? `${post.likes} ${post.likes === 1 ? "like" : "likes"}`
                            : "Be the first to like this"
                    }

                </div>


                <!-- CAPTION -->

                ${
                    post.caption
                        ? `
                            <div class="vibe-caption">

                                <strong>
                                    ${escapeHTML(post.username)}
                                </strong>

                                ${escapeHTML(post.caption)}

                            </div>
                          `
                        : ""
                }


                <!-- COMMENTS -->

                <div class="vibe-comments">

                    ${commentsHTML}

                </div>


                <!-- COMMENT INPUT -->

                <form
                    class="vibe-comment-form"
                    data-action="comment-form"
                >

                    <input
                        type="text"
                        placeholder="Add a comment..."
                        maxlength="300"
                    >

                    <button type="submit">
                        Post
                    </button>

                </form>


                <!-- DELETE -->

                <div class="vibe-post-footer">

                    <small>
                        ${formatDate(post.createdAt)}
                    </small>

                </div>

            </article>
        `;
    }

    /* ---------------------------------------------------------
       EVENTS
    --------------------------------------------------------- */

    function setupEvents() {

        const createButton =
            document.getElementById("vibeCreatePostButton");

        if (createButton) {
            createButton.addEventListener(
                "click",
                openComposer
            );
        }

        const mediaInput =
            document.getElementById("vibeMediaInput");

        if (mediaInput) {

            mediaInput.addEventListener(
                "change",
                handleMediaSelection
            );
        }

        const postForm =
            document.getElementById("vibePostForm");

        if (postForm) {

            postForm.addEventListener(
                "submit",
                handlePostSubmit
            );
        }

        const closeButton =
            document.getElementById("vibeCloseComposer");

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeComposer
            );
        }

        const composer =
            document.getElementById("vibeComposer");

        if (composer) {

            composer.addEventListener(
                "click",
                event => {

                    if (
                        event.target === composer
                    ) {
                        closeComposer();
                    }

                }
            );
        }
    }

    /* ---------------------------------------------------------
       POST EVENTS
    --------------------------------------------------------- */

    function attachPostEvents() {

        document
            .querySelectorAll(".vibe-post")
            .forEach(postElement => {

                const postId =
                    postElement.dataset.postId;

                postElement
                    .querySelectorAll(
                        "[data-action]"
                    )
                    .forEach(button => {

                        if (
                            button.dataset.action ===
                            "comment-form"
                        ) {
                            return;
                        }

                        button.addEventListener(
                            "click",
                            () => {

                                handleAction(
                                    button.dataset.action,
                                    postId
                                );

                            }
                        );

                    });

                const form =
                    postElement.querySelector(
                        ".vibe-comment-form"
                    );

                if (form) {

                    form.addEventListener(
                        "submit",
                        event => {

                            event.preventDefault();

                            const input =
                                form.querySelector(
                                    "input"
                                );

                            const text =
                                input.value.trim();

                            if (!text) {
                                return;
                            }

                            addComment(
                                postId,
                                text
                            );

                            input.value = "";

                        }
                    );
                }

            });
    }

    /* ---------------------------------------------------------
       ACTION HANDLER
    --------------------------------------------------------- */

    function handleAction(action, postId) {

        const post =
            posts.find(
                item => item.id === postId
            );

        if (!post) {
            return;
        }

        switch (action) {

            case "like":

                post.liked = !post.liked;

                post.likes +=
                    post.liked ? 1 : -1;

                break;


            case "save":

                post.saved = !post.saved;

                showMessage(
                    post.saved
                        ? "Post saved 🔖"
                        : "Post removed from saved"
                );

                break;


            case "share":

                sharePost(post);

                return;


            case "comment":

                const postElement =
                    document.querySelector(
                        `[data-post-id="${postId}"]`
                    );

                const commentInput =
                    postElement?.querySelector(
                        ".vibe-comment-form input"
                    );

                if (commentInput) {
                    commentInput.focus();
                }

                return;


            case "delete":

                deletePost(postId);

                return;

        }

        savePosts();

        renderFeed();
    }

    /* ---------------------------------------------------------
       COMMENTS
    --------------------------------------------------------- */

    function addComment(postId, text) {

        const post =
            posts.find(
                item => item.id === postId
            );

        if (!post) {
            return;
        }

        post.comments.push({
            username: "You",
            text
        });

        savePosts();

        renderFeed();

        showMessage("Comment added 💬");
    }

    /* ---------------------------------------------------------
       DELETE
    --------------------------------------------------------- */

    function deletePost(postId) {

        const confirmed =
            confirm(
                "Delete this post?"
            );

        if (!confirmed) {
            return;
        }

        posts =
            posts.filter(
                post => post.id !== postId
            );

        savePosts();

        renderFeed();

        showMessage("Post deleted");
    }

    /* ---------------------------------------------------------
       SHARE
    --------------------------------------------------------- */

    async function sharePost(post) {

        const shareData = {
            title: "VibeConnect",
            text: post.caption || "Check out this post on VibeConnect!"
        };

        try {

            if (
                navigator.share
            ) {

                await navigator.share(
                    shareData
                );

            } else {

                await navigator.clipboard.writeText(
                    shareData.text
                );

                showMessage(
                    "Post text copied 📋"
                );
            }

        } catch (error) {

            console.log(
                "Share cancelled"
            );

        }
    }

    /* ---------------------------------------------------------
       OPEN COMPOSER
    --------------------------------------------------------- */

    function openComposer() {

        const composer =
            document.getElementById(
                "vibeComposer"
            );

        if (!composer) {
            return;
        }

        composer.classList.remove(
            "hidden"
        );

        document.body.classList.add(
            "vibe-modal-open"
        );
    }

    /* ---------------------------------------------------------
       CLOSE COMPOSER
    --------------------------------------------------------- */

    function closeComposer() {

        const composer =
            document.getElementById(
                "vibeComposer"
            );

        if (!composer) {
            return;
        }

        composer.classList.add(
            "hidden"
        );

        document.body.classList.remove(
            "vibe-modal-open"
        );

        resetComposer();
    }

    /* ---------------------------------------------------------
       MEDIA SELECTION
    --------------------------------------------------------- */

    function handleMediaSelection(event) {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        if (
            !file.type.startsWith("image/") &&
            !file.type.startsWith("video/")
        ) {

            showMessage(
                "Please choose an image or video."
            );

            return;
        }

        const reader =
            new FileReader();

        reader.onload = () => {

            const preview =
                document.getElementById(
                    "vibeMediaPreview"
                );

            if (!preview) {
                return;
            }

            preview.innerHTML =
                file.type.startsWith("video/")

                    ? `
                        <video
                            src="${reader.result}"
                            controls
                        ></video>
                      `

                    : `
                        <img
                            src="${reader.result}"
                            alt="Preview"
                        >
                      `;

            preview.classList.add(
                "has-media"
            );

            preview.dataset.media =
                reader.result;

            preview.dataset.type =
                file.type.startsWith("video/")
                    ? "video"
                    : "image";
        };

        reader.readAsDataURL(file);
    }

    /* ---------------------------------------------------------
       SUBMIT POST
    --------------------------------------------------------- */

    function handlePostSubmit(event) {

        event.preventDefault();

        const preview =
            document.getElementById(
                "vibeMediaPreview"
            );

        if (
            !preview ||
            !preview.dataset.media
        ) {

            showMessage(
                "Add a photo or video first 📸"
            );

            return;
        }

        const caption =
            document.getElementById(
                "vibeCaption"
            )?.value.trim();

        const location =
            document.getElementById(
                "vibeLocation"
            )?.value.trim();

        createPost({
            media: preview.dataset.media,
            mediaType: preview.dataset.type,
            caption,
            location
        });

        closeComposer();
    }

    /* ---------------------------------------------------------
       RESET COMPOSER
    --------------------------------------------------------- */

    function resetComposer() {

        const form =
            document.getElementById(
                "vibePostForm"
            );

        if (form) {
            form.reset();
        }

        const preview =
            document.getElementById(
                "vibeMediaPreview"
            );

        if (preview) {

            preview.innerHTML = `
                <div class="vibe-preview-placeholder">
                    📸
                    <span>
                        Choose a photo or video
                    </span>
                </div>
            `;

            preview.classList.remove(
                "has-media"
            );

            delete preview.dataset.media;
            delete preview.dataset.type;
        }
    }

    /* ---------------------------------------------------------
       HELPERS
    --------------------------------------------------------- */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value || "";

        return div.innerHTML;
    }


    function formatDate(date) {

        const time =
            new Date(date);

        return time.toLocaleString(
            [],
            {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    function showMessage(message) {

        let toast =
            document.getElementById(
                "vibeToast"
            );

        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.id =
                "vibeToast";

            toast.className =
                "vibe-toast";

            document.body.appendChild(
                toast
            );
        }

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );

        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);
    }

    return {
        init,
        openComposer,
        closeComposer
    };

})();


/* =========================================================
   START HOME FEED
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        VibeHomeFeed.init();

    }
);

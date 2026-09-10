 /* =========================================================
   VIBECONNECT
   FEED MODULE
   STEP 3.1
========================================================= */

const VibeFeed = (() => {

    const STORAGE_KEY = "vibeconnect_feed";

    let posts = [];


    /* =====================================================
       INITIALIZE FEED
    ===================================================== */

    function init() {

        loadPosts();

        render();

        console.log("VibeConnect Feed initialized");
    }


    /* =====================================================
       LOAD POSTS
    ===================================================== */

    function loadPosts() {

        const savedPosts =
            localStorage.getItem(STORAGE_KEY);

        if (!savedPosts) {

            posts = [];

            return;
        }

        try {

            posts = JSON.parse(savedPosts);

        } catch (error) {

            console.error(
                "Could not load feed:",
                error
            );

            posts = [];
        }
    }


    /* =====================================================
       SAVE POSTS
    ===================================================== */

    function savePosts() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(posts)
        );
    }


    /* =====================================================
       CREATE POST
    ===================================================== */

    function createPost(data) {

        const newPost = {

            id:
                Date.now(),

            username:
                "You",

            avatar:
                "Y",

            caption:
                data.caption || "",

            image:
                data.image || "",

            video:
                data.video || "",

            location:
                data.location || "",

            likes:
                0,

            liked:
                false,

            saved:
                false,

            comments:
                [],

            createdAt:
                new Date().toISOString()
        };


        posts.unshift(newPost);

        savePosts();

        render();

        console.log(
            "New Vibe created:",
            newPost
        );
    }


    /* =====================================================
       RENDER FEED
    ===================================================== */

    function render() {

        const feedContainer =
            document.getElementById(
                "feedContainer"
            );


        if (!feedContainer) {

            console.warn(
                "feedContainer not found"
            );

            return;
        }


        if (posts.length === 0) {

            feedContainer.innerHTML = `

                <div class="feed-empty">

                    <div class="feed-empty-icon">
                        ✨
                    </div>

                    <h3>
                        Your Vibe starts here
                    </h3>

                    <p>
                        Create your first post
                        and share your moment.
                    </p>

                    <button
                        class="feed-create-button"
                        id="feedCreateButton"
                    >
                        + Create Post
                    </button>

                </div>

            `;

            connectCreateButton();

            return;
        }


        feedContainer.innerHTML =
            posts
                .map(post => createPostHTML(post))
                .join("");


        connectPostActions();
    }


    /* =====================================================
       POST HTML
    ===================================================== */

    function createPostHTML(post) {

        let media = "";


        if (post.image) {

            media = `

                <div class="feed-media">

                    <img
                        src="${post.image}"
                        alt="VibeConnect post"
                    >

                </div>

            `;
        }


        if (post.video) {

            media = `

                <div class="feed-media">

                    <video
                        controls
                        preload="metadata"
                    >

                        <source
                            src="${post.video}"
                        >

                        Your browser does not support
                        video playback.

                    </video>

                </div>

            `;
        }


        return `

            <article
                class="feed-post"
                data-post-id="${post.id}"
            >

                <!-- POST HEADER -->

                <div class="feed-post-header">

                    <div class="feed-user">

                        <div class="feed-avatar">
                            ${post.avatar}
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(post.username)}
                            </strong>

                            ${
                                post.location
                                    ? `
                                        <span>
                                            📍
                                            ${escapeHTML(
                                                post.location
                                            )}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>

                    </div>


                    <button
                        class="feed-more"
                        data-action="delete"
                        title="Delete post"
                    >
                        ⋯
                    </button>

                </div>


                <!-- POST MEDIA -->

                ${media}


                <!-- POST ACTIONS -->

                <div class="feed-actions">

                    <div class="feed-actions-left">

                        <button
                            class="
                                feed-action
                                ${
                                    post.liked
                                        ? "liked"
                                        : ""
                                }
                            "
                            data-action="like"
                        >
                            ${
                                post.liked
                                    ? "❤️"
                                    : "♡"
                            }
                        </button>


                        <button
                            class="feed-action"
                            data-action="comment"
                        >
                            💬
                        </button>


                        <button
                            class="feed-action"
                            data-action="share"
                        >
                            ↗
                        </button>

                    </div>


                    <button
                        class="
                            feed-action
                            ${
                                post.saved
                                    ? "saved"
                                    : ""
                            }
                        "
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

                <div class="feed-likes">

                    ${
                        post.likes === 0
                            ? "Be the first to like this"
                            : `${post.likes} ${
                                post.likes === 1
                                    ? "like"
                                    : "likes"
                            }`
                    }

                </div>


                <!-- CAPTION -->

                ${
                    post.caption
                        ? `
                            <div class="feed-caption">

                                <strong>
                                    ${escapeHTML(
                                        post.username
                                    )}
                                </strong>

                                ${escapeHTML(
                                    post.caption
                                )}

                            </div>
                          `
                        : ""
                }


                <!-- COMMENTS -->

                <div class="feed-comments">

                    ${
                        post.comments
                            .map(comment => `

                                <div class="feed-comment">

                                    <strong>
                                        ${escapeHTML(
                                            comment.username
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            comment.text
                                        )}
                                    </span>

                                </div>

                            `)
                            .join("")
                    }

                </div>


                <!-- COMMENT BOX -->

                <form
                    class="feed-comment-form"
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


                <!-- DATE -->

                <div class="feed-date">

                    ${formatDate(post.createdAt)}

                </div>

            </article>

        `;
    }


    /* =====================================================
       CONNECT CREATE BUTTON
    ===================================================== */

    function connectCreateButton() {

        const button =
            document.getElementById(
                "feedCreateButton"
            );


        if (!button) {

            return;
        }


        button.addEventListener(
            "click",
            () => {

                const createSection =
                    document.getElementById(
                        "section-create"
                    );


                if (createSection) {

                    document.querySelectorAll(
                        ".app-section"
                    ).forEach(section => {

                        section.classList.remove(
                            "active-section"
                        );

                    });


                    createSection.classList.add(
                        "active-section"
                    );
                }

            }
        );
    }


    /* =====================================================
       POST ACTIONS
    ===================================================== */

    function connectPostActions() {

        document
            .querySelectorAll(
                ".feed-post"
            )
            .forEach(postElement => {

                const postId =
                    Number(
                        postElement.dataset.postId
                    );


                postElement
                    .querySelectorAll(
                        "[data-action]"
                    )
                    .forEach(button => {

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


                const commentForm =
                    postElement.querySelector(
                        ".feed-comment-form"
                    );


                if (commentForm) {

                    commentForm.addEventListener(
                        "submit",
                        event => {

                            event.preventDefault();


                            const input =
                                commentForm.querySelector(
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


    /* =====================================================
       ACTION HANDLER
    ===================================================== */

    function handleAction(
        action,
        postId
    ) {

        const post =
            posts.find(
                item =>
                    item.id === postId
            );


        if (!post) {

            return;
        }


        switch (action) {


            case "like":

                post.liked =
                    !post.liked;

                post.likes +=
                    post.liked
                        ? 1
                        : -1;

                savePosts();

                render();

                break;


            case "save":

                post.saved =
                    !post.saved;

                savePosts();

                render();

                break;


            case "comment":

                const postElement =
                    document.querySelector(
                        `[data-post-id="${postId}"]`
                    );


                const input =
                    postElement?.querySelector(
                        ".feed-comment-form input"
                    );


                if (input) {

                    input.focus();
                }

                break;


            case "share":

                sharePost(post);

                break;


            case "delete":

                deletePost(postId);

                break;

        }
    }


    /* =====================================================
       COMMENTS
    ===================================================== */

    function addComment(
        postId,
        text
    ) {

        const post =
            posts.find(
                item =>
                    item.id === postId
            );


        if (!post) {

            return;
        }


        post.comments.push({

            username:
                "You",

            text:
                text

        });


        savePosts();

        render();
    }


    /* =====================================================
       DELETE POST
    ===================================================== */

    function deletePost(
        postId
    ) {

        const confirmed =
            window.confirm(
                "Delete this post?"
            );


        if (!confirmed) {

            return;
        }


        posts =
            posts.filter(
                post =>
                    post.id !== postId
            );


        savePosts();

        render();
    }


    /* =====================================================
       SHARE
    ===================================================== */

    async function sharePost(post) {

        const shareText =
            post.caption ||
            "Check out this Vibe on VibeConnect!";


        try {

            if (
                navigator.share
            ) {

                await navigator.share({

                    title:
                        "VibeConnect",

                    text:
                        shareText

                });

            } else {

                await navigator.clipboard.writeText(
                    shareText
                );

                alert(
                    "Post text copied!"
                );
            }

        } catch (error) {

            console.log(
                "Share cancelled"
            );
        }
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
        value
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.textContent =
            value || "";


        return element.innerHTML;
    }


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    function formatDate(
        date
    ) {

        return new Date(
            date
        ).toLocaleString(
            [],
            {
                day:
                    "numeric",

                month:
                    "short",

                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        );
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    return {

        init,

        createPost,

        render

    };

})();


/* =========================================================
   START FEED
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        VibeFeed.init();

    }
);

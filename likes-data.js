"use strict";

/* =========================================================
VIBECONNECT
REAL LIKES, COMMENTS & SAVES
STEP 24
========================================================= */

/* =========================================================
DOM
========================================================= */

const backButton =
document.getElementById("backButton");

const connectionIcon =
document.getElementById("connectionIcon");

const connectionTitle =
document.getElementById("connectionTitle");

const connectionMessage =
document.getElementById("connectionMessage");

const connectionBadge =
document.getElementById("connectionBadge");

const loginRequired =
document.getElementById("loginRequired");

const interactionContent =
document.getElementById("interactionContent");

const loginButton =
document.getElementById("loginButton");

const refreshButton =
document.getElementById("refreshButton");

const postsList =
document.getElementById("postsList");

const emptyState =
document.getElementById("emptyState");

const loadingState =
document.getElementById("loadingState");

const commentModal =
document.getElementById("commentModal");

const closeModalButton =
document.getElementById("closeModalButton");

const commentsList =
document.getElementById("commentsList");

const commentForm =
document.getElementById("commentForm");

const commentText =
document.getElementById("commentText");

const commentCounter =
document.getElementById("commentCounter");

const commentButton =
document.getElementById("commentButton");

const toast =
document.getElementById("toast");

/* =========================================================
STATE
========================================================= */

let supabaseClient =
null;

let currentUser =
null;

let selectedPostId =
null;

let toastTimer =
null;

/* =========================================================
TOAST
========================================================= */

function showToast(
message
) {

```
clearTimeout(
    toastTimer
);


toast.textContent =
    message;


toast.classList.add(
    "show"
);


toastTimer =
    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );
```

}

/* =========================================================
SUPABASE
========================================================= */

function getSupabaseClient() {

```
if (
    window.vibeSupabase &&
    window.vibeSupabase.client
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
```

}

/* =========================================================
CONNECTION
========================================================= */

function setConnection(
type,
icon,
title,
message,
badge
) {

```
connectionIcon.textContent =
    icon;

connectionTitle.textContent =
    title;

connectionMessage.textContent =
    message;

connectionBadge.textContent =
    badge;

connectionBadge.className =
    "connection-badge";


if (type) {

    connectionBadge.classList.add(
        type
    );
}
```

}

/* =========================================================
LOGIN STATE
========================================================= */

function showLoginState() {

```
loginRequired.classList.remove(
    "hidden"
);

interactionContent.classList.add(
    "hidden"
);
```

}

function showInteractionState() {

```
loginRequired.classList.add(
    "hidden"
);

interactionContent.classList.remove(
    "hidden"
);
```

}

/* =========================================================
GET USER
========================================================= */

async function getCurrentUser() {

```
const result =
    await supabaseClient
        .auth
        .getUser();


if (result.error) {

    throw result.error;
}


return result.data?.user ||
    null;
```

}

/* =========================================================
INITIALIZE
========================================================= */

async function initialize() {

```
setConnection(
    "",
    "⏳",
    "Connecting...",
    "Checking your Supabase session.",
    "CHECKING"
);


supabaseClient =
    getSupabaseClient();


if (!supabaseClient) {

    setConnection(
        "warning",
        "⚠️",
        "Supabase is not configured",
        "Configure your Supabase connection in supabase.js.",
        "SETUP NEEDED"
    );

    showLoginState();

    return;
}


try {

    currentUser =
        await getCurrentUser();


    if (!currentUser) {

        setConnection(
            "warning",
            "🔐",
            "Login required",
            "Sign in to interact with posts.",
            "LOGIN REQUIRED"
        );

        showLoginState();

        return;
    }


    showInteractionState();


    setConnection(
        "connected",
        "✓",
        "Database connected",
        "Likes, comments and saves are ready.",
        "READY"
    );


    await loadPosts();


} catch (error) {

    console.error(
        "Initialization error:",
        error
    );


    setConnection(
        "error",
        "⚠️",
        "Connection error",
        friendlyError(
            error
        ),
        "ERROR"
    );

    showLoginState();
}
```

}

/* =========================================================
LOAD POSTS
========================================================= */

async function loadPosts() {

```
showLoading(
    true
);


try {

    /*
     * First load posts.
     */

    const postsResult =
        await supabaseClient
            .from("posts")
            .select(
                `
                id,
                user_id,
                content,
                media_url,
                media_type,
                created_at,
                profiles (
                    display_name,
                    username,
                    avatar_url
                )
                `
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
            .limit(50);


    if (postsResult.error) {

        throw postsResult.error;
    }


    const posts =
        postsResult.data ||
        [];


    if (!posts.length) {

        renderEmpty();

        return;
    }


    /*
     * Then load interaction data.
     */

    const postIds =
        posts.map(
            post => post.id
        );


    const [
        likesResult,
        commentsResult,
        savesResult
    ] =
        await Promise.all([

            supabaseClient
                .from("likes")
                .select(
                    "post_id, user_id"
                )
                .in(
                    "post_id",
                    postIds
                ),

            supabaseClient
                .from("comments")
                .select(
                    "id, post_id, user_id"
                )
                .in(
                    "post_id",
                    postIds
                ),

            supabaseClient
                .from("saved_posts")
                .select(
                    "post_id, user_id"
                )
                .in(
                    "post_id",
                    postIds
                )

        ]);


    if (likesResult.error) {

        throw likesResult.error;
    }


    if (commentsResult.error) {

        throw commentsResult.error;
    }


    if (savesResult.error) {

        throw savesResult.error;
    }


    const likes =
        likesResult.data ||
        [];


    const comments =
        commentsResult.data ||
        [];


    const saves =
        savesResult.data ||
        [];


    const enrichedPosts =
        posts.map(
            post => {

                const postLikes =
                    likes.filter(
                        like =>
                            like.post_id ===
                            post.id
                    );


                const postComments =
                    comments.filter(
                        comment =>
                            comment.post_id ===
                            post.id
                    );


                const postSaves =
                    saves.filter(
                        save =>
                            save.post_id ===
                            post.id
                    );


                return {

                    ...post,

                    likeCount:
                        postLikes.length,

                    commentCount:
                        postComments.length,

                    saveCount:
                        postSaves.length,

                    liked:
                        postLikes.some(
                            like =>
                                like.user_id ===
                                currentUser.id
                        ),

                    saved:
                        postSaves.some(
                            save =>
                                save.user_id ===
                                currentUser.id
                        )
                };
            }
        );


    renderPosts(
        enrichedPosts
    );


    setConnection(
        "connected",
        "✓",
        "Interactions loaded",
        "Your feed is synchronized with Supabase.",
        "LIVE"
    );


} catch (error) {

    console.error(
        "Load error:",
        error
    );


    postsList.innerHTML =
        "";

    emptyState.classList.add(
        "hidden"
    );


    setConnection(
        "error",
        "⚠️",
        "Could not load interactions",
        friendlyError(
            error
        ),
        "ERROR"
    );


    showToast(
        friendlyError(
            error
        )
    );


} finally {

    showLoading(
        false
    );
}
```

}

/* =========================================================
RENDER POSTS
========================================================= */

function renderPosts(
posts
) {

```
postsList.innerHTML =
    "";


emptyState.classList.add(
    "hidden"
);


posts.forEach(
    post => {

        postsList.appendChild(
            createPostElement(
                post
            )
        );
    }
);
```

}

/* =========================================================
EMPTY
========================================================= */

function renderEmpty() {

```
postsList.innerHTML =
    "";

emptyState.classList.remove(
    "hidden"
);
```

}

/* =========================================================
CREATE POST
========================================================= */

function createPostElement(
post
) {

```
const article =
    document.createElement(
        "article"
    );


article.className =
    "feed-post";


const profile =
    Array.isArray(
        post.profiles
    )
        ? post.profiles[0]
        : post.profiles;


const name =
    profile?.display_name ||
    "VibeConnect User";


const username =
    profile?.username ||
    "user";


const avatar =
    profile?.avatar_url ||
    "";


/* =====================================
   HEADER
====================================== */

const header =
    document.createElement(
        "div"
    );

header.className =
    "post-header";


const avatarElement =
    document.createElement(
        "div"
    );

avatarElement.className =
    "post-avatar";


setAvatar(
    avatarElement,
    avatar,
    name
);


const author =
    document.createElement(
        "div"
    );

author.className =
    "post-author";


const authorName =
    document.createElement(
        "strong"
    );

authorName.textContent =
    name;


const authorUsername =
    document.createElement(
        "span"
    );

authorUsername.textContent =
    `@${username.replace(/^@/, "")}`;


author.appendChild(
    authorName
);

author.appendChild(
    authorUsername
);


const date =
    document.createElement(
        "time"
    );

date.className =
    "post-date";

date.textContent =
    formatRelativeDate(
        post.created_at
    );


header.appendChild(
    avatarElement
);

header.appendChild(
    author
);

header.appendChild(
    date
);


/* =====================================
   BODY
====================================== */

const body =
    document.createElement(
        "div"
    );

body.className =
    "post-body";


body.textContent =
    post.content ||
    "";


/* =====================================
   INTERACTION BAR
====================================== */

const interactionBar =
    document.createElement(
        "div"
    );

interactionBar.className =
    "interaction-bar";


/* LIKE */

const likeButton =
    document.createElement(
        "button"
    );

likeButton.type =
    "button";

likeButton.className =
    "interaction-button";


if (post.liked) {

    likeButton.classList.add(
        "liked"
    );
}


likeButton.textContent =
    `${post.liked ? "❤️" : "♡"} Like ${post.likeCount}`;


likeButton.addEventListener(
    "click",
    () => {

        toggleLike(
            post.id,
            post.liked
        );
    }
);


/* COMMENT */

const commentButton =
    document.createElement(
        "button"
    );

commentButton.type =
    "button";

commentButton.className =
    "interaction-button";


commentButton.textContent =
    `💬 Comment ${post.commentCount}`;


commentButton.addEventListener(
    "click",
    () => {

        openComments(
            post.id
        );
    }
);


/* SAVE */

const saveButton =
    document.createElement(
        "button"
    );

saveButton.type =
    "button";

saveButton.className =
    "interaction-button";


if (post.saved) {

    saveButton.classList.add(
        "saved"
    );
}


saveButton.textContent =
    `${post.saved ? "🔖" : "☆"} Save ${post.saveCount}`;


saveButton.addEventListener(
    "click",
    () => {

        toggleSave(
            post.id,
            post.saved
        );
    }
);


interactionBar.appendChild(
    likeButton
);

interactionBar.appendChild(
    commentButton
);

interactionBar.appendChild(
    saveButton
);


article.appendChild(
    header
);

article.appendChild(
    body
);

article.appendChild(
    interactionBar
);


return article;
```

}

/* =========================================================
LIKE / UNLIKE
========================================================= */

async function toggleLike(
postId,
currentlyLiked
) {

```
try {

    if (currentlyLiked) {

        const result =
            await supabaseClient
                .from("likes")
                .delete()
                .eq(
                    "post_id",
                    postId
                )
                .eq(
                    "user_id",
                    currentUser.id
                );


        if (result.error) {

            throw result.error;
        }


        showToast(
            "Like removed."
        );


    } else {

        const result =
            await supabaseClient
                .from("likes")
                .insert({

                    post_id:
                        postId,

                    user_id:
                        currentUser.id

                });


        if (result.error) {

            throw result.error;
        }


        showToast(
            "Post liked! ❤️"
        );
    }


    await loadPosts();


} catch (error) {

    console.error(
        "Like error:",
        error
    );


    showToast(
        friendlyError(
            error
        )
    );
}
```

}

/* =========================================================
SAVE / UNSAVE
========================================================= */

async function toggleSave(
postId,
currentlySaved
) {

```
try {

    if (currentlySaved) {

        const result =
            await supabaseClient
                .from("saved_posts")
                .delete()
                .eq(
                    "post_id",
                    postId
                )
                .eq(
                    "user_id",
                    currentUser.id
                );


        if (result.error) {

            throw result.error;
        }


        showToast(
            "Post removed from saves."
        );


    } else {

        const result =
            await supabaseClient
                .from("saved_posts")
                .insert({

                    post_id:
                        postId,

                    user_id:
                        currentUser.id

                });


        if (result.error) {

            throw result.error;
        }


        showToast(
            "Post saved! 🔖"
        );
    }


    await loadPosts();


} catch (error) {

    console.error(
        "Save error:",
        error
    );


    showToast(
        friendlyError(
            error
        )
    );
}
```

}

/* =========================================================
OPEN COMMENTS
========================================================= */

async function openComments(
postId
) {

```
selectedPostId =
    postId;


commentModal.classList.remove(
    "hidden"
);


commentText.value =
    "";

updateCommentCounter();


await loadComments(
    postId
);


setTimeout(
    () => {

        commentText.focus();

    },
    100
);
```

}

/* =========================================================
CLOSE COMMENTS
========================================================= */

function closeComments() {

```
selectedPostId =
    null;

commentModal.classList.add(
    "hidden"
);

commentsList.innerHTML =
    "";
```

}

closeModalButton.addEventListener(
"click",
closeComments
);

commentModal.addEventListener(
"click",
event => {

```
    if (
        event.target ===
        commentModal
    ) {

        closeComments();
    }
}
```

);

/* =========================================================
LOAD COMMENTS
========================================================= */

async function loadComments(
postId
) {

```
commentsList.innerHTML =
    `<div class="loading-state">Loading comments...</div>`;


try {

    const result =
        await supabaseClient
            .from("comments")
            .select(
                `
                id,
                post_id,
                user_id,
                content,
                created_at,
                profiles (
                    display_name,
                    username,
                    avatar_url
                )
                `
            )
            .eq(
                "post_id",
                postId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (result.error) {

        throw result.error;
    }


    const comments =
        result.data ||
        [];


    renderComments(
        comments
    );


} catch (error) {

    console.error(
        "Comment loading error:",
        error
    );


    commentsList.innerHTML =
        "";


    const errorElement =
        document.createElement(
            "p"
        );

    errorElement.className =
        "loading-state";

    errorElement.textContent =
        friendlyError(
            error
        );


    commentsList.appendChild(
        errorElement
    );
}
```

}

/* =========================================================
RENDER COMMENTS
========================================================= */

function renderComments(
comments
) {

```
commentsList.innerHTML =
    "";


if (!comments.length) {

    const empty =
        document.createElement(
            "p"
        );

    empty.className =
        "loading-state";

    empty.textContent =
        "No comments yet. Start the conversation! 💬";


    commentsList.appendChild(
        empty
    );

    return;
}


comments.forEach(
    comment => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "comment-item";


        const profile =
            Array.isArray(
                comment.profiles
            )
                ? comment.profiles[0]
                : comment.profiles;


        const name =
            profile?.display_name ||
            "VibeConnect User";


        const username =
            profile?.username ||
            "user";


        const avatar =
            profile?.avatar_url ||
            "";


        const avatarElement =
            document.createElement(
                "div"
            );

        avatarElement.className =
            "comment-avatar";


        setAvatar(
            avatarElement,
            avatar,
            name
        );


        const content =
            document.createElement(
                "div"
            );

        content.className =
            "comment-content";


        const author =
            document.createElement(
                "strong"
            );

        author.textContent =
            name;


        const authorUsername =
            document.createElement(
                "span"
            );

        authorUsername.textContent =
            `@${username.replace(/^@/, "")} · ${formatRelativeDate(comment.created_at)}`;


        const text =
            document.createElement(
                "p"
            );

        text.textContent =
            comment.content ||
            "";


        content.appendChild(
            author
        );

        content.appendChild(
            authorUsername
        );

        content.appendChild(
            text
        );


        item.appendChild(
            avatarElement
        );

        item.appendChild(
            content
        );


        if (
            comment.user_id ===
            currentUser.id
        ) {

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.type =
                "button";

            deleteButton.className =
                "comment-delete";

            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteComment(
                        comment.id
                    );
                }
            );


            item.appendChild(
                deleteButton
            );
        }


        commentsList.appendChild(
            item
        );
    }
);
```

}

/* =========================================================
ADD COMMENT
========================================================= */

commentForm.addEventListener(
"submit",
async event => {

```
    event.preventDefault();


    if (
        !selectedPostId ||
        !currentUser
    ) {

        return;
    }


    const content =
        commentText.value.trim();


    if (!content) {

        showToast(
            "Write a comment first."
        );

        return;
    }


    if (
        content.length >
        1000
    ) {

        showToast(
            "Comment is too long."
        );

        return;
    }


    commentButton.disabled =
        true;

    commentButton.textContent =
        "⏳ Posting...";


    try {

        const result =
            await supabaseClient
                .from("comments")
                .insert({

                    post_id:
                        selectedPostId,

                    user_id:
                        currentUser.id,

                    content:
                        content

                });


        if (result.error) {

            throw result.error;
        }


        commentText.value =
            "";

        updateCommentCounter();


        showToast(
            "Comment added! 💬"
        );


        await loadComments(
            selectedPostId
        );


        await loadPosts();


    } catch (error) {

        console.error(
            "Comment error:",
            error
        );


        showToast(
            friendlyError(
                error
            )
        );


    } finally {

        commentButton.disabled =
            false;

        commentButton.textContent =
            "💬 Comment";
    }
}
```

);

/* =========================================================
DELETE COMMENT
========================================================= */

async function deleteComment(
commentId
) {

```
const confirmed =
    window.confirm(
        "Delete this comment?"
    );


if (!confirmed) {

    return;
}


try {

    const result =
        await supabaseClient
            .from("comments")
            .delete()
            .eq(
                "id",
                commentId
            )
            .eq(
                "user_id",
                currentUser.id
            );


    if (result.error) {

        throw result.error;
    }


    showToast(
        "Comment deleted."
    );


    if (selectedPostId) {

        await loadComments(
            selectedPostId
        );
    }


    await loadPosts();


} catch (error) {

    console.error(
        "Delete comment error:",
        error
    );


    showToast(
        friendlyError(
            error
        )
    );
}
```

}

/* =========================================================
COMMENT COUNTER
========================================================= */

function updateCommentCounter() {

```
commentCounter.textContent =
    `${commentText.value.length} / 1000`;
```

}

commentText.addEventListener(
"input",
updateCommentCounter
);

/* =========================================================
AVATAR
========================================================= */

function setAvatar(
element,
url,
name
) {

```
element.innerHTML =
    "";


if (url) {

    const image =
        document.createElement(
            "img"
        );

    image.src =
        url;

    image.alt =
        "Profile picture";


    image.addEventListener(
        "error",
        () => {

            element.textContent =
                getInitial(
                    name
                );
        }
    );


    element.appendChild(
        image
    );

    return;
}


element.textContent =
    getInitial(
        name
    );
```

}

function getInitial(
name
) {

```
const value =
    String(
        name || "V"
    ).trim();


return value
    ? value.charAt(0).toUpperCase()
    : "V";
```

}

/* =========================================================
DATES
========================================================= */

function formatRelativeDate(
value
) {

```
if (!value) {

    return "";
}


const date =
    new Date(value);


const now =
    new Date();


const seconds =
    Math.floor(
        (now - date) / 1000
    );


if (seconds < 60) {

    return "just now";
}


const minutes =
    Math.floor(
        seconds / 60
    );


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


const days =
    Math.floor(
        hours / 24
    );


if (days < 7) {

    return `${days}d ago`;
}


return new Intl.DateTimeFormat(
    undefined,
    {
        month: "short",
        day: "numeric",
        year: "numeric"
    }
).format(
    date
);
```

}

/* =========================================================
LOADING
========================================================= */

function showLoading(
visible
) {

```
if (visible) {

    loadingState.classList.remove(
        "hidden"
    );

} else {

    loadingState.classList.add(
        "hidden"
    );
}
```

}

/* =========================================================
REFRESH
========================================================= */

refreshButton.addEventListener(
"click",
async () => {

```
    refreshButton.disabled =
        true;

    refreshButton.textContent =
        "↻ Loading...";


    await loadPosts();


    refreshButton.disabled =
        false;

    refreshButton.textContent =
        "↻ Refresh";
}
```

);

/* =========================================================
LOGIN
========================================================= */

loginButton.addEventListener(
"click",
() => {

```
    window.location.href =
        "auth.html";
}
```

);

/* =========================================================
BACK
========================================================= */

backButton.addEventListener(
"click",
() => {

```
    if (
        document.referrer &&
        document.referrer.includes(
            window.location.origin
        )
    ) {

        history.back();

    } else {

        window.location.href =
            "app.html";
    }
}
```

);

/* =========================================================
KEYBOARD
========================================================= */

document.addEventListener(
"keydown",
event => {

```
    if (
        event.key ===
        "Escape"
    ) {

        closeComments();
    }
}
```

);

/* =========================================================
FRIENDLY ERROR
========================================================= */

function friendlyError(
error
) {

```
const message =
    String(
        error?.message ||
        error ||
        ""
    );


const lower =
    message.toLowerCase();


if (
    lower.includes(
        "relation"
    )
) {

    return "One of the Step 24 database tables is missing. Make sure database.sql was executed.";
}


if (
    lower.includes(
        "row-level security"
    ) ||
    lower.includes(
        "violates row-level security"
    )
) {

    return "Supabase blocked this action because of Row Level Security.";
}


if (
    lower.includes(
        "duplicate"
    ) ||
    lower.includes(
        "unique"
    )
) {

    return "This interaction already exists.";
}


if (
    lower.includes(
        "jwt"
    ) ||
    lower.includes(
        "not authenticated"
    )
) {

    return "Your session may have expired. Please sign in again.";
}


return message ||
    "Something went wrong. Please try again.";
```

}

/* =========================================================
AUTH LISTENER
========================================================= */

function setupAuthListener() {

```
if (!supabaseClient) {

    return;
}


supabaseClient
    .auth
    .onAuthStateChange(
        async (
            event,
            session
        ) => {

            if (
                event ===
                "SIGNED_OUT"
            ) {

                currentUser =
                    null;

                showLoginState();

                closeComments();

                return;
            }


            if (
                event ===
                    "SIGNED_IN" ||
                event ===
                    "TOKEN_REFRESHED"
            ) {

                currentUser =
                    session?.user ||
                    null;


                if (
                    currentUser
                ) {

                    showInteractionState();

                    await loadPosts();
                }
            }
        }
    );
```

}

/* =========================================================
START
========================================================= */

document.addEventListener(
"DOMContentLoaded",
async () => {

```
    updateCommentCounter();

    await initialize();

    setupAuthListener();

}
```

);

/* =========================================================
PUBLIC API
========================================================= */

window.vibeConnectInteractions = {

```
refresh() {

    return loadPosts();
},

openComments(
    postId
) {

    return openComments(
        postId
    );
},

getCurrentUser() {

    return currentUser;
}
```

};

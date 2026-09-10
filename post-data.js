"use strict";

/* =========================================================
VIBECONNECT
REAL POSTS & FEED
STEP 23
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

const postContent =
document.getElementById("postContent");

const loginButton =
document.getElementById("loginButton");

const postText =
document.getElementById("postText");

const postCounter =
document.getElementById("postCounter");

const publishButton =
document.getElementById("publishButton");

const refreshButton =
document.getElementById("refreshButton");

const postsList =
document.getElementById("postsList");

const emptyState =
document.getElementById("emptyState");

const loadingState =
document.getElementById("loadingState");

const composerName =
document.getElementById("composerName");

const composerUsername =
document.getElementById("composerUsername");

const composerAvatar =
document.getElementById("composerAvatar");

const toast =
document.getElementById("toast");

/* =========================================================
STATE
========================================================= */

let supabaseClient =
null;

let currentUser =
null;

let currentProfile =
null;

let toastTimer =
null;

/* =========================================================
TOAST
========================================================= */

function showToast(message) {

```
clearTimeout(toastTimer);

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
SUPABASE CLIENT
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

postContent.classList.add(
    "hidden"
);
```

}

function showPostState() {

```
loginRequired.classList.add(
    "hidden"
);

postContent.classList.remove(
    "hidden"
);
```

}

/* =========================================================
GET CURRENT USER
========================================================= */

async function getCurrentUser() {

```
if (!supabaseClient) {

    return null;
}


const result =
    await supabaseClient
        .auth
        .getUser();


if (result.error) {

    throw result.error;
}


return result.data?.user || null;
```

}

/* =========================================================
LOAD CURRENT PROFILE
========================================================= */

async function loadCurrentProfile() {

```
if (
    !supabaseClient ||
    !currentUser
) {

    return;
}


const result =
    await supabaseClient
        .from("profiles")
        .select(
            [
                "id",
                "display_name",
                "username",
                "avatar_url"
            ].join(", ")
        )
        .eq(
            "id",
            currentUser.id
        )
        .maybeSingle();


if (result.error) {

    console.warn(
        "Profile lookup failed:",
        result.error.message
    );

    currentProfile = null;

    applyUserFallback();

    return;
}


currentProfile =
    result.data;


applyUserFallback();
```

}

/* =========================================================
USER FALLBACK
========================================================= */

function applyUserFallback() {

```
const metadata =
    currentUser?.user_metadata ||
    {};


const name =
    currentProfile?.display_name ||
    metadata.display_name ||
    "You";


const username =
    currentProfile?.username ||
    metadata.username ||
    "username";


const avatar =
    currentProfile?.avatar_url ||
    "";


composerName.textContent =
    name;


composerUsername.textContent =
    `@${username.replace(/^@/, "")}`;


setAvatar(
    composerAvatar,
    avatar,
    name
);
```

}

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
const clean =
    String(name || "V")
        .trim();


return clean
    ? clean
        .charAt(0)
        .toUpperCase()
    : "V";
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
    "Checking your VibeConnect account.",
    "CHECKING"
);


supabaseClient =
    getSupabaseClient();


if (!supabaseClient) {

    setConnection(
        "warning",
        "⚠️",
        "Supabase is not configured",
        "Configure your Supabase project in supabase.js first.",
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
            "Sign in to create and view real posts.",
            "LOGIN REQUIRED"
        );

        showLoginState();

        return;
    }


    showPostState();


    await loadCurrentProfile();


    setConnection(
        "connected",
        "✓",
        "Database connected",
        "Your real VibeConnect feed is ready.",
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
if (
    !supabaseClient
) {

    return;
}


showLoading(
    true
);


try {

    const result =
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
                updated_at,
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


    if (result.error) {

        throw result.error;
    }


    const posts =
        result.data || [];


    renderPosts(
        posts
    );


    setConnection(
        "connected",
        "✓",
        "Feed updated",
        `${posts.length} post${posts.length === 1 ? "" : "s"} loaded from Supabase.`,
        "LIVE"
    );


} catch (error) {

    console.error(
        "Post loading error:",
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
        "Could not load posts",
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


if (!posts.length) {

    emptyState.classList.remove(
        "hidden"
    );

    return;
}


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
CREATE POST ELEMENT
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


const metadata =
    currentUser?.user_metadata ||
    {};


const name =
    profile?.display_name ||
    "VibeConnect User";


const username =
    profile?.username ||
    "user";


const avatar =
    profile?.avatar_url ||
    "";


const isOwner =
    currentUser &&
    post.user_id ===
        currentUser.id;


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
   FOOTER
====================================== */

const footer =
    document.createElement(
        "div"
    );

footer.className =
    "post-footer";


const meta =
    document.createElement(
        "span"
    );

meta.className =
    "post-meta";


meta.textContent =
    formatFullDate(
        post.created_at
    );


const actions =
    document.createElement(
        "div"
    );

actions.className =
    "post-actions";


if (isOwner) {

    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.type =
        "button";

    deleteButton.className =
        "post-action delete";

    deleteButton.textContent =
        "🗑 Delete";


    deleteButton.addEventListener(
        "click",
        () => {

            deletePost(
                post.id
            );
        }
    );


    actions.appendChild(
        deleteButton
    );
}


footer.appendChild(
    meta
);

footer.appendChild(
    actions
);


article.appendChild(
    header
);

article.appendChild(
    body
);

article.appendChild(
    footer
);


return article;
```

}

/* =========================================================
PUBLISH POST
========================================================= */

publishButton.addEventListener(
"click",
async () => {

```
    if (
        !supabaseClient ||
        !currentUser
    ) {

        showToast(
            "Please sign in first."
        );

        return;
    }


    const content =
        postText.value.trim();


    if (!content) {

        showToast(
            "Write something before publishing."
        );

        postText.focus();

        return;
    }


    if (
        content.length >
        2000
    ) {

        showToast(
            "Your post is too long."
        );

        return;
    }


    publishButton.disabled =
        true;

    publishButton.textContent =
        "⏳ Publishing...";


    try {

        const result =
            await supabaseClient
                .from("posts")
                .insert({

                    user_id:
                        currentUser.id,

                    content:
                        content

                })
                .select()
                .single();


        if (result.error) {

            throw result.error;
        }


        postText.value =
            "";

        updateCounter();


        showToast(
            "Post published successfully! 🎉"
        );


        setConnection(
            "connected",
            "✓",
            "Post published",
            "Your post is now stored in Supabase.",
            "LIVE"
        );


        await loadPosts();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Publish error:",
            error
        );


        showToast(
            friendlyError(
                error
            )
        );


        setConnection(
            "error",
            "⚠️",
            "Post failed",
            friendlyError(
                error
            ),
            "ERROR"
        );


    } finally {

        publishButton.disabled =
            false;

        publishButton.textContent =
            "🚀 Publish Post";
    }
}
```

);

/* =========================================================
DELETE POST
========================================================= */

async function deletePost(
postId
) {

```
if (
    !supabaseClient ||
    !currentUser
) {

    return;
}


const confirmed =
    window.confirm(
        "Delete this post?"
    );


if (!confirmed) {

    return;
}


try {

    const result =
        await supabaseClient
            .from("posts")
            .delete()
            .eq(
                "id",
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
        "Post deleted."
    );


    await loadPosts();


} catch (error) {

    console.error(
        "Delete error:",
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
CHARACTER COUNTER
========================================================= */

function updateCounter() {

```
postCounter.textContent =
    `${postText.value.length} / 2000`;
```

}

postText.addEventListener(
"input",
updateCounter
);

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
RELATIVE DATE
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

    return "Just now";
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


return formatFullDate(
    value
);
```

}

/* =========================================================
FULL DATE
========================================================= */

function formatFullDate(
value
) {

```
if (!value) {

    return "";
}


const date =
    new Date(value);


if (
    Number.isNaN(
        date.getTime()
    )
) {

    return "";
}


return new Intl.DateTimeFormat(
    undefined,
    {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }
).format(
    date
);
```

}

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
    ) &&
    lower.includes(
        "posts"
    )
) {

    return "The posts table is missing. Run database.sql in Supabase SQL Editor.";
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
        "jwt"
    ) ||
    lower.includes(
        "not authenticated"
    )
) {

    return "Your login session may have expired. Please sign in again.";
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

                    showPostState();

                    await loadCurrentProfile();

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
    updateCounter();

    await initialize();

    setupAuthListener();
}
```

);

/* =========================================================
PUBLIC API
========================================================= */

window.vibeConnectRealPosts = {

```
refresh() {

    return loadPosts();
},

getCurrentUser() {

    return currentUser;
}
```

};

"use strict";

/* =========================================================
VIBECONNECT REAL PROFILE
STEP 22
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

const profileContent =
document.getElementById("profileContent");

const loginButton =
document.getElementById("loginButton");

const profileForm =
document.getElementById("profileForm");

const displayNameInput =
document.getElementById("displayName");

const usernameInput =
document.getElementById("username");

const bioInput =
document.getElementById("bio");

const websiteInput =
document.getElementById("website");

const locationInput =
document.getElementById("location");

const birthdayInput =
document.getElementById("birthday");

const avatarUrlInput =
document.getElementById("avatarUrl");

const coverUrlInput =
document.getElementById("coverUrl");

const bioCount =
document.getElementById("bioCount");

const saveButton =
document.getElementById("saveButton");

const resetButton =
document.getElementById("resetButton");

const logoutButton =
document.getElementById("logoutButton");

const profileName =
document.getElementById("profileName");

const profileUsername =
document.getElementById("profileUsername");

const profileBio =
document.getElementById("profileBio");

const avatarPreview =
document.getElementById("avatarPreview");

const coverPreview =
document.getElementById("coverPreview");

const previewAvatar =
document.getElementById("previewAvatar");

const previewName =
document.getElementById("previewName");

const previewUsername =
document.getElementById("previewUsername");

const previewBio =
document.getElementById("previewBio");

const previewLocation =
document.getElementById("previewLocation");

const previewWebsite =
document.getElementById("previewWebsite");

const accountEmail =
document.getElementById("accountEmail");

const accountId =
document.getElementById("accountId");

const accountCreated =
document.getElementById("accountCreated");

const profileUpdated =
document.getElementById("profileUpdated");

const toast =
document.getElementById("toast");

/* =========================================================
STATE
========================================================= */

let supabaseClient =
null;

let currentUser =
null;

let originalProfile =
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
    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3000);
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
    typeof window.vibeSupabase
        .from === "function"
) {

    return window.vibeSupabase;
}


return null;
```

}

/* =========================================================
CONNECTION STATE
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
GET SESSION
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

    console.warn(
        "Could not get Supabase user:",
        result.error.message
    );

    return null;
}


return result.data?.user || null;
```

}

/* =========================================================
INITIALIZE SUPABASE
========================================================= */

async function initialize() {

```
setConnection(
    "",
    "⏳",
    "Checking Supabase...",
    "Connecting to your VibeConnect account.",
    "CHECKING"
);


supabaseClient =
    getSupabaseClient();


if (!supabaseClient) {

    setConnection(
        "warning",
        "⚠️",
        "Supabase is not configured",
        "Open supabase.js and configure your project URL and publishable key.",
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
            "No active session",
            "Sign in to manage your VibeConnect profile.",
            "LOGIN REQUIRED"
        );

        showLoginState();

        return;
    }


    setConnection(
        "connected",
        "✓",
        "Supabase connected",
        "Your account is connected successfully.",
        "CONNECTED"
    );


    showProfileState();

    fillAccountInformation();

    await loadProfile();


} catch (error) {

    console.error(error);


    setConnection(
        "error",
        "⚠️",
        "Connection error",
        error?.message ||
            "Something went wrong while loading your account.",
        "ERROR"
    );

    showLoginState();
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

profileContent.classList.add(
    "hidden"
);
```

}

/* =========================================================
PROFILE STATE
========================================================= */

function showProfileState() {

```
loginRequired.classList.add(
    "hidden"
);

profileContent.classList.remove(
    "hidden"
);
```

}

/* =========================================================
ACCOUNT INFORMATION
========================================================= */

function fillAccountInformation() {

```
if (!currentUser) {

    return;
}


accountEmail.textContent =
    currentUser.email ||
    "Not available";


accountId.textContent =
    currentUser.id ||
    "Not available";


accountCreated.textContent =
    formatDate(
        currentUser.created_at
    );
```

}

/* =========================================================
LOAD PROFILE
========================================================= */

async function loadProfile() {

```
if (
    !supabaseClient ||
    !currentUser
) {

    return;
}


try {

    const result =
        await supabaseClient
            .from("profiles")
            .select(
                [
                    "id",
                    "display_name",
                    "username",
                    "bio",
                    "website",
                    "location",
                    "birthday",
                    "avatar_url",
                    "cover_url",
                    "created_at",
                    "updated_at"
                ].join(", ")
            )
            .eq(
                "id",
                currentUser.id
            )
            .maybeSingle();


    if (result.error) {

        throw result.error;
    }


    let profile =
        result.data;


    /*
     * If the database does not contain
     * a profile row yet, create one
     * from Auth metadata.
     */

    if (!profile) {

        profile = {

            id: currentUser.id,

            display_name:
                currentUser.user_metadata
                    ?.display_name ||
                "",

            username:
                currentUser.user_metadata
                    ?.username ||
                "",

            bio:
                "",

            website:
                "",

            location:
                "",

            birthday:
                "",

            avatar_url:
                "",

            cover_url:
                "",

            created_at:
                currentUser.created_at,

            updated_at:
                null

        };
    }


    originalProfile =
        { ...profile };


    populateForm(
        profile
    );

    updatePreview();


    if (profile.updated_at) {

        profileUpdated.textContent =
            formatDate(
                profile.updated_at
            );

    } else {

        profileUpdated.textContent =
            "Not saved yet";
    }


    setConnection(
        "connected",
        "✓",
        "Profile loaded",
        "Your profile data is connected to Supabase.",
        "READY"
    );


} catch (error) {

    console.error(
        "Profile load error:",
        error
    );


    setConnection(
        "warning",
        "⚠️",
        "Profile table needs attention",
        friendlyDatabaseError(
            error
        ),
        "ACTION NEEDED"
    );


    /*
     * We can still use Auth metadata
     * if the profiles table isn't ready.
     */

    const fallbackProfile = {

        id: currentUser.id,

        display_name:
            currentUser.user_metadata
                ?.display_name ||
            "",

        username:
            currentUser.user_metadata
                ?.username ||
            "",

        bio: "",

        website: "",

        location: "",

        birthday: "",

        avatar_url: "",

        cover_url: "",

        created_at:
            currentUser.created_at,

        updated_at: null
    };


    originalProfile =
        { ...fallbackProfile };


    populateForm(
        fallbackProfile
    );

    updatePreview();
}
```

}

/* =========================================================
POPULATE FORM
========================================================= */

function populateForm(profile) {

```
displayNameInput.value =
    profile.display_name ||
    "";

usernameInput.value =
    profile.username ||
    "";

bioInput.value =
    profile.bio ||
    "";

websiteInput.value =
    profile.website ||
    "";

locationInput.value =
    profile.location ||
    "";

birthdayInput.value =
    profile.birthday ||
    "";

avatarUrlInput.value =
    profile.avatar_url ||
    "";

coverUrlInput.value =
    profile.cover_url ||
    "";


updateBioCount();
```

}

/* =========================================================
UPDATE PREVIEW
========================================================= */

function updatePreview() {

```
const name =
    displayNameInput.value.trim() ||
    "Your Name";


const username =
    usernameInput.value.trim() ||
    "username";


const bio =
    bioInput.value.trim() ||
    "Your bio will appear here.";


const location =
    locationInput.value.trim();


const website =
    websiteInput.value.trim();


profileName.textContent =
    name;


profileUsername.textContent =
    `@${username.replace(/^@/, "")}`;


profileBio.textContent =
    bio;


previewName.textContent =
    name;


previewUsername.textContent =
    `@${username.replace(/^@/, "")}`;


previewBio.textContent =
    bio;


previewLocation.textContent =
    location
        ? `📍 ${location}`
        : "📍 Location";


previewWebsite.textContent =
    website
        ? "🌐 Website added"
        : "🌐 Website";


updateAvatarPreview();

updateCoverPreview();
```

}

/* =========================================================
AVATAR PREVIEW
========================================================= */

function updateAvatarPreview() {

```
const url =
    avatarUrlInput.value.trim();


avatarPreview.innerHTML =
    "";

previewAvatar.innerHTML =
    "";


if (!url) {

    avatarPreview.textContent =
        "✦";

    previewAvatar.textContent =
        "✦";

    return;
}


const image1 =
    document.createElement(
        "img"
    );

image1.src =
    url;

image1.alt =
    "Profile picture";


image1.addEventListener(
    "error",
    () => {

        avatarPreview.textContent =
            "✦";

        previewAvatar.textContent =
            "✦";

        showToast(
            "The profile image URL could not be loaded."
        );
    }
);


avatarPreview.appendChild(
    image1
);


const image2 =
    document.createElement(
        "img"
    );

image2.src =
    url;

image2.alt =
    "Profile picture";


image2.addEventListener(
    "error",
    () => {

        previewAvatar.textContent =
            "✦";
    }
);


previewAvatar.appendChild(
    image2
);
```

}

/* =========================================================
COVER PREVIEW
========================================================= */

function updateCoverPreview() {

```
const url =
    coverUrlInput.value.trim();


if (!url) {

    coverPreview.style.backgroundImage =
        "none";

    return;
}


coverPreview.style.backgroundImage =
    `url("${escapeCSSUrl(url)}")`;
```

}

/* =========================================================
CSS URL SAFETY
========================================================= */

function escapeCSSUrl(value) {

```
return String(value)
    .replace(
        /\\/g,
        "\\\\"
    )
    .replace(
        /"/g,
        '\\"'
    )
    .replace(
        /\)/g,
        "\\)"
    );
```

}

/* =========================================================
BIO COUNTER
========================================================= */

function updateBioCount() {

```
bioCount.textContent =
    `${bioInput.value.length} / 160`;
```

}

/* =========================================================
VALIDATE USERNAME
========================================================= */

function validateUsername(username) {

```
if (!username) {

    return "Username is required.";
}


if (
    username.length < 3 ||
    username.length > 30
) {

    return "Username must be between 3 and 30 characters.";
}


if (
    !/^[a-zA-Z0-9_.]+$/.test(
        username
    )
) {

    return "Username can only contain letters, numbers, underscores and periods.";
}


return "";
```

}

/* =========================================================
VALIDATE WEBSITE
========================================================= */

function validateWebsite(value) {

```
if (!value) {

    return "";
}


try {

    const url =
        new URL(value);


    if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
    ) {

        return "Website must begin with http:// or https://.";
    }


    return "";

} catch {

    return "Please enter a valid website URL.";
}
```

}

/* =========================================================
SAVE PROFILE
========================================================= */

profileForm.addEventListener(
"submit",
async event => {

```
    event.preventDefault();


    if (
        !supabaseClient ||
        !currentUser
    ) {

        showToast(
            "Please sign in first."
        );

        return;
    }


    const displayName =
        displayNameInput.value.trim();


    const username =
        usernameInput.value
            .trim()
            .replace(
                /^@/,
                ""
            )
            .toLowerCase();


    const bio =
        bioInput.value.trim();


    const website =
        websiteInput.value.trim();


    const location =
        locationInput.value.trim();


    const birthday =
        birthdayInput.value;


    const avatarUrl =
        avatarUrlInput.value.trim();


    const coverUrl =
        coverUrlInput.value.trim();


    const usernameError =
        validateUsername(
            username
        );


    if (usernameError) {

        showToast(
            usernameError
        );

        usernameInput.focus();

        return;
    }


    const websiteError =
        validateWebsite(
            website
        );


    if (websiteError) {

        showToast(
            websiteError
        );

        websiteInput.focus();

        return;
    }


    if (bio.length > 160) {

        showToast(
            "Bio must be 160 characters or fewer."
        );

        return;
    }


    saveButton.disabled =
        true;

    saveButton.textContent =
        "⏳ Saving...";


    try {

        /*
         * First update Auth metadata.
         */

        const authResult =
            await supabaseClient
                .auth
                .updateUser({

                    data: {

                        display_name:
                            displayName,

                        username:
                            username

                    }

                });


        if (authResult.error) {

            throw authResult.error;
        }


        /*
         * Then save the full profile.
         */

        const profileData = {

            id:
                currentUser.id,

            display_name:
                displayName,

            username:
                username,

            bio:
                bio,

            website:
                website,

            location:
                location,

            birthday:
                birthday || null,

            avatar_url:
                avatarUrl,

            cover_url:
                coverUrl,

            updated_at:
                new Date()
                    .toISOString()

        };


        const result =
            await supabaseClient
                .from("profiles")
                .upsert(
                    profileData,
                    {
                        onConflict:
                            "id"
                    }
                )
                .select()
                .single();


        if (result.error) {

            throw result.error;
        }


        originalProfile =
            {
                ...result.data
            };


        currentUser =
            (
                await getCurrentUser()
            ) ||
            currentUser;


        fillAccountInformation();

        populateForm(
            result.data
        );

        updatePreview();


        profileUpdated.textContent =
            formatDate(
                result.data.updated_at
            );


        setConnection(
            "connected",
            "✓",
            "Profile saved",
            "Your profile has been saved to Supabase.",
            "SAVED"
        );


        showToast(
            "Profile saved successfully! 🎉"
        );


    } catch (error) {

        console.error(
            "Profile save error:",
            error
        );


        setConnection(
            "warning",
            "⚠️",
            "Profile could not be saved",
            friendlyDatabaseError(
                error
            ),
            "ERROR"
        );


        showToast(
            friendlyDatabaseError(
                error
            )
        );


    } finally {

        saveButton.disabled =
            false;

        saveButton.textContent =
            "💾 Save Profile";
    }
}
```

);

/* =========================================================
INPUT EVENTS
========================================================= */

[
displayNameInput,
usernameInput,
bioInput,
websiteInput,
locationInput,
birthdayInput,
avatarUrlInput,
coverUrlInput
].forEach(
input => {

```
    input.addEventListener(
        "input",
        () => {

            updatePreview();

        }
    );
}
```

);

bioInput.addEventListener(
"input",
updateBioCount
);

/* =========================================================
RESET
========================================================= */

resetButton.addEventListener(
"click",
() => {

```
    if (!originalProfile) {

        return;
    }


    populateForm(
        originalProfile
    );

    updatePreview();


    showToast(
        "Changes have been reset."
    );
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
LOGOUT
========================================================= */

logoutButton.addEventListener(
"click",
async () => {

```
    if (!supabaseClient) {

        return;
    }


    logoutButton.disabled =
        true;

    logoutButton.textContent =
        "Signing out...";


    try {

        const result =
            await supabaseClient
                .auth
                .signOut();


        if (result.error) {

            throw result.error;
        }


        showToast(
            "You have been signed out."
        );


        setTimeout(
            () => {

                window.location.href =
                    "auth.html";

            },
            700
        );


    } catch (error) {

        console.error(error);


        showToast(
            error?.message ||
                "Unable to sign out."
        );


        logoutButton.disabled =
            false;

        logoutButton.textContent =
            "Sign Out";
    }
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
FRIENDLY DATABASE ERRORS
========================================================= */

function friendlyDatabaseError(
error
) {

```
const message =
    String(
        error?.message ||
        error ||
        ""
    );


if (
    message
        .toLowerCase()
        .includes(
            "relation"
        )
) {

    return "The profiles table is not available yet. Run database.sql in your Supabase SQL Editor.";
}


if (
    message
        .toLowerCase()
        .includes(
            "duplicate"
        ) ||
    message
        .toLowerCase()
        .includes(
            "unique"
        )
) {

    return "That username is already being used. Choose another one.";
}


if (
    message
        .toLowerCase()
        .includes(
            "row-level security"
        )
) {

    return "Supabase blocked this profile change because of Row Level Security.";
}


if (
    message
        .toLowerCase()
        .includes(
            "jwt"
        )
) {

    return "Your login session may have expired. Please sign in again.";
}


return message ||
    "Something went wrong while saving the profile.";
```

}

/* =========================================================
DATE FORMAT
========================================================= */

function formatDate(
value
) {

```
if (!value) {

    return "Not available";
}


const date =
    new Date(value);


if (
    Number.isNaN(
        date.getTime()
    )
) {

    return "Not available";
}


return new Intl.DateTimeFormat(
    undefined,
    {
        year: "numeric",
        month: "short",
        day: "numeric"
    }
).format(
    date
);
```

}

/* =========================================================
AUTH STATE LISTENER
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

                setConnection(
                    "warning",
                    "🔐",
                    "Signed out",
                    "Sign in to manage your profile.",
                    "LOGIN REQUIRED"
                );

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

                    showProfileState();

                    fillAccountInformation();

                    await loadProfile();
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
    await initialize();

    setupAuthListener();

}
```

);

/* =========================================================
PUBLIC API
========================================================= */

window.vibeConnectRealProfile = {

```
getUser() {

    return currentUser;
},

getProfile() {

    return originalProfile
        ? { ...originalProfile }
        : null;
},

reload() {

    return loadProfile();
}
```

};

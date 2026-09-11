"use strict";

/* =========================================================
VIBECONNECT ACCOUNT
STEP 19
========================================================= */

/* =========================================================
DOM
========================================================= */

const backButton =
document.getElementById("backButton");

const connectionStatus =
document.getElementById("connectionStatus");

const accountContent =
document.getElementById("accountContent");

const loginRequired =
document.getElementById("loginRequired");

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

const bioCount =
document.getElementById("bioCount");

const saveProfileButton =
document.getElementById("saveProfileButton");

const logoutButton =
document.getElementById("logoutButton");

const toast =
document.getElementById("toast");

/* =========================================================
STATE
========================================================= */

let currentUser = null;

let toastTimer = null;

/* =========================================================
SUPABASE CLIENT
========================================================= */

function getSupabase() {

if (window.vibeSupabase) {
    return window.vibeSupabase;
}

return null;

}

/* =========================================================
TOAST
========================================================= */

function showToast(message, type = "success") {

clearTimeout(toastTimer);

toast.textContent = message;

toast.className =
    toast show ${type};

toastTimer = setTimeout(() => {

    toast.className =
        "toast";

}, 3000);

}

/* =========================================================
CONNECTION STATUS
========================================================= */

function setConnectionStatus(
text,
connected = true
) {

connectionStatus.innerHTML = `
    <span class="status-dot"></span>
    ${escapeHTML(text)}


connectionStatus.style.color =
    connected
        ? "#16835b"
        : "#d14343";

connectionStatus.style.background =
    connected
        ? "#f1f8f4"
        : "#fff1f1";


}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHTML(value) {

return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* =========================================================
USERNAME
========================================================= */

function cleanUsername(value) {

return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "");

}

function validUsername(username) {

return /^[a-z0-9._]{3,30}$/.test(
    username
);

}

/* =========================================================
WAIT FOR SUPABASE
========================================================= */

async function waitForSupabase() {

let attempts = 0;

while (
    !window.vibeSupabase &&
    attempts < 40
) {

    await new Promise(resolve =>
        setTimeout(resolve, 100)
    );

    attempts++;
}

return getSupabase();

}

/* =========================================================
GET CURRENT USER
========================================================= */

async function getCurrentUser() {

const supabase =
    getSupabase();

if (!supabase) {
    return null;
}

try {

    const {
        data,
        error
    } =
        await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return data?.user || null;

} catch (error) {

    console.error(
        "Unable to get user:",
        error
    );

    return null;
}

}

/* =========================================================
PROFILE TABLE
========================================================= */

async function loadProfile(user) {

const supabase =
    getSupabase();

if (!supabase || !user) {
    return;
}


try {

    const {
        data,
        error
    } =
        await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();


    /*
     * If the profiles table exists and
     * contains the user, load it.
     */

    if (!error && data) {

        fillProfileForm(
            data,
            user
        );

        return;
    }


    /*
     * If the profile does not exist,
     * use information from Auth metadata.
     */

    if (
        error &&
        !String(error.message)
            .toLowerCase()
            .includes("relation")
    ) {

        console.warn(
            "Profile read warning:",
            error
        );
    }


    const metadata =
        user.user_metadata || {};

    fillProfileForm(
        {
            display_name:
                metadata.display_name || "",

            username:
                metadata.username || "",

            bio: "",
            website: "",
            location: "",
            birthday: ""
        },
        user
    );


} catch (error) {

    console.error(
        "Profile loading failed:",
        error
    );

    const metadata =
        user.user_metadata || {};

    fillProfileForm(
        {
            display_name:
                metadata.display_name || "",

            username:
                metadata.username || ""
        },
        user
    );
}

}

/* =========================================================
FILL FORM
========================================================= */

function fillProfileForm(
profile,
user
) {

const metadata =
    user.user_metadata || {};


const name =
    profile?.display_name ||
    metadata.display_name ||
    "Your Name";


const username =
    profile?.username ||
    metadata.username ||
    "username";


displayNameInput.value =
    name;


usernameInput.value =
    username
        ? @${cleanUsername(username)}
        : "";


bioInput.value =
    profile?.bio || "";


websiteInput.value =
    profile?.website || "";


locationInput.value =
    profile?.location || "";


birthdayInput.value =
    profile?.birthday || "";


updateBioCount();

updateProfilePreview();

updateHero(
    name,
    cleanUsername(username),
    user
);

}

/* =========================================================
HERO
========================================================= */

function updateHero(
name,
username,
user
) {

document.getElementById(
    "heroName"
).textContent =
    name || "Your Profile";


document.getElementById(
    "heroUsername"
).textContent =
    username
        ? "@${username}`
        : "@username";


document.getElementById(
    "heroEmail"
).textContent =
    user?.email ||
    "No email available";


document.getElementById(
    "accountEmail"
).textContent =
    user?.email ||
    "—";


document.getElementById(
    "accountId"
).textContent =
    user?.id ||
    "—";


document.getElementById(
    "accountCreated"
).textContent =
    formatDate(
        user?.created_at
    );


const avatar =
    document.getElementById("avatar");

avatar.textContent =
    getInitial(
        name
    );


document.getElementById(
    "previewAvatar"
).textContent =
    getInitial(name);

}

/* =========================================================
INITIAL LETTER
========================================================= */

function getInitial(name) {

const value =
    String(name || "")
        .trim();

if (!value) {
    return "✦";
}

return value
    .charAt(0)
    .toUpperCase();

}

/* =========================================================
DATE
========================================================= */

function formatDate(value) {

if (!value) {
    return "—";
}

const date =
    new Date(value);

if (Number.isNaN(
    date.getTime()
)) {
    return "—";
}

return date.toLocaleDateString(
    undefined,
    {
        year: "numeric",
        month: "short",
        day: "numeric"
    }
);

}

/* =========================================================
BIO COUNTER
========================================================= */

function updateBioCount() {

bioCount.textContent =
    bioInput.value.length;

}

bioInput.addEventListener(
"input",
() => {

    updateBioCount();

    updateProfilePreview();
}

);

/* =========================================================
PREVIEW
========================================================= */

function updateProfilePreview() {

const name =
    displayNameInput.value.trim() ||
    "Your Name";


const username =
    cleanUsername(
        usernameInput.value
    ) ||
    "username";


const bio =
    bioInput.value.trim() ||
    "Your bio will appear here.";


document.getElementById(
    "previewName"
).textContent =
    name;


document.getElementById(
    "previewUsername"
).textContent =
    "@${username}`;


document.getElementById(
    "previewBio"
).textContent =
    bio;


document.getElementById(
    "previewAvatar"
).textContent =
    getInitial(name);


const details =
    document.getElementById(
        "previewDetails"
    );


details.innerHTML = "";


if (locationInput.value.trim()) {

    addPreviewDetail(
        details,
        "📍 ${locationInput.value.trim()}`
    );
}


if (websiteInput.value.trim()) {

    addPreviewDetail(
        details,
        "🌐 Website"
    );
}

}

function addPreviewDetail(
container,
text
) {

const element =
    document.createElement("span");

element.className =
    "preview-detail";

element.textContent =
    text;

container.appendChild(
    element
);

}

[
displayNameInput,
usernameInput,
websiteInput,
locationInput
].forEach(input => {

input.addEventListener(
    "input",
    updateProfilePreview
);

});

/* =========================================================
SAVE PROFILE
========================================================= */

profileForm.addEventListener(
"submit",
async event => {

    event.preventDefault();


    const supabase =
        getSupabase();


    if (!supabase) {

        showToast(
            "Supabase is not connected.",
            "error"
        );

        return;
    }


    if (!currentUser) {

        showToast(
            "Please sign in first.",
            "error"
        );

        return;
    }


    const displayName =
        displayNameInput.value.trim();


    const username =
        cleanUsername(
            usernameInput.value
        );


    if (displayName.length < 2) {

        showToast(
            "Please enter a valid display name.",
            "error"
        );

        return;
    }


    if (!validUsername(username)) {

        showToast(
            "Username must be 3–30 characters using letters, numbers, dots or underscores.",
            "error"
        );

        return;
    }


    saveProfileButton.disabled =
        true;


    const originalText =
        saveProfileButton
            .querySelector("span")
            ?.textContent ||
        "Save profile";


    saveProfileButton
        .querySelector("span")
        .textContent =
        "Saving...";


    try {

        /*
         * Update Auth metadata.
         */

        const {
            error: authError
        } =
            await supabase.auth.updateUser({

                data: {

                    display_name:
                        displayName,

                    username:
                        username

                }

            });


        if (authError) {
            throw authError;
        }


        /*
         * Save profile information.
         *
         * This requires a profiles table
         * with id as the user ID.
         */

        const profileData = {

            id:
                currentUser.id,

            display_name:
                displayName,

            username:
                username,

            bio:
                bioInput.value.trim(),

            website:
                websiteInput.value.trim(),

            location:
                locationInput.value.trim(),

            birthday:
                birthdayInput.value || null,

            updated_at:
                new Date().toISOString()
        };


        const {
            error: profileError
        } =
            await supabase
                .from("profiles")
                .upsert(
                    profileData,
                    {
                        onConflict: "id"
                    }
                );


        if (profileError) {

            /*
             * Auth metadata was updated,
             * but profile table may not exist yet.
             */

            if (
                String(profileError.message)
                    .toLowerCase()
                    .includes("relation")
            ) {

                showToast(
                    "Auth information saved. Create the profiles table in Supabase to save the full profile.",
                    "success"
                );

            } else {

                throw profileError;
            }

        } else {

            showToast(
                "Profile saved successfully! 🎉",
                "success"
            );
        }


        updateHero(
            displayName,
            username,
            currentUser
        );


        updateProfilePreview();


    } catch (error) {

        console.error(
            "Profile save error:",
            error
        );


        showToast(
            friendlyError(error),
            "error"
        );

    } finally {

        saveProfileButton.disabled =
            false;


        saveProfileButton
            .querySelector("span")
            .textContent =
            originalText;
    }

}

);

/* =========================================================
LOGOUT
========================================================= */

logoutButton.addEventListener(
"click",
async () => {

    const supabase =
        getSupabase();


    if (!supabase) {

        showToast(
            "Supabase is not connected.",
            "error"
        );

        return;
    }


    logoutButton.disabled =
        true;


    try {

        const {
            error
        } =
            await supabase.auth.signOut();


        if (error) {
            throw error;
        }


        showToast(
            "You have been signed out.",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "auth.html";

        }, 700);


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );


        showToast(
            friendlyError(error),
            "error"
        );


        logoutButton.disabled =
            false;
    }
}

);

/* =========================================================
BACK
========================================================= */

backButton.addEventListener(
"click",
() => {

    if (
        document.referrer &&
        document.referrer
            .includes(
                window.location.origin
            )
    ) {

        history.back();

    } else {

        window.location.href =
            "app.html";
    }
}

);

/* =========================================================
LOGIN BUTTON
========================================================= */

loginButton.addEventListener(
"click",
() => {

    window.location.href =
        "auth.html";
}

);

/* =========================================================
FRIENDLY ERRORS
========================================================= */

function friendlyError(error) {

const message =
    String(
        error?.message || ""
    ).toLowerCase();


if (
    message.includes(
        "duplicate"
    ) &&
    message.includes(
        "username"
    )
) {

    return "That username is already being used.";
}


if (
    message.includes(
        "unique constraint"
    )
) {

    return "That username is already being used.";
}


if (
    message.includes(
        "permission denied"
    ) ||
    message.includes(
        "row-level security"
    )
) {

    return "Supabase permissions are blocking this profile update. Check your profiles table policies.";
}


if (
    message.includes(
        "relation"
    ) &&
    message.includes(
        "profiles"
    )
) {

    return "The profiles table has not been created in Supabase yet.";
}


return (
    error?.message ||
    "Something went wrong. Please try again."
);

}

/* =========================================================
NOT LOGGED IN UI
========================================================= */

function showLoggedOut() {

accountContent.classList.add(
    "hidden"
);

loginRequired.classList.remove(
    "hidden"
);

setConnectionStatus(
    "Not signed in",
    false
);

}

/* =========================================================
LOGGED IN UI
========================================================= */

async function showLoggedIn(user) {

currentUser =
    user;


loginRequired.classList.add(
    "hidden"
);

accountContent.classList.remove(
    "hidden"
);


setConnectionStatus(
    "Account connected",
    true
);


await loadProfile(user);

}

/* =========================================================
INITIALIZE
========================================================= */

async function initializeAccount() {

const supabase =
    await waitForSupabase();


if (!supabase) {

    showLoggedOut();

    showToast(
        "Connect Supabase first.",
        "error"
    );

    return;
}


try {

    const user =
        await getCurrentUser();


    if (!user) {

        showLoggedOut();

        return;
    }


    await showLoggedIn(user);


    /*
     * Listen for future authentication changes.
     */

    supabase.auth.onAuthStateChange(
        async (
            event,
            session
        ) => {

            if (
                event === "SIGNED_OUT" ||
                !session?.user
            ) {

                showLoggedOut();

            }

        }
    );


} catch (error) {

    console.error(
        "Account initialization failed:",
        error
    );

    showLoggedOut();
}

}

initializeAccount();

/* =========================================================
PUBLIC API
========================================================= */

window.vibeConnectAccount = {

getUser() {
    return currentUser;
},

refresh() {
    return initializeAccount();
}

};

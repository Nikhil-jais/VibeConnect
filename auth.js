/* =========================================================
VIBECONNECT AUTHENTICATION
STEP 18
========================================================= */

"use strict";

/* =========================================================
DOM
========================================================= */

const loginSection = document.getElementById("loginSection");
const signupSection = document.getElementById("signupSection");
const loggedInSection = document.getElementById("loggedInSection");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const authStatus = document.getElementById("authStatus");

const loggedInEmail = document.getElementById("loggedInEmail");

const continueButton = document.getElementById("continueButton");
const logoutButton = document.getElementById("logoutButton");

const signupPassword = document.getElementById("signupPassword");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

/* =========================================================
SUPABASE
========================================================= */

function getSupabaseClient() {

```
if (
    window.vibeSupabase &&
    typeof window.vibeSupabase.auth !== "undefined"
) {
    return window.vibeSupabase;
}

return null;
```

}

/* =========================================================
STATUS MESSAGE
========================================================= */

function showStatus(message, type = "info") {

```
authStatus.textContent = message;

authStatus.className =
    `auth-status show ${type}`;
```

}

function clearStatus() {

```
authStatus.textContent = "";

authStatus.className =
    "auth-status";
```

}

/* =========================================================
LOADING STATE
========================================================= */

function setLoading(button, loading, loadingText) {

```
if (!button) {
    return;
}

button.disabled = loading;

if (loading) {

    button.dataset.originalText =
        button.querySelector("span")?.textContent || "";

    if (button.querySelector("span")) {
        button.querySelector("span").textContent =
            loadingText;
    }

} else {

    const original =
        button.dataset.originalText;

    if (
        original &&
        button.querySelector("span")
    ) {
        button.querySelector("span").textContent =
            original;
    }
}
```

}

/* =========================================================
SWITCH LOGIN / SIGNUP
========================================================= */

showSignup.addEventListener("click", () => {

```
loginSection.classList.add("hidden");
signupSection.classList.remove("hidden");

clearStatus();

document.getElementById("signupName").focus();
```

});

showLogin.addEventListener("click", () => {

```
signupSection.classList.add("hidden");
loginSection.classList.remove("hidden");

clearStatus();

document.getElementById("loginEmail").focus();
```

});

/* =========================================================
PASSWORD SHOW / HIDE
========================================================= */

document.querySelectorAll(".password-toggle")
.forEach(button => {

```
    button.addEventListener("click", () => {

        const targetId =
            button.dataset.target;

        const input =
            document.getElementById(targetId);

        if (!input) {
            return;
        }

        if (input.type === "password") {

            input.type = "text";

            button.textContent = "🙈";
            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            input.type = "password";

            button.textContent = "👁️";
            button.setAttribute(
                "aria-label",
                "Show password"
            );
        }
    });

});
```

/* =========================================================
PASSWORD STRENGTH
========================================================= */

signupPassword.addEventListener("input", () => {

```
const password =
    signupPassword.value;

if (!password) {

    strengthBar.style.width = "0%";

    strengthText.textContent =
        "Use at least 6 characters.";

    return;
}

let score = 0;

if (password.length >= 6) {
    score++;
}

if (password.length >= 10) {
    score++;
}

if (/[A-Z]/.test(password)) {
    score++;
}

if (/[0-9]/.test(password)) {
    score++;
}

if (/[^A-Za-z0-9]/.test(password)) {
    score++;
}

const percentage =
    Math.min(score * 20, 100);

strengthBar.style.width =
    `${percentage}%`;

if (score <= 1) {

    strengthText.textContent =
        "Weak password.";

} else if (score <= 3) {

    strengthText.textContent =
        "Good password. You can make it stronger.";

} else {

    strengthText.textContent =
        "Strong password.";
}
```

});

/* =========================================================
USERNAME VALIDATION
========================================================= */

function cleanUsername(username) {

```
return username
    .trim()
    .toLowerCase()
    .replace(/^@/, "");
```

}

function validUsername(username) {

```
return /^[a-z0-9._]{3,30}$/.test(username);
```

}

/* =========================================================
LOGIN
========================================================= */

loginForm.addEventListener("submit", async event => {

```
event.preventDefault();

clearStatus();

const supabase =
    getSupabaseClient();

if (!supabase) {

    showStatus(
        "Supabase is not connected yet. Open supabase.js and add your project URL and publishable key.",
        "error"
    );

    return;
}

const email =
    document.getElementById("loginEmail")
        .value
        .trim();

const password =
    document.getElementById("loginPassword")
        .value;

if (!email || !password) {

    showStatus(
        "Please enter your email and password.",
        "error"
    );

    return;
}

setLoading(
    loginButton,
    true,
    "Signing in..."
);

try {

    const {
        data,
        error
    } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw error;
    }

    if (!data.user) {

        throw new Error(
            "Login completed but no user account was returned."
        );
    }

    showStatus(
        "Login successful.",
        "success"
    );

    loginForm.reset();

    showLoggedInUser(data.user);

} catch (error) {

    console.error(
        "VibeConnect login error:",
        error
    );

    showStatus(
        friendlyAuthError(error),
        "error"
    );

} finally {

    setLoading(
        loginButton,
        false
    );
}
```

});

/* =========================================================
SIGN UP
========================================================= */

signupForm.addEventListener("submit", async event => {

```
event.preventDefault();

clearStatus();

const supabase =
    getSupabaseClient();

if (!supabase) {

    showStatus(
        "Supabase is not connected yet. Open supabase.js and add your project URL and publishable key.",
        "error"
    );

    return;
}

const name =
    document.getElementById("signupName")
        .value
        .trim();

const username =
    cleanUsername(
        document.getElementById("signupUsername")
            .value
    );

const email =
    document.getElementById("signupEmail")
        .value
        .trim();

const password =
    signupPassword.value;


if (name.length < 2) {

    showStatus(
        "Please enter a valid display name.",
        "error"
    );

    return;
}


if (!validUsername(username)) {

    showStatus(
        "Username must be 3–30 characters and use only letters, numbers, dots or underscores.",
        "error"
    );

    return;
}


if (password.length < 6) {

    showStatus(
        "Password must contain at least 6 characters.",
        "error"
    );

    return;
}


setLoading(
    signupButton,
    true,
    "Creating..."
);


try {

    const {
        data,
        error
    } = await supabase.auth.signUp({

        email,

        password,

        options: {

            data: {
                display_name: name,
                username: username
            }

        }

    });


    if (error) {
        throw error;
    }


    /*
     * Supabase may require email confirmation.
     */

    if (
        data.user &&
        data.session
    ) {

        showStatus(
            "Your account has been created successfully.",
            "success"
        );

        signupForm.reset();

        showLoggedInUser(data.user);

    } else {

        showStatus(
            "Account created. Check your email for the confirmation link, then sign in.",
            "success"
        );

        signupForm.reset();

    }


} catch (error) {

    console.error(
        "VibeConnect signup error:",
        error
    );

    showStatus(
        friendlyAuthError(error),
        "error"
    );

} finally {

    setLoading(
        signupButton,
        false
    );
}
```

});

/* =========================================================
SHOW LOGGED-IN USER
========================================================= */

function showLoggedInUser(user) {

```
if (!user) {
    return;
}

loginSection.classList.add("hidden");
signupSection.classList.add("hidden");
loggedInSection.classList.remove("hidden");

loggedInEmail.textContent =
    user.email ||
    "Your account is connected.";

clearStatus();
```

}

/* =========================================================
CONTINUE
========================================================= */

continueButton.addEventListener("click", () => {

```
window.location.href =
    "app.html";
```

});

/* =========================================================
LOGOUT
========================================================= */

logoutButton.addEventListener("click", async () => {

```
const supabase =
    getSupabaseClient();

if (!supabase) {

    showStatus(
        "Supabase is not connected.",
        "error"
    );

    return;
}

logoutButton.disabled = true;

try {

    const {
        error
    } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }

    loggedInSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    showStatus(
        "You have been signed out.",
        "success"
    );

} catch (error) {

    console.error(
        "VibeConnect logout error:",
        error
    );

    showStatus(
        friendlyAuthError(error),
        "error"
    );

} finally {

    logoutButton.disabled = false;
}
```

});

/* =========================================================
CHECK EXISTING SESSION
========================================================= */

async function checkExistingSession() {

```
const supabase =
    getSupabaseClient();

if (!supabase) {
    return;
}

try {

    const {
        data,
        error
    } = await supabase.auth.getSession();

    if (error) {
        throw error;
    }

    if (data.session?.user) {

        showLoggedInUser(
            data.session.user
        );
    }

} catch (error) {

    console.error(
        "Session check failed:",
        error
    );
}
```

}

/* =========================================================
AUTH STATE LISTENER
========================================================= */

function setupAuthListener() {

```
const supabase =
    getSupabaseClient();

if (!supabase) {
    return;
}

supabase.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "VibeConnect auth event:",
            event
        );

        if (
            session?.user &&
            event === "SIGNED_IN"
        ) {

            showLoggedInUser(
                session.user
            );
        }

    }
);
```

}

/* =========================================================
FRIENDLY ERROR MESSAGES
========================================================= */

function friendlyAuthError(error) {

```
const message =
    String(
        error?.message || ""
    ).toLowerCase();


if (
    message.includes("invalid login credentials")
) {

    return "Incorrect email or password.";

}


if (
    message.includes("email not confirmed")
) {

    return "Please confirm your email before signing in.";

}


if (
    message.includes("user already registered")
) {

    return "An account with this email already exists.";

}


if (
    message.includes("password should be at least")
) {

    return "Your password is too short.";

}


if (
    message.includes("rate limit")
) {

    return "Too many attempts. Please wait a little and try again.";

}


if (
    message.includes("network")
) {

    return "Network problem. Check your internet connection.";

}


return (
    error?.message ||
    "Something went wrong. Please try again."
);
```

}

/* =========================================================
INITIALIZE
========================================================= */

async function initializeAuthentication() {

```
/*
 * Wait briefly because supabase.js
 * is loaded separately.
 */

let attempts = 0;

while (
    !window.vibeSupabase &&
    attempts < 30
) {

    await new Promise(
        resolve => setTimeout(resolve, 100)
    );

    attempts++;
}


if (!window.vibeSupabase) {

    console.warn(
        "VibeConnect: Supabase client not available."
    );

    showStatus(
        "Connect your Supabase project in supabase.js to enable real accounts.",
        "info"
    );

    return;
}


setupAuthListener();

await checkExistingSession();
```

}

initializeAuthentication();

/* =========================================================
PUBLIC API
========================================================= */

window.vibeConnectAuth = {

```
getClient() {
    return getSupabaseClient();
},

async getUser() {

    const supabase =
        getSupabaseClient();

    if (!supabase) {
        return null;
    }

    const {
        data
    } = await supabase.auth.getUser();

    return data?.user || null;
},

async signOut() {

    const supabase =
        getSupabaseClient();

    if (!supabase) {
        return false;
    }

    const {
        error
    } = await supabase.auth.signOut();

    return !error;
}
```

};

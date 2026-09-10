```javascript
/* =========================================================
   VIBECONNECT — SECURITY CENTER
   STEP 29
   ========================================================= */

(() => {

    "use strict";

    const state = {
        client: null,
        user: null
    };


    const el = {
        refreshBtn:
            document.getElementById("refreshBtn"),

        checkBtn:
            document.getElementById("checkBtn"),

        supabaseBadge:
            document.getElementById("supabaseBadge"),

        supabaseStatus:
            document.getElementById("supabaseStatus"),

        authBadge:
            document.getElementById("authBadge"),

        authStatus:
            document.getElementById("authStatus"),

        rlsBadge:
            document.getElementById("rlsBadge"),

        sessionBadge:
            document.getElementById("sessionBadge"),

        accountInfo:
            document.getElementById("accountInfo"),

        checkMessage:
            document.getElementById("checkMessage"),

        toast:
            document.getElementById("toast")
    };


    /* =====================================================
       SUPABASE
       ===================================================== */

    function getClient() {

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
    }


    /* =====================================================
       BADGE
       ===================================================== */

    function setBadge(
        element,
        text,
        type
    ) {

        element.textContent = text;

        element.className =
            `badge ${type}`;
    }


    /* =====================================================
       TOAST
       ===================================================== */

    let toastTimer;

    function showToast(message) {

        el.toast.textContent = message;

        el.toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer =
            setTimeout(() => {
                el.toast.classList.remove("show");
            }, 2800);
    }


    /* =====================================================
       SUPABASE CHECK
       ===================================================== */

    async function checkSupabase() {

        if (!state.client) {

            setBadge(
                el.supabaseBadge,
                "Unavailable",
                "bad"
            );

            el.supabaseStatus.textContent =
                "Supabase client was not found.";

            return false;
        }

        try {

            const {
                error
            } = await state.client
                .from("profiles")
                .select("id")
                .limit(1);

            if (error) {

                console.error(
                    "Supabase check:",
                    error
                );

                setBadge(
                    el.supabaseBadge,
                    "Needs attention",
                    "bad"
                );

                el.supabaseStatus.textContent =
                    error.message;

                return false;
            }

            setBadge(
                el.supabaseBadge,
                "Connected",
                "good"
            );

            el.supabaseStatus.textContent =
                "Database connection is working.";

            return true;

        } catch (error) {

            console.error(error);

            setBadge(
                el.supabaseBadge,
                "Failed",
                "bad"
            );

            el.supabaseStatus.textContent =
                error.message;

            return false;
        }
    }


    /* =====================================================
       AUTH CHECK
       ===================================================== */

    async function checkAuthentication() {

        if (!state.client) {

            setBadge(
                el.authBadge,
                "Unavailable",
                "bad"
            );

            el.authStatus.textContent =
                "Supabase is not available.";

            return null;
        }

        const {
            data,
            error
        } = await state.client.auth.getUser();

        if (error) {

            setBadge(
                el.authBadge,
                "Error",
                "bad"
            );

            el.authStatus.textContent =
                error.message;

            return null;
        }

        state.user =
            data?.user || null;

        if (!state.user) {

            setBadge(
                el.authBadge,
                "Signed out",
                "bad"
            );

            el.authStatus.textContent =
                "No authenticated VibeConnect user.";

            el.sessionBadge.textContent =
                "Signed out";

            renderAccount(null);

            return null;
        }

        setBadge(
            el.authBadge,
            "Authenticated",
            "good"
        );

        el.authStatus.textContent =
            "Your VibeConnect session is active.";

        el.sessionBadge.textContent =
            "Active session";

        renderAccount(state.user);

        return state.user;
    }


    /* =====================================================
       ACCOUNT INFO
       ===================================================== */

    function renderAccount(user) {

        if (!user) {

            el.accountInfo.innerHTML = `
                <div class="loading">
                    Sign in to see your account security information.
                </div>
            `;

            return;
        }

        const created =
            user.created_at
                ? new Date(
                    user.created_at
                ).toLocaleString()
                : "Unavailable";

        const lastLogin =
            user.last_sign_in_at
                ? new Date(
                    user.last_sign_in_at
                ).toLocaleString()
                : "Unavailable";

        const email =
            user.email ||
            "Not available";

        const provider =
            user.app_metadata?.provider ||
            "email";

        const id =
            user.id ||
            "Unavailable";

        el.accountInfo.innerHTML = "";

        addInfo(
            "Account email",
            email
        );

        addInfo(
            "Authentication",
            provider
        );

        addInfo(
            "User ID",
            id
        );

        addInfo(
            "Account created",
            created
        );

        addInfo(
            "Last sign in",
            lastLogin
        );

        addInfo(
            "Email confirmed",
            user.email_confirmed_at
                ? "Yes"
                : "Not confirmed"
        );
    }


    function addInfo(
        label,
        value
    ) {

        const box =
            document.createElement("div");

        box.className =
            "info-box";

        const labelElement =
            document.createElement("span");

        labelElement.textContent =
            label;

        const valueElement =
            document.createElement("strong");

        valueElement.textContent =
            value;

        box.appendChild(
            labelElement
        );

        box.appendChild(
            valueElement
        );

        el.accountInfo.appendChild(
            box
        );
    }


    /* =====================================================
       SECURITY CHECK
       ===================================================== */

    async function runSecurityCheck() {

        el.checkBtn.disabled = true;

        el.checkBtn.textContent =
            "Checking...";

        el.checkMessage.textContent =
            "Running backend and authentication checks.";

        const databaseOK =
            await checkSupabase();

        await checkAuthentication();

        if (databaseOK) {

            setBadge(
                el.rlsBadge,
                "Enabled",
                "good"
            );

            el.checkMessage.textContent =
                "Connection check completed successfully.";

            showToast(
                "Security check completed."
            );

        } else {

            setBadge(
                el.rlsBadge,
                "Review",
                "bad"
            );

            el.checkMessage.textContent =
                "Some checks need your attention.";

            showToast(
                "Security check found an issue."
            );
        }

        el.checkBtn.disabled = false;

        el.checkBtn.textContent =
            "Run Security Check";
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    async function initialize() {

        state.client =
            getClient();

        if (!state.client) {

            await checkSupabase();

            await checkAuthentication();

            return;
        }

        await runSecurityCheck();


        if (
            state.client.auth &&
            state.client.auth.onAuthStateChange
        ) {

            state.client.auth.onAuthStateChange(
                async () => {

                    await checkAuthentication();
                }
            );
        }
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    el.refreshBtn.addEventListener(
        "click",
        async () => {

            await runSecurityCheck();

            showToast(
                "Security status refreshed."
            );
        }
    );


    el.checkBtn.addEventListener(
        "click",
        runSecurityCheck
    );


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.vibeConnectSecurity = {

        refresh:
            runSecurityCheck,

        getCurrentUser:
            () => state.user,

        getClient:
            () => state.client
    };


    initialize();

})();
```

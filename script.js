/* =========================================================
   VIBECONNECT
   MAIN APPLICATION CONTROLLER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       START / LOGIN ELEMENTS
    ===================================================== */

    const preface = document.getElementById("preface");
    const onboarding = document.getElementById("onboarding");
    const loginScreen = document.getElementById("loginScreen");
    const app = document.getElementById("app");

    const getStartedButton =
        document.getElementById("getStartedButton");

    const loginButton =
        document.getElementById("loginButton");

    const backFromLogin =
        document.getElementById("backFromLogin");

    const nextOnboardingButton =
        document.getElementById("nextOnboardingButton");

    const onboardingSlides =
        document.querySelectorAll(".onboarding-slide");

    const onboardingDots =
        document.querySelectorAll(".onboarding-dots .dot");

    const onboardingCounter =
        document.getElementById("onboardingCounter");

    const togglePassword =
        document.getElementById("togglePassword");

    const loginPassword =
        document.getElementById("loginPassword");

    const loginForm =
        document.getElementById("loginForm");


    /* =====================================================
       ONBOARDING
    ===================================================== */

    let currentSlide = 0;

    function updateOnboarding() {

        onboardingSlides.forEach((slide, index) => {

            slide.classList.toggle(
                "active",
                index === currentSlide
            );

        });

        onboardingDots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );

        });

        if (onboardingCounter) {

            onboardingCounter.textContent =
                `${currentSlide + 1}/${onboardingSlides.length}`;

        }

        if (nextOnboardingButton) {

            if (
                currentSlide ===
                onboardingSlides.length - 1
            ) {

                nextOnboardingButton.innerHTML =
                    'Join Vibe <span>→</span>';

            } else {

                nextOnboardingButton.innerHTML =
                    'Next <span>→</span>';

            }

        }

    }


    /* =====================================================
       SHOW START SCREEN
    ===================================================== */

    function hideStartScreens() {

        if (preface) {
            preface.classList.add("hidden");
        }

        if (onboarding) {
            onboarding.classList.add("hidden");
        }

        if (loginScreen) {
            loginScreen.classList.add("hidden");
        }

    }


    function showScreen(screen) {

        hideStartScreens();

        if (screen) {
            screen.classList.remove("hidden");
        }

    }


    /* =====================================================
       ENTER MAIN APP
    ===================================================== */

    function enterApplication() {

        hideStartScreens();

        if (app) {
            app.classList.remove("hidden");
        }

        document.body.classList.add("app-active");

    }


    /* =====================================================
       GET STARTED
    ===================================================== */

    if (getStartedButton) {

        getStartedButton.addEventListener(
            "click",
            () => {

                enterApplication();

            }
        );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginButton) {

        loginButton.addEventListener(
            "click",
            () => {

                showScreen(loginScreen);

            }
        );

    }


    if (backFromLogin) {

        backFromLogin.addEventListener(
            "click",
            () => {

                showScreen(preface);

            }
        );

    }


    /* =====================================================
       PASSWORD TOGGLE
    ===================================================== */

    if (
        togglePassword &&
        loginPassword
    ) {

        togglePassword.addEventListener(
            "click",
            () => {

                const hidden =
                    loginPassword.type === "password";

                loginPassword.type =
                    hidden
                        ? "text"
                        : "password";

                togglePassword.textContent =
                    hidden
                        ? "◉"
                        : "◌";

            }
        );

    }


    /* =====================================================
       LOGIN FORM
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                enterApplication();

            }
        );

    }


    /* =====================================================
       ONBOARDING NEXT BUTTON
    ===================================================== */

    if (nextOnboardingButton) {

        nextOnboardingButton.addEventListener(
            "click",
            () => {

                if (
                    currentSlide <
                    onboardingSlides.length - 1
                ) {

                    currentSlide++;

                    updateOnboarding();

                } else {

                    enterApplication();

                }

            }
        );

    }


    /* =====================================================
       ONBOARDING DOTS
    ===================================================== */

    onboardingDots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    currentSlide = index;

                    updateOnboarding();

                }
            );

        }
    );


    /* =====================================================
       REAL PAGE ROUTES
    ===================================================== */

    const PAGE_ROUTES = {

        home: "home.html",

        explore: "explore.html",

        reels: "reels.html",

        messages: "messages-data.html",

        notifications: "notification-data.html",

        create: "create-real.html",

        profile: "profile-data.html",

        saved: "saved.html",

        settings: "settings.html"

    };


    /* =====================================================
       OPEN REAL PAGE
    ===================================================== */

    function openRealPage(section) {

        const page = PAGE_ROUTES[section];

        if (!page) {

            console.warn(
                "VibeConnect: No page configured for:",
                section
            );

            return;

        }

        window.location.href = page;

    }


    /* =====================================================
       MAIN NAVIGATION
       Converts the old internal navigation into
       separate HTML page navigation.
    ===================================================== */

    const navigationItems =
        document.querySelectorAll("[data-section]");


    navigationItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                const section =
                    item.getAttribute("data-section");

                openRealPage(section);

            },
            true
        );

    });


    /* =====================================================
       CREATE BUTTONS
    ===================================================== */

    const createButtons =
        document.querySelectorAll(
            ".create-option, #quickCreateButton, #addStoryButton"
        );


    createButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                openRealPage("create");

            },
            true
        );

    });


    /* =====================================================
       GLOBAL SEARCH
    ===================================================== */

    const globalSearch =
        document.getElementById("globalSearch");


    if (globalSearch) {

        globalSearch.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Enter") {
                    return;
                }

                const searchValue =
                    globalSearch.value.trim();

                if (!searchValue) {
                    return;
                }

                window.location.href =
                    "search.html";

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateOnboarding();


    if (app) {
        app.classList.add("hidden");
    }


    console.log(
        "VibeConnect: new navigation controller loaded."
    );

});

/* =========================================================
   VIBECONNECT
   APPLICATION FOUNDATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

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
       APP STATE
    ====================================================== */

    let currentSlide = 0;


    /* =====================================================
       SHOW / HIDE SCREENS
    ====================================================== */

    function showScreen(screen) {

        [
            preface,
            onboarding,
            loginScreen
        ].forEach(element => {

            if (element) {
                element.classList.add("hidden");
            }

        });

        if (screen) {
            screen.classList.remove("hidden");
        }

    }


    function enterApp() {

        preface.classList.add("hidden");
        onboarding.classList.add("hidden");
        loginScreen.classList.add("hidden");

        app.classList.remove("hidden");

        document.body.classList.add("app-active");

    }


    /* =====================================================
       PREFACE
    ====================================================== */

    getStartedButton.addEventListener("click", () => {

        enterApp();

    });


    loginButton.addEventListener("click", () => {

        showScreen(loginScreen);

    });


    /* =====================================================
       ONBOARDING
    ====================================================== */

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


        onboardingCounter.textContent =
            `${currentSlide + 1}/4`;


        if (currentSlide === onboardingSlides.length - 1) {

            nextOnboardingButton.innerHTML =
                `Join Vibe <span>→</span>`;

        } else {

            nextOnboardingButton.innerHTML =
                `Next <span>→</span>`;

        }

    }


    nextOnboardingButton.addEventListener("click", () => {

        if (
            currentSlide <
            onboardingSlides.length - 1
        ) {

            currentSlide++;

            updateOnboarding();

        } else {

            enterApp();

        }

    });


    onboardingDots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            currentSlide = index;

            updateOnboarding();

        });

    });


    /* =====================================================
       LOGIN
    ====================================================== */

    backFromLogin.addEventListener("click", () => {

        showScreen(preface);

    });


    togglePassword.addEventListener("click", () => {

        const isPassword =
            loginPassword.type === "password";

        loginPassword.type =
            isPassword
                ? "text"
                : "password";

        togglePassword.textContent =
            isPassword
                ? "◉"
                : "◌";

    });


    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        /*
           Temporary local login behavior.

           Real account authentication will be added
           when we build the account system.
        */

        enterApp();

    });


    /* =====================================================
       MAIN NAVIGATION
    ====================================================== */

    const navigationItems =
        document.querySelectorAll(
            "[data-section]"
        );


    function switchSection(sectionName) {

        const sections =
            document.querySelectorAll(
                ".app-section"
            );

        sections.forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


        const target =
            document.getElementById(
                `section-${sectionName}`
            );

        if (target) {

            target.classList.add(
                "active-section"
            );

        }


        navigationItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.section === sectionName
            );

        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    navigationItems.forEach(item => {

        item.addEventListener("click", () => {

            const section =
                item.dataset.section;

            switchSection(section);

        });

    });


    /* =====================================================
       QUICK CREATE
    ====================================================== */

    const quickCreateButton =
        document.getElementById(
            "quickCreateButton"
        );

    if (quickCreateButton) {

        quickCreateButton.addEventListener(
            "click",
            () => {
                switchSection("create");
            }
        );

    }


    /* =====================================================
       ADD STORY
    ====================================================== */

    const addStoryButton =
        document.getElementById(
            "addStoryButton"
        );

    if (addStoryButton) {

        addStoryButton.addEventListener(
            "click",
            () => {

                /*
                   Real story upload is coming
                   in the next build stage.
                */

                switchSection("create");

            }
        );

    }


    /* =====================================================
       CREATE BUTTONS
    ====================================================== */

    document
        .querySelectorAll(".create-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    alert(
                        "This creator will become fully functional in the next step."
                    );

                }
            );

        });


    /* =====================================================
       GLOBAL SEARCH
    ====================================================== */

    const globalSearch =
        document.getElementById(
            "globalSearch"
        );

    globalSearch.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                const searchValue =
                    globalSearch.value.trim();

                if (!searchValue) {
                    return;
                }

                switchSection("explore");

                console.log(
                    "VibeConnect search:",
                    searchValue
                );

            }

        }
    );


    /* =====================================================
       START
    ====================================================== */

    showScreen(preface);

});

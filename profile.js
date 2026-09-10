/* =========================================================
   VIBECONNECT — PROFILE
   ========================================================= */


/* =========================================================
   PROFILE DATA
   ========================================================= */

let profileData = {
    name: "Your Name",
    username: "username",
    bio: "Tell people something about yourself.",
    posts: 0,
    followers: 0,
    following: 0,
    avatar: null,
    cover: null
};


/* =========================================================
   LOAD LOCAL PROFILE
   ========================================================= */

function loadProfile() {

    const savedProfile =
        localStorage.getItem("vibeConnectProfile");

    if (savedProfile) {

        try {

            profileData =
                JSON.parse(savedProfile);

        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

        }
    }

    renderProfile();
}


/* =========================================================
   SAVE PROFILE
   ========================================================= */

function saveProfile() {

    localStorage.setItem(
        "vibeConnectProfile",
        JSON.stringify(profileData)
    );
}


/* =========================================================
   RENDER PROFILE
   ========================================================= */

function renderProfile() {

    const name =
        document.getElementById("profileName");

    const username =
        document.getElementById("profileUsername");

    const bio =
        document.getElementById("profileBio");

    const posts =
        document.getElementById("postCount");

    const followers =
        document.getElementById("followerCount");

    const following =
        document.getElementById("followingCount");

    if (name) {
        name.textContent =
            profileData.name;
    }

    if (username) {
        username.textContent =
            "@" + profileData.username;
    }

    if (bio) {
        bio.textContent =
            profileData.bio;
    }

    if (posts) {
        posts.textContent =
            profileData.posts;
    }

    if (followers) {
        followers.textContent =
            profileData.followers;
    }

    if (following) {
        following.textContent =
            profileData.following;
    }

    renderAvatar();
    renderCover();
}


/* =========================================================
   AVATAR
   ========================================================= */

function renderAvatar() {

    const avatar =
        document.getElementById("profileAvatar");

    if (!avatar) {
        return;
    }

    if (profileData.avatar) {

        avatar.innerHTML = `
            <img
                src="${profileData.avatar}"
                alt="Profile picture"
            >
        `;

    } else {

        avatar.innerHTML = "👤";
    }
}


/* =========================================================
   COVER
   ========================================================= */

function renderCover() {

    const cover =
        document.querySelector(".profile-cover");

    if (!cover) {
        return;
    }

    if (profileData.cover) {

        cover.style.backgroundImage =
            `url("${profileData.cover}")`;

        cover.style.backgroundSize =
            "cover";

        cover.style.backgroundPosition =
            "center";

    } else {

        cover.style.backgroundImage = "";
    }
}


/* =========================================================
   EDIT PROFILE
   ========================================================= */

function openProfileModal() {

    const modal =
        document.getElementById("profileModal");

    const nameInput =
        document.getElementById("nameInput");

    const usernameInput =
        document.getElementById("usernameInput");

    const bioInput =
        document.getElementById("bioInput");

    if (nameInput) {
        nameInput.value =
            profileData.name;
    }

    if (usernameInput) {
        usernameInput.value =
            profileData.username;
    }

    if (bioInput) {
        bioInput.value =
            profileData.bio;
    }

    if (modal) {
        modal.classList.remove("hidden");
    }
}


/* =========================================================
   CLOSE PROFILE MODAL
   ========================================================= */

function closeProfileModal() {

    const modal =
        document.getElementById("profileModal");

    if (modal) {
        modal.classList.add("hidden");
    }
}


/* =========================================================
   SAVE PROFILE FORM
   ========================================================= */

function handleProfileSubmit(event) {

    event.preventDefault();

    const name =
        document.getElementById("nameInput").value.trim();

    const username =
        document
            .getElementById("usernameInput")
            .value
            .trim()
            .replace(/^@/, "");

    const bio =
        document.getElementById("bioInput").value.trim();

    if (!name || !username) {

        alert(
            "Please enter your name and username."
        );

        return;
    }

    profileData.name =
        name;

    profileData.username =
        username;

    profileData.bio =
        bio || "Welcome to my VibeConnect profile.";

    saveProfile();

    renderProfile();

    closeProfileModal();

    alert(
        "Profile updated successfully!"
    );
}


/* =========================================================
   AVATAR UPLOAD
   ========================================================= */

function handleAvatarUpload(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image file."
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload = function () {

        profileData.avatar =
            reader.result;

        saveProfile();

        renderAvatar();
    };

    reader.readAsDataURL(file);
}


/* =========================================================
   COVER UPLOAD
   ========================================================= */

function handleCoverUpload(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image file."
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload = function () {

        profileData.cover =
            reader.result;

        saveProfile();

        renderCover();
    };

    reader.readAsDataURL(file);
}


/* =========================================================
   PROFILE TABS
   ========================================================= */

function setupProfileTabs() {

    const tabs =
        document.querySelectorAll(
            ".profile-tab"
        );

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });

                tab.classList.add("active");

                const selectedTab =
                    tab.dataset.tab;

                console.log(
                    "Selected profile tab:",
                    selectedTab
                );
            }
        );

    });
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProfile();

        setupProfileTabs();


        const editButton =
            document.getElementById(
                "editProfileButton"
            );

        const closeButton =
            document.getElementById(
                "closeModalButton"
            );

        const form =
            document.getElementById(
                "profileForm"
            );

        const avatarButton =
            document.getElementById(
                "changeAvatarButton"
            );

        const avatarInput =
            document.getElementById(
                "avatarInput"
            );

        const coverButton =
            document.getElementById(
                "changeCoverButton"
            );

        const coverInput =
            document.getElementById(
                "coverInput"
            );


        if (editButton) {

            editButton.addEventListener(
                "click",
                openProfileModal
            );

        }


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeProfileModal
            );

        }


        if (form) {

            form.addEventListener(
                "submit",
                handleProfileSubmit
            );

        }


        if (avatarButton) {

            avatarButton.addEventListener(
                "click",
                () => {

                    avatarInput.click();

                }
            );

        }


        if (avatarInput) {

            avatarInput.addEventListener(
                "change",
                handleAvatarUpload
            );

        }


        if (coverButton) {

            coverButton.addEventListener(
                "click",
                () => {

                    coverInput.click();

                }
            );

        }


        if (coverInput) {

            coverInput.addEventListener(
                "change",
                handleCoverUpload
            );

        }

    }
);


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "profileModal"
            );

        if (
            modal &&
            event.target === modal
        ) {
            closeProfileModal();
        }

    }
);

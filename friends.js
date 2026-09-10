/* =========================================================
   VIBECONNECT — FRIENDS & CONNECTIONS
   ========================================================= */

const FRIENDS_STORAGE_KEY = "vibeConnectFriends";

const CURRENT_USER_ID = "me";


/* =========================================================
   DEMO PEOPLE
   ========================================================= */

const defaultPeople = [
    {
        id: "alex",
        name: "Alex Morgan",
        username: "@alexmorgan",
        avatar: "👨🏻‍💻",
        bio: "Developer • Technology • Coffee",
        followers: 1240
    },

    {
        id: "maya",
        name: "Maya Sharma",
        username: "@mayasharma",
        avatar: "👩🏻‍🎨",
        bio: "Creative mind • Photography • Design",
        followers: 890
    },

    {
        id: "arjun",
        name: "Arjun Singh",
        username: "@arjunsingh",
        avatar: "🧑🏻‍🚀",
        bio: "Tech enthusiast • AI • Gaming",
        followers: 1540
    },

    {
        id: "priya",
        name: "Priya Verma",
        username: "@priyaverma",
        avatar: "👩🏻‍💻",
        bio: "Student • Coding • Learning",
        followers: 720
    },

    {
        id: "rohan",
        name: "Rohan Mehta",
        username: "@rohanmehta",
        avatar: "🧑🏻‍🎮",
        bio: "Gamer • Esports • Streaming",
        followers: 2100
    },

    {
        id: "kabir",
        name: "Kabir Khan",
        username: "@kabirkhan",
        avatar: "🧑🏻‍🎵",
        bio: "Music • Travel • Photography",
        followers: 680
    },

    {
        id: "ananya",
        name: "Ananya Patel",
        username: "@ananyapatel",
        avatar: "👩🏻‍🔬",
        bio: "Science • AI • Education",
        followers: 1100
    },

    {
        id: "rahul",
        name: "Rahul Gupta",
        username: "@rahulgupta",
        avatar: "👨🏻‍💼",
        bio: "Entrepreneur • Startups • Tech",
        followers: 1750
    },

    {
        id: "neha",
        name: "Neha Joshi",
        username: "@nehajoshi",
        avatar: "👩🏻‍📚",
        bio: "Books • Education • Lifestyle",
        followers: 540
    }
];


/* =========================================================
   STATE
   ========================================================= */

let people = [];

let activeTab = "suggestions";

let searchTerm = "";


/* =========================================================
   LOAD DATA
   ========================================================= */

function loadFriendsData() {

    const saved =
        localStorage.getItem(FRIENDS_STORAGE_KEY);

    if (saved) {

        try {

            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed.people)) {
                people = parsed.people;
            } else {
                people = defaultPeople;
            }

        } catch (error) {

            console.warn(
                "Could not load friends data:",
                error
            );

            people = defaultPeople;
        }

    } else {

        people = defaultPeople.map(person => ({
            ...person,
            following: false
        }));

        saveFriendsData();
    }
}


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveFriendsData() {

    localStorage.setItem(
        FRIENDS_STORAGE_KEY,
        JSON.stringify({
            people
        })
    );
}


/* =========================================================
   ELEMENTS
   ========================================================= */

const peopleGrid =
    document.getElementById("peopleGrid");

const emptyFriends =
    document.getElementById("emptyFriends");

const friendSearch =
    document.getElementById("friendSearch");

const followersCount =
    document.getElementById("followersCount");

const followingCount =
    document.getElementById("followingCount");

const connectionsCount =
    document.getElementById("connectionsCount");

const friendsToast =
    document.getElementById("friendsToast");


/* =========================================================
   RENDER
   ========================================================= */

function renderPeople() {

    let filteredPeople = getPeopleForCurrentTab();

    if (searchTerm.trim()) {

        const query =
            searchTerm
                .trim()
                .toLowerCase();

        filteredPeople =
            filteredPeople.filter(person => {

                return (
                    person.name
                        .toLowerCase()
                        .includes(query) ||

                    person.username
                        .toLowerCase()
                        .includes(query) ||

                    person.bio
                        .toLowerCase()
                        .includes(query)
                );

            });
    }


    peopleGrid.innerHTML = "";


    if (filteredPeople.length === 0) {

        emptyFriends.classList.remove("hidden");

        return;
    }


    emptyFriends.classList.add("hidden");


    filteredPeople.forEach(person => {

        const card =
            document.createElement("article");

        card.className = "person-card";


        const followText =
            person.following
                ? "✓ Following"
                : "+ Follow";


        const followClass =
            person.following
                ? "following"
                : "";


        card.innerHTML = `

            <div class="person-avatar">
                ${getAvatarHTML(person)}
            </div>

            <h3>
                ${escapeHTML(person.name)}
            </h3>

            <div class="person-username">
                ${escapeHTML(person.username)}
            </div>

            <p class="person-bio">
                ${escapeHTML(person.bio)}
            </p>

            <div class="person-actions">

                <button
                    class="follow-button ${followClass}"
                    data-follow-id="${person.id}"
                >
                    ${followText}
                </button>

                <button
                    class="profile-button"
                    data-profile-id="${person.id}"
                >
                    View Profile
                </button>

            </div>

        `;


        peopleGrid.appendChild(card);

    });


    updateStats();
}


/* =========================================================
   TAB DATA
   ========================================================= */

function getPeopleForCurrentTab() {

    if (activeTab === "following") {

        return people.filter(
            person => person.following
        );
    }


    if (activeTab === "followers") {

        /*
         * Demo behavior:
         * people with higher follower counts
         * are shown as existing followers.
         */

        return people.filter(
            person => person.followers >= 1000
        );
    }


    /*
     * Suggestions
     */

    return people.filter(
        person => !person.following
    );
}


/* =========================================================
   AVATAR
   ========================================================= */

function getAvatarHTML(person) {

    if (
        person.avatar &&
        (
            person.avatar.startsWith("data:image") ||
            person.avatar.startsWith("http")
        )
    ) {

        return `
            <img
                src="${person.avatar}"
                alt="${escapeHTML(person.name)}"
            >
        `;
    }


    return escapeHTML(
        person.avatar || "👤"
    );
}


/* =========================================================
   FOLLOW / UNFOLLOW
   ========================================================= */

function toggleFollow(personId) {

    const person =
        people.find(
            item => item.id === personId
        );


    if (!person) {
        return;
    }


    person.following =
        !person.following;


    if (person.following) {

        showToast(
            `You are now following ${person.name} 💜`
        );

    } else {

        showToast(
            `You unfollowed ${person.name}`
        );
    }


    saveFriendsData();

    renderPeople();
}


/* =========================================================
   VIEW PROFILE
   ========================================================= */

function viewProfile(personId) {

    const person =
        people.find(
            item => item.id === personId
        );


    if (!person) {
        return;
    }


    showToast(
        `${person.name}'s profile will open here soon ✨`
    );
}


/* =========================================================
   SEARCH
   ========================================================= */

friendSearch.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value;

        renderPeople();
    }
);


/* =========================================================
   TAB SWITCHING
   ========================================================= */

document
    .querySelectorAll(".friend-tab")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".friend-tab")
                    .forEach(tab => {
                        tab.classList.remove("active");
                    });


                button.classList.add("active");


                activeTab =
                    button.dataset.tab;


                renderPeople();

            }
        );

    });


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

peopleGrid.addEventListener(
    "click",
    event => {

        const followButton =
            event.target.closest(
                "[data-follow-id]"
            );


        if (followButton) {

            toggleFollow(
                followButton.dataset.followId
            );

            return;
        }


        const profileButton =
            event.target.closest(
                "[data-profile-id]"
            );


        if (profileButton) {

            viewProfile(
                profileButton.dataset.profileId
            );
        }

    }
);


/* =========================================================
   UPDATE STATS
   ========================================================= */

function updateStats() {

    const following =
        people.filter(
            person => person.following
        ).length;


    /*
     * Demo follower count.
     * Later this will come from Supabase.
     */

    const followers =
        people.filter(
            person => person.followers >= 1000
        ).length;


    const connections =
        Math.min(
            following,
            followers
        );


    followersCount.textContent =
        followers;

    followingCount.textContent =
        following;

    connectionsCount.textContent =
        connections;
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(message) {

    friendsToast.textContent =
        message;

    friendsToast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            friendsToast.classList.remove(
                "show"
            );

        }, 2500);
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   START
   ========================================================= */

loadFriendsData();

renderPeople();

updateStats();


/* =========================================================
   GLOBAL API
   ========================================================= */

window.vibeConnectFriends = {

    getPeople() {
        return people;
    },

    follow(personId) {

        const person =
            people.find(
                item => item.id === personId
            );

        if (person && !person.following) {
            toggleFollow(personId);
        }
    },

    unfollow(personId) {

        const person =
            people.find(
                item => item.id === personId
            );

        if (person && person.following) {
            toggleFollow(personId);
        }
    },

    refresh() {
        loadFriendsData();
        renderPeople();
    }

};

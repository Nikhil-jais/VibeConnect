// ============================
// PAGE NAVIGATION
// ============================

function showPage(pageName) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================
// LIKE POST
// ============================

function likePost(button) {

    const post = button.closest(".post");

    const count = post.querySelector(".like-count");

    let likes = parseInt(count.textContent);

    if (button.dataset.liked === "true") {

        likes--;

        button.textContent = "♡";

        button.dataset.liked = "false";

    } else {

        likes++;

        button.textContent = "♥";

        button.dataset.liked = "true";
    }

    count.textContent = likes;
}


// ============================
// LIKE REEL
// ============================

function likeReel(button) {

    const span = button.querySelector("span");

    let number = parseFloat(span.textContent);

    if (button.dataset.liked === "true") {

        number--;

        button.dataset.liked = "false";

    } else {

        number++;

        button.dataset.liked = "true";
    }

    span.textContent = number + "K";
}


// ============================
// CREATE POST
// ============================

function createPost() {

    const username =
        document.getElementById("username").value.trim();

    const caption =
        document.getElementById("caption").value.trim();

    const emoji =
        document.getElementById("emoji").value.trim();


    if (!username || !caption) {

        alert("Please enter your username and caption.");

        return;
    }


    const post = document.createElement("article");

    post.className = "post";


    post.innerHTML = `

        <div class="post-header">

            <div class="user-avatar">
                👤
            </div>

            <div>

                <strong>${username}</strong>

                <p>@${username.toLowerCase()}</p>

            </div>

            <button class="more">
                •••
            </button>

        </div>


        <div class="post-image">

            ${emoji || "✨"}

        </div>


        <div class="post-actions">

            <button onclick="likePost(this)">
                ♡
            </button>

            <button>
                💬
            </button>

            <button>
                ↗️
            </button>

            <button class="save">
                🔖
            </button>

        </div>


        <div class="likes">

            <b class="like-count">
                0
            </b>

            likes

        </div>


        <div class="caption">

            <b>@${username.toLowerCase()}</b>
            ${caption}

        </div>


        <div class="comments">

            Be the first to comment

        </div>

    `;


    document
        .getElementById("postsContainer")
        .prepend(post);


    // Update profile post count

    const posts =
        document.querySelectorAll("#postsContainer .post").length;

    document.getElementById("postCount").textContent = posts;


    // Clear inputs

    document.getElementById("username").value = "";

    document.getElementById("caption").value = "";

    document.getElementById("emoji").value = "";


    // Return to home

    showPage("home");
}


// ============================
// SEARCH
// ============================

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const search =
            this.value.toLowerCase();

        const posts =
            document.querySelectorAll(".post");


        posts.forEach(post => {

            const text =
                post.textContent.toLowerCase();

            if (text.includes(search)) {

                post.style.display = "";

            } else {

                post.style.display = "none";

            }

        });

    });

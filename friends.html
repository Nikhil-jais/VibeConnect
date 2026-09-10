/* =========================================================
   VIBECONNECT
   SEARCH & DISCOVER
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           ELEMENTS
        ================================================= */

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const clearSearch =
            document.getElementById(
                "clearSearch"
            );


        const resultsSection =
            document.getElementById(
                "resultsSection"
            );


        const discoverSection =
            document.getElementById(
                "discoverSection"
            );


        const searchResults =
            document.getElementById(
                "searchResults"
            );


        const resultDescription =
            document.getElementById(
                "resultDescription"
            );


        const trendingList =
            document.getElementById(
                "trendingList"
            );


        const recentSearchSection =
            document.getElementById(
                "recentSearchSection"
            );


        const recentSearches =
            document.getElementById(
                "recentSearches"
            );


        const clearRecent =
            document.getElementById(
                "clearRecent"
            );


        const toast =
            document.getElementById(
                "toast"
            );


        /* =================================================
           STORAGE
        ================================================= */

        const RECENT_KEY =
            "vibeConnectRecentSearches";


        /* =================================================
           DEMO SEARCH DATA
        ================================================= */

        const searchData = [

            {
                id: 1,

                type: "person",

                icon: "👨‍💻",

                name: "Alex Johnson",

                username: "@alexdev",

                keywords:
                    "alex johnson alexdev developer coding technology programming"
            },


            {
                id: 2,

                type: "person",

                icon: "👩‍🎨",

                name: "Maya Sharma",

                username: "@mayacreates",

                keywords:
                    "maya sharma mayacreates design art photography creative"
            },


            {
                id: 3,

                type: "person",

                icon: "🧑‍💻",

                name: "Arjun Mehta",

                username: "@arjuntech",

                keywords:
                    "arjun mehta arjuntech technology ai software developer"
            },


            {
                id: 4,

                type: "person",

                icon: "👩‍💻",

                name: "Priya Singh",

                username: "@priyalearns",

                keywords:
                    "priya singh priyalearns education learning programming"
            },


            {
                id: 5,

                type: "post",

                icon: "💻",

                name: "Building my first web application",

                username: "Technology",

                keywords:
                    "building web application html css javascript technology coding"
            },


            {
                id: 6,

                type: "post",

                icon: "🤖",

                name: "The future of Artificial Intelligence",

                username: "AI",

                keywords:
                    "future artificial intelligence ai machine learning technology"
            },


            {
                id: 7,

                type: "post",

                icon: "🎮",

                name: "My favorite games this year",

                username: "Gaming",

                keywords:
                    "gaming games gamers video games"
            },


            {
                id: 8,

                type: "post",

                icon: "📸",

                name: "Photography tips for beginners",

                username: "Photography",

                keywords:
                    "photography photos camera editing creativity"
            },


            {
                id: 9,

                type: "topic",

                icon: "🚀",

                name: "Startups",

                username: "Trending topic",

                keywords:
                    "startup startups business entrepreneur entrepreneurship"
            },


            {
                id: 10,

                type: "topic",

                icon: "🧠",

                name: "Programming",

                username: "Trending topic",

                keywords:
                    "programming coding software developer development java python javascript"
            }

        ];


        /* =================================================
           TRENDING DATA
        ================================================= */

        const trendingData = [

            {
                title: "Artificial Intelligence",

                count: "12.4K posts",

                icon: "🤖"
            },


            {
                title: "Web Development",

                count: "9.8K posts",

                icon: "💻"
            },


            {
                title: "Gaming",

                count: "8.7K posts",

                icon: "🎮"
            },


            {
                title: "Photography",

                count: "6.2K posts",

                icon: "📸"
            },


            {
                title: "Programming",

                count: "5.9K posts",

                icon: "🧑‍💻"
            },


            {
                title: "Student Life",

                count: "4.6K posts",

                icon: "📚"
            }

        ];


        /* =================================================
           INITIALIZE
        ================================================= */

        renderTrending();

        renderRecentSearches();


        /* =================================================
           SEARCH INPUT
        ================================================= */

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value.trim();


                if (query.length > 0) {

                    clearSearch.classList.add(
                        "visible"
                    );

                    performSearch(
                        query
                    );

                } else {

                    clearSearch.classList.remove(
                        "visible"
                    );

                    showDiscover();

                }

            }
        );


        /* =================================================
           ENTER KEY
        ================================================= */

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    const query =
                        searchInput.value.trim();


                    if (query) {

                        addRecentSearch(
                            query
                        );

                    }

                }

            }
        );


        /* =================================================
           CLEAR SEARCH
        ================================================= */

        clearSearch.addEventListener(
            "click",
            () => {

                searchInput.value = "";

                clearSearch.classList.remove(
                    "visible"
                );

                showDiscover();

                searchInput.focus();

            }
        );


        /* =================================================
           PERFORM SEARCH
        ================================================= */

        function performSearch(
            query
        ) {

            const normalizedQuery =
                query.toLowerCase();


            const results =
                searchData.filter(
                    item => {

                        return (
                            item.name
                                .toLowerCase()
                                .includes(
                                    normalizedQuery
                                )

                            ||

                            item.username
                                .toLowerCase()
                                .includes(
                                    normalizedQuery
                                )

                            ||

                            item.keywords
                                .toLowerCase()
                                .includes(
                                    normalizedQuery
                                )
                        );

                    }
                );


            resultsSection.hidden =
                false;

            discoverSection.hidden =
                true;


            resultDescription.textContent =
                `${results.length} ${
                    results.length === 1
                        ? "result"
                        : "results"
                } for "${query}"`;


            renderResults(
                results
            );

        }


        /* =================================================
           RENDER RESULTS
        ================================================= */

        function renderResults(
            results
        ) {

            searchResults.innerHTML =
                "";


            if (
                results.length === 0
            ) {

                searchResults.innerHTML = `

                    <div class="no-results">

                        <div class="no-results-icon">
                            🔍
                        </div>

                        <h3>
                            Nothing found
                        </h3>

                        <p>
                            Try searching for another
                            person, topic or keyword.
                        </p>

                    </div>

                `;

                return;

            }


            results.forEach(
                result => {

                    const item =
                        document.createElement(
                            "article"
                        );


                    item.className =
                        "result-item";


                    item.innerHTML = `

                        <div class="result-avatar">
                            ${escapeHTML(
                                result.icon
                            )}
                        </div>


                        <div class="result-content">

                            <strong>
                                ${escapeHTML(
                                    result.name
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    result.username
                                )}
                            </span>

                        </div>


                        <span class="result-type">
                            ${escapeHTML(
                                result.type
                            )}
                        </span>

                    `;


                    item.addEventListener(
                        "click",
                        () => {

                            addRecentSearch(
                                result.name
                            );


                            showToast(
                                `Opening ${result.name}...`
                            );

                        }
                    );


                    searchResults.appendChild(
                        item
                    );

                }
            );

        }


        /* =================================================
           SHOW DISCOVER
        ================================================= */

        function showDiscover() {

            resultsSection.hidden =
                true;

            discoverSection.hidden =
                false;

        }


        /* =================================================
           TRENDING
        ================================================= */

        function renderTrending() {

            trendingList.innerHTML =
                "";


            trendingData.forEach(
                (trend, index) => {

                    const item =
                        document.createElement(
                            "button"
                        );


                    item.type =
                        "button";


                    item.className =
                        "trending-item";


                    item.innerHTML = `

                        <span class="trending-number">
                            ${index + 1}
                        </span>


                        <span
                            class="trending-content"
                        >

                            <strong>
                                ${escapeHTML(
                                    trend.icon
                                )}
                                ${escapeHTML(
                                    trend.title
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    trend.count
                                )}
                            </span>

                        </span>

                    `;


                    item.addEventListener(
                        "click",
                        () => {

                            searchInput.value =
                                trend.title;

                            clearSearch.classList.add(
                                "visible"
                            );

                            performSearch(
                                trend.title
                            );

                            addRecentSearch(
                                trend.title
                            );

                        }
                    );


                    trendingList.appendChild(
                        item
                    );

                }
            );

        }


        /* =================================================
           RECENT SEARCHES
        ================================================= */

        function getRecentSearches() {

            try {

                const saved =
                    localStorage.getItem(
                        RECENT_KEY
                    );


                return saved
                    ? JSON.parse(saved)
                    : [];

            } catch {

                return [];

            }

        }


        function saveRecentSearches(
            searches
        ) {

            localStorage.setItem(
                RECENT_KEY,
                JSON.stringify(
                    searches
                )
            );

        }


        function addRecentSearch(
            query
        ) {

            const cleanQuery =
                query.trim();


            if (!cleanQuery) {
                return;
            }


            let searches =
                getRecentSearches();


            searches =
                searches.filter(
                    item =>
                        item.toLowerCase() !==
                        cleanQuery.toLowerCase()
                );


            searches.unshift(
                cleanQuery
            );


            searches =
                searches.slice(
                    0,
                    8
                );


            saveRecentSearches(
                searches
            );


            renderRecentSearches();

        }


        function renderRecentSearches() {

            const searches =
                getRecentSearches();


            recentSearches.innerHTML =
                "";


            if (
                searches.length === 0
            ) {

                recentSearchSection.hidden =
                    true;

                return;

            }


            recentSearchSection.hidden =
                false;


            searches.forEach(
                search => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "recent-item";


                    const text =
                        document.createElement(
                            "span"
                        );


                    text.textContent =
                        `🕘 ${search}`;


                    text.addEventListener(
                        "click",
                        () => {

                            searchInput.value =
                                search;

                            clearSearch.classList.add(
                                "visible"
                            );

                            performSearch(
                                search
                            );

                        }
                    );


                    const remove =
                        document.createElement(
                            "button"
                        );


                    remove.type =
                        "button";


                    remove.textContent =
                        "×";


                    remove.setAttribute(
                        "aria-label",
                        `Remove ${search}`
                    );


                    remove.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            removeRecentSearch(
                                search
                            );

                        }
                    );


                    item.appendChild(
                        text
                    );

                    item.appendChild(
                        remove
                    );


                    recentSearches.appendChild(
                        item
                    );

                }
            );

        }


        /* =================================================
           REMOVE RECENT SEARCH
        ================================================= */

        function removeRecentSearch(
            query
        ) {

            const searches =
                getRecentSearches()
                    .filter(
                        item =>
                            item !== query
                    );


            saveRecentSearches(
                searches
            );


            renderRecentSearches();

        }


        /* =================================================
           CLEAR ALL RECENT
        ================================================= */

        clearRecent.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    RECENT_KEY
                );


                renderRecentSearches();


                showToast(
                    "Recent searches cleared"
                );

            }
        );


        /* =================================================
           TOPIC CARDS
        ================================================= */

        document
            .querySelectorAll(
                ".topic-card"
            )
            .forEach(
                card => {

                    card.addEventListener(
                        "click",
                        () => {

                            const topic =
                                card.dataset.topic;


                            searchInput.value =
                                topic;


                            clearSearch.classList.add(
                                "visible"
                            );


                            performSearch(
                                topic
                            );


                            addRecentSearch(
                                topic
                            );

                        }
                    );

                }
            );


        /* =================================================
           TOAST
        ================================================= */

        function showToast(
            message
        ) {

            toast.textContent =
                message;


            toast.classList.add(
                "show"
            );


            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2300
            );

        }


        /* =================================================
           ESCAPE HTML
        ================================================= */

        function escapeHTML(
            value
        ) {

            return String(
                value ?? ""
            )
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                )
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#039;"
                );

        }

    }
);

"use strict";

/* =========================================================
VIBECONNECT DATABASE CENTER
STEP 21
========================================================= */

/* =========================================================
TABLE DEFINITIONS
========================================================= */

const databaseTables = [

```
{
    name: "profiles",
    icon: "👤",
    description: "User profile information"
},

{
    name: "posts",
    icon: "📝",
    description: "Posts created by users"
},

{
    name: "comments",
    icon: "💬",
    description: "Comments on posts"
},

{
    name: "likes",
    icon: "❤️",
    description: "Post likes"
},

{
    name: "follows",
    icon: "👥",
    description: "User following relationships"
},

{
    name: "saved_posts",
    icon: "🔖",
    description: "Posts saved by users"
},

{
    name: "notifications",
    icon: "🔔",
    description: "User notifications"
},

{
    name: "messages",
    icon: "✉️",
    description: "Direct messages"
},

{
    name: "stories",
    icon: "⭕",
    description: "Temporary user stories"
},

{
    name: "hashtags",
    icon: "#️⃣",
    description: "Hashtags and topics"
}
```

];

/* =========================================================
DOM
========================================================= */

const backButton =
document.getElementById("backButton");

const statusIcon =
document.getElementById("statusIcon");

const statusTitle =
document.getElementById("statusTitle");

const statusMessage =
document.getElementById("statusMessage");

const statusBadge =
document.getElementById("statusBadge");

const tablesGrid =
document.getElementById("tablesGrid");

const tableCount =
document.getElementById("tableCount");

const checkDatabaseButton =
document.getElementById("checkDatabase");

const copyChecklistButton =
document.getElementById("copyChecklist");

const toast =
document.getElementById("toast");

/* =========================================================
STATE
========================================================= */

let databaseAvailable =
false;

let toastTimer = null;

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

    }, 2800);
```

}

/* =========================================================
SUPABASE CHECK
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
CONNECTION STATUS
========================================================= */

async function checkConnection() {

```
statusIcon.textContent =
    "⏳";

statusTitle.textContent =
    "Checking connection...";

statusMessage.textContent =
    "Connecting to your Supabase project.";

statusBadge.textContent =
    "CHECKING";

statusBadge.className =
    "status-badge";


const supabase =
    getSupabaseClient();


if (!supabase) {

    databaseAvailable =
        false;

    statusIcon.textContent =
        "⚠️";

    statusTitle.textContent =
        "Supabase is not configured";

    statusMessage.textContent =
        "Open supabase.js and add your Supabase project URL and publishable key.";

    statusBadge.textContent =
        "SETUP NEEDED";

    statusBadge.classList.add(
        "warning"
    );

    renderTables([]);

    return;
}


try {

    const result =
        await supabase
            .from("profiles")
            .select("id")
            .limit(1);


    if (result.error) {

        throw result.error;
    }


    databaseAvailable =
        true;


    statusIcon.textContent =
        "✓";

    statusTitle.textContent =
        "Supabase connected";

    statusMessage.textContent =
        "Your VibeConnect frontend can communicate with Supabase.";

    statusBadge.textContent =
        "CONNECTED";

    statusBadge.classList.add(
        "connected"
    );


    await checkTables();


} catch (error) {

    databaseAvailable =
        false;


    const message =
        error?.message ||
        "Unable to connect to Supabase.";


    statusIcon.textContent =
        "⚠️";

    statusTitle.textContent =
        "Database setup is incomplete";

    statusMessage.textContent =
        message;

    statusBadge.textContent =
        "ACTION NEEDED";

    statusBadge.classList.add(
        "warning"
    );


    await checkTables();
}
```

}

/* =========================================================
CHECK TABLES
========================================================= */

async function checkTables() {

```
const supabase =
    getSupabaseClient();


if (!supabase) {

    renderTables([]);

    return;
}


const existing =
    [];


for (
    const table of databaseTables
) {

    try {

        const result =
            await supabase
                .from(table.name)
                .select("*")
                .limit(1);


        if (!result.error) {

            existing.push(
                table.name
            );
        }

    } catch {

        // Table is unavailable.
    }
}


renderTables(existing);


if (
    existing.length ===
    databaseTables.length
) {

    statusIcon.textContent =
        "✓";

    statusTitle.textContent =
        "Database is ready";

    statusMessage.textContent =
        "All VibeConnect foundation tables are available.";

    statusBadge.textContent =
        "READY";

    statusBadge.className =
        "status-badge connected";

    databaseAvailable =
        true;
}
```

}

/* =========================================================
RENDER TABLES
========================================================= */

function renderTables(
existingTables
) {

```
tablesGrid.innerHTML =
    "";


let existingCount =
    0;


databaseTables.forEach(
    table => {

        const exists =
            existingTables.includes(
                table.name
            );


        if (exists) {

            existingCount++;
        }


        const card =
            document.createElement(
                "div"
            );

        card.className =
            "table-card";


        card.innerHTML = `

            <div class="table-icon">
                ${table.icon}
            </div>

            <div class="table-info">

                <strong>
                    ${escapeHTML(table.name)}
                </strong>

                <span>
                    ${escapeHTML(table.description)}
                </span>

            </div>

            <span
                class="table-status ${
                    exists
                        ? "exists"
                        : "missing"
                }"
            >
                ${
                    exists
                        ? "READY"
                        : "MISSING"
                }
            </span>

        `;


        tablesGrid.appendChild(
            card
        );

    }
);


tableCount.textContent =
    `${existingCount} / ${databaseTables.length}`;
```

}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHTML(value) {

```
return String(value ?? "")
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
```

}

/* =========================================================
COPY CHECKLIST
========================================================= */

copyChecklistButton.addEventListener(
"click",
async () => {

```
    const checklist =
        databaseTables
            .map(
                table =>
                    `CREATE TABLE: ${table.name}`
            )
            .join("\n");


    try {

        await navigator.clipboard.writeText(
            checklist
        );

        showToast(
            "Table checklist copied."
        );

    } catch {

        showToast(
            "Clipboard access is unavailable."
        );
    }
}
```

);

/* =========================================================
CHECK DATABASE BUTTON
========================================================= */

checkDatabaseButton.addEventListener(
"click",
async () => {

```
    checkDatabaseButton.disabled =
        true;

    checkDatabaseButton.textContent =
        "⏳ Checking...";


    await checkConnection();


    checkDatabaseButton.disabled =
        false;

    checkDatabaseButton.textContent =
        "🔄 Check Database";

    showToast(
        "Database check completed."
    );
}
```

);

/* =========================================================
BACK BUTTON
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
INITIALIZE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

```
    renderTables([]);

    checkConnection();

}
```

);

/* =========================================================
PUBLIC API
========================================================= */

window.vibeConnectDatabase = {

```
getTables() {

    return [...databaseTables];
},

isConnected() {

    return databaseAvailable;
},

check() {

    return checkConnection();
}
```

};

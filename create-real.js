```javascript
/* =========================================================
   VIBECONNECT
   STEP 32 — REAL POST CREATION
   Supabase Post + Storage Upload
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const STORAGE_BUCKET = "vibe-media";

    const MAX_IMAGE_SIZE =
        10 * 1024 * 1024;

    const MAX_VIDEO_SIZE =
        50 * 1024 * 1024;


    /* =====================================================
       STATE
       ===================================================== */

    const state = {

        client: null,

        user: null,

        profile: null,

        selectedFile: null,

        previewUrl: null,

        publishing: false

    };


    /* =====================================================
       DOM
       ===================================================== */

    const elements = {

        loginState:
            document.getElementById(
                "loginState"
            ),

        composer:
            document.getElementById(
                "composer"
            ),

        userAvatar:
            document.getElementById(
                "userAvatar"
            ),

        userName:
            document.getElementById(
                "userName"
            ),

        userUsername:
            document.getElementById(
                "userUsername"
            ),

        postContent:
            document.getElementById(
                "postContent"
            ),

        characterCount:
            document.getElementById(
                "characterCount"
            ),

        mediaInput:
            document.getElementById(
                "mediaInput"
            ),

        uploadBox:
            document.getElementById(
                "uploadBox"
            ),

        previewSection:
            document.getElementById(
                "previewSection"
            ),

        mediaPreview:
            document.getElementById(
                "mediaPreview"
            ),

        fileInfo:
            document.getElementById(
                "fileInfo"
            ),

        removeMedia:
            document.getElementById(
                "removeMedia"
            ),

        progressSection:
            document.getElementById(
                "progressSection"
            ),

        progressTitle:
            document.getElementById(
                "progressTitle"
            ),

        progressPercent:
            document.getElementById(
                "progressPercent"
            ),

        progressBar:
            document.getElementById(
                "progressBar"
            ),

        progressMessage:
            document.getElementById(
                "progressMessage"
            ),

        clearButton:
            document.getElementById(
                "clearButton"
            ),

        publishButton:
            document.getElementById(
                "publishButton"
            ),

        toast:
            document.getElementById(
                "toast"
            )
    };


    /* =====================================================
       SUPABASE CLIENT
       ===================================================== */

    function getSupabaseClient() {

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
       HELPERS
       ===================================================== */

    function showToast(message) {

        elements.toast.textContent =
            message;

        elements.toast.classList.add(
            "show"
        );

        clearTimeout(
            showToast.timer
        );

        showToast.timer =
            setTimeout(() => {

                elements.toast.classList.remove(
                    "show"
                );

            }, 2800);
    }


    function getInitials(name) {

        const clean =
            String(name || "V")
                .trim();

        if (!clean) {
            return "V";
        }

        return clean
            .split(/\s+/)
            .slice(0, 2)
            .map(word =>
                word.charAt(0)
            )
            .join("")
            .toUpperCase();
    }


    function formatBytes(bytes) {

        if (!bytes) {
            return "0 B";
        }

        const units = [
            "B",
            "KB",
            "MB",
            "GB"
        ];

        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );

        return (
            bytes /
            Math.pow(1024, index)
        ).toFixed(
            index === 0 ? 0 : 2
        ) +
        " " +
        units[index];
    }


    function createSafeFileName(file) {

        const original =
            file.name || "media";

        const extension =
            original.includes(".")
                ? original
                    .split(".")
                    .pop()
                    .toLowerCase()
                : "";

        const randomPart =
            Math.random()
                .toString(36)
                .slice(2, 10);

        const time =
            Date.now();


        return (
            `${state.user.id}/` +
            `${time}-${randomPart}` +
            `${extension ? "." + extension : ""}`
        );
    }


    function setProgress(
        percent,
        title,
        message
    ) {

        const safePercent =
            Math.max(
                0,
                Math.min(
                    100,
                    percent
                )
            );


        elements.progressSection.classList.remove(
            "hidden"
        );


        elements.progressTitle.textContent =
            title;


        elements.progressPercent.textContent =
            `${Math.round(safePercent)}%`;


        elements.progressBar.style.width =
            `${safePercent}%`;


        elements.progressMessage.textContent =
            message;
    }


    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    async function getCurrentUser() {

        const {
            data,
            error
        } =
            await state.client.auth.getUser();


        if (error) {

            console.error(
                "Authentication error:",
                error
            );

            return null;
        }


        return data?.user || null;
    }


    async function loadProfile() {

        if (!state.user) {
            return;
        }


        const {
            data,
            error
        } =
            await state.client
                .from("profiles")
                .select(`
                    id,
                    display_name,
                    username,
                    avatar_url
                `)
                .eq(
                    "id",
                    state.user.id
                )
                .maybeSingle();


        if (error) {

            console.warn(
                "Profile lookup warning:",
                error
            );
        }


        state.profile =
            data ||
            {
                display_name:
                    state.user
                        .user_metadata
                        ?.display_name,

                username:
                    state.user
                        .user_metadata
                        ?.username,

                avatar_url:
                    state.user
                        .user_metadata
                        ?.avatar_url
            };


        renderProfile();
    }


    function renderProfile() {

        const name =
            state.profile?.display_name ||
            state.profile?.username ||
            "Vibe User";


        const username =
            state.profile?.username ||
            "user";


        const avatar =
            state.profile?.avatar_url ||
            "";


        elements.userName.textContent =
            name;


        elements.userUsername.textContent =
            `@${username}`;


        if (avatar) {

            elements.userAvatar.innerHTML = `
                <img
                    src="${avatar}"
                    alt=""
                >
            `;

        } else {

            elements.userAvatar.textContent =
                getInitials(name);
        }
    }


    /* =====================================================
       TEXT COUNTER
       ===================================================== */

    function updateCharacterCount() {

        const length =
            elements.postContent.value.length;


        elements.characterCount.textContent =
            String(length);


        if (length >= 4800) {

            elements.characterCount.style.color =
                "#df4d5d";

        } else {

            elements.characterCount.style.color =
                "";
        }
    }


    /* =====================================================
       FILE VALIDATION
       ===================================================== */

    function validateFile(file) {

        if (!file) {
            return false;
        }


        const isImage =
            file.type.startsWith(
                "image/"
            );


        const isVideo =
            file.type.startsWith(
                "video/"
            );


        if (!isImage && !isVideo) {

            showToast(
                "Please choose an image or video."
            );

            return false;
        }


        if (
            isImage &&
            file.size > MAX_IMAGE_SIZE
        ) {

            showToast(
                "Images must be 10 MB or smaller."
            );

            return false;
        }


        if (
            isVideo &&
            file.size > MAX_VIDEO_SIZE
        ) {

            showToast(
                "Videos must be 50 MB or smaller."
            );

            return false;
        }


        return true;
    }


    /* =====================================================
       FILE SELECTION
       ===================================================== */

    function handleFile(file) {

        if (!validateFile(file)) {
            return;
        }


        removeSelectedMedia();


        state.selectedFile =
            file;


        state.previewUrl =
            URL.createObjectURL(
                file
            );


        renderPreview();
    }


    function renderPreview() {

        const file =
            state.selectedFile;


        if (!file) {
            return;
        }


        elements.previewSection.classList.remove(
            "hidden"
        );


        elements.mediaPreview.innerHTML =
            "";


        const isVideo =
            file.type.startsWith(
                "video/"
            );


        if (isVideo) {

            const video =
                document.createElement(
                    "video"
                );

            video.controls = true;

            video.playsInline = true;

            video.preload = "metadata";

            video.src =
                state.previewUrl;


            elements.mediaPreview.appendChild(
                video
            );

        } else {

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                state.previewUrl;

            image.alt =
                "Selected media";


            elements.mediaPreview.appendChild(
                image
            );
        }


        elements.fileInfo.textContent =
            `${file.name} · ${formatBytes(file.size)}`;
    }


    function removeSelectedMedia() {

        if (state.previewUrl) {

            URL.revokeObjectURL(
                state.previewUrl
            );
        }


        state.previewUrl =
            null;


        state.selectedFile =
            null;


        elements.mediaPreview.innerHTML =
            "";


        elements.fileInfo.textContent =
            "";


        elements.previewSection.classList.add(
            "hidden"
        );


        elements.mediaInput.value =
            "";
    }


    /* =====================================================
       DRAG & DROP
       ===================================================== */

    function setupDragDrop() {

        [
            "dragenter",
            "dragover"
        ].forEach(eventName => {

            elements.uploadBox.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    elements.uploadBox.classList.add(
                        "dragging"
                    );
                }
            );
        });


        [
            "dragleave",
            "drop"
        ].forEach(eventName => {

            elements.uploadBox.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    elements.uploadBox.classList.remove(
                        "dragging"
                    );
                }
            );
        });


        elements.uploadBox.addEventListener(
            "drop",
            event => {

                const file =
                    event.dataTransfer
                        ?.files?.[0];


                if (file) {
                    handleFile(file);
                }
            }
        );
    }


    /* =====================================================
       STORAGE UPLOAD
       ===================================================== */

    async function uploadMedia() {

        const file =
            state.selectedFile;


        if (!file) {
            return null;
        }


        setProgress(
            5,
            "Preparing upload...",
            "Connecting to Supabase Storage."
        );


        const path =
            createSafeFileName(
                file
            );


        setProgress(
            20,
            "Uploading media...",
            "Sending your file to secure storage."
        );


        const {
            error
        } =
            await state.client
                .storage
                .from(STORAGE_BUCKET)
                .upload(
                    path,
                    file,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType:
                            file.type ||
                            undefined
                    }
                );


        if (error) {

            console.error(
                "Storage upload error:",
                error
            );

            throw new Error(
                `Media upload failed: ${error.message}`
            );
        }


        setProgress(
            75,
            "Finalizing media...",
            "Creating the public media URL."
        );


        const {
            data
        } =
            state.client
                .storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(
                    path
                );


        const publicUrl =
            data?.publicUrl;


        if (!publicUrl) {

            throw new Error(
                "Supabase did not return a media URL."
            );
        }


        setProgress(
            90,
            "Media ready",
            "Preparing your post."
        );


        return {
            url: publicUrl,
            path: path,
            type: file.type
        };
    }


    /* =====================================================
       CREATE POST
       ===================================================== */

    async function createPost() {

        if (state.publishing) {
            return;
        }


        if (!state.user) {

            showToast(
                "Please sign in before publishing."
            );

            return;
        }


        const content =
            elements.postContent.value.trim();


        if (
            !content &&
            !state.selectedFile
        ) {

            showToast(
                "Add some text or media first."
            );

            return;
        }


        if (content.length > 5000) {

            showToast(
                "Your post is too long."
            );

            return;
        }


        state.publishing =
            true;


        elements.publishButton.disabled =
            true;


        elements.clearButton.disabled =
            true;


        try {

            let media = null;


            if (state.selectedFile) {

                media =
                    await uploadMedia();
            }


            setProgress(
                media ? 95 : 40,
                "Publishing post...",
                "Saving your post to the database."
            );


            const {
                data,
                error
            } =
                await state.client
                    .from("posts")
                    .insert({
                        user_id:
                            state.user.id,

                        content:
                            content ||
                            null,

                        media_url:
                            media?.url ||
                            null,

                        media_type:
                            media?.type ||
                            null
                    })
                    .select()
                    .single();


            if (error) {

                console.error(
                    "Post creation error:",
                    error
                );


                /*
                 * If database creation fails after
                 * media upload, remove the uploaded
                 * file so an unused media file isn't
                 * left behind.
                 */

                if (media?.path) {

                    await state.client
                        .storage
                        .from(STORAGE_BUCKET)
                        .remove([
                            media.path
                        ]);
                }


                throw new Error(
                    `Post creation failed: ${error.message}`
                );
            }


            setProgress(
                100,
                "Published!",
                "Your post is now live."
            );


            showToast(
                "🚀 Your post is live!"
            );


            /*
             * Give the user a moment to see
             * the successful upload state.
             */

            setTimeout(() => {

                window.location.href =
                    "home.html";

            }, 900);


        } catch (error) {

            console.error(
                "Publishing error:",
                error
            );


            elements.progressSection.classList.add(
                "hidden"
            );


            showToast(
                error.message ||
                "Something went wrong while publishing."
            );


        } finally {

            state.publishing =
                false;


            elements.publishButton.disabled =
                false;


            elements.clearButton.disabled =
                false;
        }
    }


    /* =====================================================
       CLEAR COMPOSER
       ===================================================== */

    function clearComposer() {

        if (state.publishing) {
            return;
        }


        elements.postContent.value =
            "";


        updateCharacterCount();


        removeSelectedMedia();


        elements.progressSection.classList.add(
            "hidden"
        );


        showToast(
            "Composer cleared."
        );
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    elements.postContent.addEventListener(
        "input",
        updateCharacterCount
    );


    elements.mediaInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files?.[0];


            if (file) {
                handleFile(file);
            }
        }
    );


    elements.removeMedia.addEventListener(
        "click",
        removeSelectedMedia
    );


    elements.clearButton.addEventListener(
        "click",
        clearComposer
    );


    elements.publishButton.addEventListener(
        "click",
        createPost
    );


    setupDragDrop();


    /* =====================================================
       LOGGED OUT
       ===================================================== */

    function showLoggedOut() {

        elements.loginState.classList.remove(
            "hidden"
        );


        elements.composer.classList.add(
            "hidden"
        );
    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    async function initialize() {

        state.client =
            getSupabaseClient();


        if (!state.client) {

            showToast(
                "Supabase is not configured."
            );

            showLoggedOut();

            return;
        }


        state.user =
            await getCurrentUser();


        if (!state.user) {

            showLoggedOut();

            return;
        }


        await loadProfile();


        updateCharacterCount();


        console.log(
            "VibeConnect Real Create initialized."
        );
    }


    /* =====================================================
       AUTH LISTENER
       ===================================================== */

    async function setupAuthListener() {

        if (!state.client) {
            return;
        }


        state.client.auth.onAuthStateChange(
            async (
                event,
                session
            ) => {

                if (
                    event ===
                    "SIGNED_OUT"
                ) {

                    state.user = null;

                    showLoggedOut();

                    return;
                }


                if (
                    event ===
                        "SIGNED_IN" ||
                    event ===
                        "TOKEN_REFRESHED"
                ) {

                    state.user =
                        session?.user ||
                        await getCurrentUser();


                    if (state.user) {

                        elements.loginState.classList.add(
                            "hidden"
                        );

                        elements.composer.classList.remove(
                            "hidden"
                        );

                        await loadProfile();
                    }
                }
            }
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.vibeConnectCreateReal = {

        getCurrentUser: function () {
            return state.user;
        },

        getSelectedFile: function () {
            return state.selectedFile;
        },

        clear: clearComposer,

        publish: createPost
    };


    /* =====================================================
       START
       ===================================================== */

    initialize().then(() => {

        setupAuthListener();

    });


})();
```

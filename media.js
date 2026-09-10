/* =========================================================
   VIBECONNECT
   MEDIA STUDIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const mediaInput =
        document.getElementById("mediaInput");

    const uploadArea =
        document.getElementById("uploadArea");

    const uploadTitle =
        document.getElementById("uploadTitle");

    const uploadDescription =
        document.getElementById("uploadDescription");

    const imageTypeButton =
        document.getElementById("imageTypeButton");

    const videoTypeButton =
        document.getElementById("videoTypeButton");

    const fileInformation =
        document.getElementById("fileInformation");

    const fileName =
        document.getElementById("fileName");

    const fileSize =
        document.getElementById("fileSize");

    const fileIcon =
        document.getElementById("fileIcon");

    const removeFile =
        document.getElementById("removeFile");

    const previewSection =
        document.getElementById("previewSection");

    const mediaPreview =
        document.getElementById("mediaPreview");

    const mediaTitle =
        document.getElementById("mediaTitle");

    const mediaCaption =
        document.getElementById("mediaCaption");

    const captionCount =
        document.getElementById("captionCount");

    const uploadButton =
        document.getElementById("uploadButton");

    const clearButton =
        document.getElementById("clearButton");

    const progressSection =
        document.getElementById("progressSection");

    const progressFill =
        document.getElementById("progressFill");

    const progressPercent =
        document.getElementById("progressPercent");

    const statusMessage =
        document.getElementById("statusMessage");

    const mediaGrid =
        document.getElementById("mediaGrid");

    const mediaCount =
        document.getElementById("mediaCount");

    const toast =
        document.getElementById("toast");


    /* =====================================================
       STATE
    ===================================================== */

    let selectedFile = null;

    let selectedType = "image";

    let previewURL = null;

    let uploadedMedia = [];


    /* =====================================================
       SETTINGS
    ===================================================== */

    const SETTINGS = {

        maxImageSize:
            10 * 1024 * 1024,

        maxVideoSize:
            50 * 1024 * 1024,

        storageKey:
            "vibeConnectMedia"

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadLocalMedia();

    updateUploadInterface();


    /* =====================================================
       MEDIA TYPE BUTTONS
    ===================================================== */

    imageTypeButton.addEventListener(
        "click",
        () => {

            selectedType = "image";

            imageTypeButton.classList.add("active");

            videoTypeButton.classList.remove("active");

            mediaInput.accept = "image/*";

            uploadTitle.textContent =
                "Select a photo";

            uploadDescription.textContent =
                "JPG, PNG, WEBP or GIF";

            clearSelectedFile();

        }
    );


    videoTypeButton.addEventListener(
        "click",
        () => {

            selectedType = "video";

            videoTypeButton.classList.add("active");

            imageTypeButton.classList.remove("active");

            mediaInput.accept = "video/*";

            uploadTitle.textContent =
                "Select a video";

            uploadDescription.textContent =
                "MP4, WEBM or MOV";

            clearSelectedFile();

        }
    );


    /* =====================================================
       FILE SELECTION
    ===================================================== */

    mediaInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            handleFile(file);

        }
    );


    /* =====================================================
       DRAG & DROP
    ===================================================== */

    uploadArea.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            uploadArea.classList.add("dragging");

        }
    );


    uploadArea.addEventListener(
        "dragleave",
        () => {

            uploadArea.classList.remove(
                "dragging"
            );

        }
    );


    uploadArea.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            uploadArea.classList.remove(
                "dragging"
            );

            const file =
                event.dataTransfer.files[0];

            if (!file) {
                return;
            }

            handleFile(file);

        }
    );


    /* =====================================================
       HANDLE FILE
    ===================================================== */

    function handleFile(file) {

        const validType =
            selectedType === "image"
                ? file.type.startsWith("image/")
                : file.type.startsWith("video/");


        if (!validType) {

            showStatus(
                `Please select a valid ${selectedType} file.`,
                "error"
            );

            return;

        }


        const maxSize =
            selectedType === "image"
                ? SETTINGS.maxImageSize
                : SETTINGS.maxVideoSize;


        if (file.size > maxSize) {

            const limit =
                selectedType === "image"
                    ? "10 MB"
                    : "50 MB";

            showStatus(
                `File is too large. Maximum size is ${limit}.`,
                "error"
            );

            return;

        }


        selectedFile = file;

        displayFile(file);

        createPreview(file);

        showStatus(
            "Media is ready to upload.",
            "info"
        );

    }


    /* =====================================================
       DISPLAY FILE
    ===================================================== */

    function displayFile(file) {

        fileInformation.hidden = false;

        fileName.textContent =
            file.name;

        fileSize.textContent =
            formatFileSize(file.size);


        fileIcon.textContent =
            selectedType === "image"
                ? "🖼️"
                : "🎥";

    }


    /* =====================================================
       CREATE PREVIEW
    ===================================================== */

    function createPreview(file) {

        mediaPreview.innerHTML = "";

        if (previewURL) {

            URL.revokeObjectURL(
                previewURL
            );

        }


        previewURL =
            URL.createObjectURL(file);


        if (selectedType === "image") {

            const image =
                document.createElement("img");

            image.src =
                previewURL;

            image.alt =
                "Selected image preview";

            mediaPreview.appendChild(
                image
            );

        } else {

            const video =
                document.createElement("video");

            video.src =
                previewURL;

            video.controls = true;

            video.preload = "metadata";

            mediaPreview.appendChild(
                video
            );

        }


        previewSection.hidden = false;

    }


    /* =====================================================
       REMOVE FILE
    ===================================================== */

    removeFile.addEventListener(
        "click",
        clearSelectedFile
    );


    function clearSelectedFile() {

        selectedFile = null;

        mediaInput.value = "";

        fileInformation.hidden = true;

        previewSection.hidden = true;

        mediaPreview.innerHTML = "";

        if (previewURL) {

            URL.revokeObjectURL(
                previewURL
            );

            previewURL = null;

        }

        hideStatus();

    }


    /* =====================================================
       CAPTION COUNTER
    ===================================================== */

    mediaCaption.addEventListener(
        "input",
        () => {

            captionCount.textContent =
                mediaCaption.value.length;

        }
    );


    /* =====================================================
       CLEAR EVERYTHING
    ===================================================== */

    clearButton.addEventListener(
        "click",
        clearForm
    );


    function clearForm() {

        clearSelectedFile();

        mediaTitle.value = "";

        mediaCaption.value = "";

        captionCount.textContent = "0";

        progressSection.hidden = true;

        progressFill.style.width = "0%";

        progressPercent.textContent = "0%";

    }


    /* =====================================================
       UPLOAD BUTTON
    ===================================================== */

    uploadButton.addEventListener(
        "click",
        uploadMedia
    );


    async function uploadMedia() {

        if (!selectedFile) {

            showStatus(
                "Please select a photo or video first.",
                "error"
            );

            return;

        }


        const title =
            mediaTitle.value.trim();

        const caption =
            mediaCaption.value.trim();


        if (!title) {

            showStatus(
                "Please add a title for your media.",
                "error"
            );

            mediaTitle.focus();

            return;

        }


        /* ===============================================
           CHECK SUPABASE
        =============================================== */

        if (
            typeof window.vibeSupabase ===
            "undefined"
        ) {

            saveLocally(
                title,
                caption
            );

            return;

        }


        try {

            uploadButton.disabled = true;

            progressSection.hidden = false;

            setProgress(
                15
            );


            /* ===========================================
               CHECK USER
            =========================================== */

            const {
                data: userData
            } =
                await window.vibeSupabase
                    .auth
                    .getUser();


            if (
                !userData ||
                !userData.user
            ) {

                showStatus(
                    "Please sign in to VibeConnect before uploading media.",
                    "error"
                );

                progressSection.hidden = true;

                uploadButton.disabled = false;

                return;

            }


            setProgress(30);


            /* ===========================================
               CREATE SAFE FILE NAME
            =========================================== */

            const userId =
                userData.user.id;

            const extension =
                getFileExtension(
                    selectedFile.name
                );

            const uniqueName =
                `${Date.now()}-${createRandomString(8)}.${extension}`;


            const filePath =
                `${userId}/${uniqueName}`;


            /* ===========================================
               SUPABASE STORAGE UPLOAD
            =========================================== */

            const {
                data,
                error
            } =
                await window.vibeSupabase
                    .storage
                    .from("vibe-media")
                    .upload(
                        filePath,
                        selectedFile,
                        {
                            cacheControl: "3600",
                            upsert: false
                        }
                    );


            if (error) {

                throw error;

            }


            setProgress(80);


            /* ===========================================
               PUBLIC URL
            =========================================== */

            const {
                data: publicData
            } =
                window.vibeSupabase
                    .storage
                    .from("vibe-media")
                    .getPublicUrl(
                        data.path
                    );


            setProgress(100);


            const mediaObject = {

                id:
                    Date.now(),

                title:
                    title,

                caption:
                    caption,

                type:
                    selectedType,

                fileName:
                    selectedFile.name,

                size:
                    selectedFile.size,

                path:
                    data.path,

                url:
                    publicData.publicUrl,

                createdAt:
                    new Date().toISOString()

            };


            uploadedMedia.unshift(
                mediaObject
            );


            saveMediaList();


            renderMediaLibrary();


            showStatus(
                "Media uploaded successfully! 🎉",
                "success"
            );


            showToast(
                "Media uploaded successfully!"
            );


            setTimeout(
                clearForm,
                1200
            );


        } catch (error) {

            console.error(
                "Media upload error:",
                error
            );


            showStatus(
                getUploadErrorMessage(error),
                "error"
            );


            progressSection.hidden = true;

        }


        uploadButton.disabled = false;

    }


    /* =====================================================
       LOCAL FALLBACK
    ===================================================== */

    function saveLocally(
        title,
        caption
    ) {

        const mediaObject = {

            id:
                Date.now(),

            title:
                title,

            caption:
                caption,

            type:
                selectedType,

            fileName:
                selectedFile.name,

            size:
                selectedFile.size,

            createdAt:
                new Date().toISOString()

        };


        uploadedMedia.unshift(
            mediaObject
        );


        saveMediaList();

        renderMediaLibrary();


        showStatus(
            "Saved locally for now. Connect Supabase Storage for permanent uploads.",
            "info"
        );


        showToast(
            "Media saved locally"
        );

    }


    /* =====================================================
       SAVE MEDIA LIST
    ===================================================== */

    function saveMediaList() {

        try {

            localStorage.setItem(
                SETTINGS.storageKey,
                JSON.stringify(
                    uploadedMedia
                )
            );

        } catch (error) {

            console.warn(
                "Could not save media list.",
                error
            );

        }

    }


    /* =====================================================
       LOAD MEDIA LIST
    ===================================================== */

    function loadLocalMedia() {

        try {

            const saved =
                localStorage.getItem(
                    SETTINGS.storageKey
                );


            if (saved) {

                uploadedMedia =
                    JSON.parse(saved);

            }

        } catch (error) {

            uploadedMedia = [];

        }


        renderMediaLibrary();

    }


    /* =====================================================
       RENDER MEDIA LIBRARY
    ===================================================== */

    function renderMediaLibrary() {

        mediaGrid.innerHTML = "";


        if (
            uploadedMedia.length === 0
        ) {

            mediaGrid.innerHTML = `

                <div class="empty-library">

                    <div class="empty-icon">
                        🗂️
                    </div>

                    <h3>No media yet</h3>

                    <p>
                        Your uploaded photos and videos
                        will appear here.
                    </p>

                </div>

            `;

            mediaCount.textContent =
                "0 files";

            return;

        }


        uploadedMedia.forEach(
            media => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "media-item";


                if (
                    media.url &&
                    media.type === "image"
                ) {

                    item.innerHTML = `

                        <img
                            src="${escapeHTML(media.url)}"
                            alt="${escapeHTML(media.title)}"
                        >

                        <div class="media-item-overlay">

                            <div class="media-item-title">
                                ${escapeHTML(media.title)}
                            </div>

                            <div class="media-item-type">
                                Photo
                            </div>

                        </div>

                    `;

                }

                else if (
                    media.url &&
                    media.type === "video"
                ) {

                    item.innerHTML = `

                        <video
                            src="${escapeHTML(media.url)}"
                            muted
                            preload="metadata"
                        ></video>

                        <div class="video-badge">
                            ▶ Video
                        </div>

                        <div class="media-item-overlay">

                            <div class="media-item-title">
                                ${escapeHTML(media.title)}
                            </div>

                            <div class="media-item-type">
                                Video
                            </div>

                        </div>

                    `;

                }

                else {

                    item.innerHTML = `

                        <div
                            style="
                                width:100%;
                                height:100%;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                font-size:42px;
                            "
                        >

                            ${
                                media.type === "video"
                                    ? "🎥"
                                    : "🖼️"
                            }

                        </div>

                        <div class="media-item-overlay">

                            <div class="media-item-title">
                                ${escapeHTML(media.title)}
                            </div>

                            <div class="media-item-type">
                                ${
                                    media.type === "video"
                                        ? "Video"
                                        : "Photo"
                                }
                            </div>

                        </div>

                    `;

                }


                mediaGrid.appendChild(
                    item
                );

            }
        );


        mediaCount.textContent =
            `${uploadedMedia.length} ${
                uploadedMedia.length === 1
                    ? "file"
                    : "files"
            }`;

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function setProgress(value) {

        progressFill.style.width =
            `${value}%`;

        progressPercent.textContent =
            `${value}%`;

    }


    /* =====================================================
       STATUS
    ===================================================== */

    function showStatus(
        message,
        type
    ) {

        statusMessage.hidden = false;

        statusMessage.textContent =
            message;

        statusMessage.className =
            `status-message ${type}`;

    }


    function hideStatus() {

        statusMessage.hidden = true;

        statusMessage.textContent = "";

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.add("show");


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

    }


    /* =====================================================
       UPDATE INTERFACE
    ===================================================== */

    function updateUploadInterface() {

        if (selectedType === "image") {

            mediaInput.accept =
                "image/*";

        } else {

            mediaInput.accept =
                "video/*";

        }

    }


    /* =====================================================
       FILE SIZE
    ===================================================== */

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return "0 Bytes";
        }


        const units = [
            "Bytes",
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
            parseFloat(
                (
                    bytes /
                    Math.pow(
                        1024,
                        index
                    )
                ).toFixed(2)
            )
            +
            " "
            +
            units[index]
        );

    }


    /* =====================================================
       FILE EXTENSION
    ===================================================== */

    function getFileExtension(
        filename
    ) {

        const parts =
            filename.split(".");

        return (
            parts[
                parts.length - 1
            ]
            .toLowerCase()
        );

    }


    /* =====================================================
       RANDOM STRING
    ===================================================== */

    function createRandomString(
        length
    ) {

        const characters =
            "abcdefghijklmnopqrstuvwxyz0123456789";

        let result = "";


        for (
            let i = 0;
            i < length;
            i++
        ) {

            result +=
                characters.charAt(
                    Math.floor(
                        Math.random() *
                        characters.length
                    )
                );

        }


        return result;

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        if (!value) {
            return "";
        }


        return String(value)
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


    /* =====================================================
       SUPABASE ERROR MESSAGE
    ===================================================== */

    function getUploadErrorMessage(
        error
    ) {

        const message =
            error?.message || "";


        if (
            message
                .toLowerCase()
                .includes("bucket")
        ) {

            return `
                Storage bucket "vibe-media" was not found.
                Create that bucket in Supabase Storage first.
            `;

        }


        if (
            message
                .toLowerCase()
                .includes("row-level")
        ) {

            return `
                Supabase Storage permission denied.
                Storage policies need to be configured.
            `;

        }


        if (
            message
                .toLowerCase()
                .includes("jwt")
        ) {

            return `
                Your VibeConnect session has expired.
                Please sign in again.
            `;

        }


        return (
            "Upload failed: " +
            message
        );

    }

});

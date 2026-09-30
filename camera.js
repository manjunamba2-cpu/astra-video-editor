// camera.js - Movie Maker Camera Lifecycle Management

// Global tracking variable for the active camera hardware stream
let activeMediaStream = null;

/**
 * 1. Movie Maker Active Camera Cleanup Handler
 * Safely terminates any running camera tracks to free up hardware indicators.
 */
function stopActiveCamera() {
    if (activeMediaStream) {
        try {
            const tracks = activeMediaStream.getTracks();
            tracks.forEach(track => {
                track.stop(); // Powers off the physical webcam/light
            });
            printLog("Previous camera stream tracks terminated successfully.");
        } catch (err) {
            console.error("Error stopping active camera tracks: ", err);
        }
        activeMediaStream = null;
    }
}

/**
 * 2. Movie Maker Async Camera Pipeline Loop
 * Requests webcam hook permissions and securely attaches the stream to the UI.
 */
async function startCameraPipeline() {
    // Safely stop any existing camera session first to avoid hardware conflicts
    stopActiveCamera();

    // Clear standard programmatic video feeds to prevent canvas freezing
    if (mainProgramView) {
        mainProgramView.removeAttribute('src');
        mainProgramView.load();
    }

    try {
        printLog("Requesting hardware permission layer access...");

        // Request live webcam hook (Video capture only, microphone muted)
        activeMediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        // Attach streams safely to structural UI targets if present
        if (cameraPreviewStream) {
            cameraPreviewStream.srcObject = activeMediaStream;
            cameraPreviewStream.style.display = "block";
        }

        if (cameraTextOverlay) {
            cameraTextOverlay.style.display = "none";
        }

        printLog("Live recording lens connected successfully.");
        revealWorkspace("Live Camera Stream Captured");

    } catch (err) {
        printLog("Failed to acquire webcam hardware stream: " + err.message);
        console.error("Camera pipeline error: ", err);
        
        // Reset state on failure so UI elements don't get stuck loading
        if (cameraPreviewStream) {
            cameraPreviewStream.srcObject = null;
        }
    }
}
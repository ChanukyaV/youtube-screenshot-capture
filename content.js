chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "captureFrame") {
    captureVideoFrame(request.format, request.quality)
      .then(result => sendResponse({ success: true, ...result }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // keep channel open for async response
  }

  if (request.action === "getVideoInfo") {
    const video = document.querySelector("video");
    if (!video) return sendResponse({ success: false, error: "No video found" });
    sendResponse({
      success: true,
      currentTime: video.currentTime,
      duration: video.duration,
      paused: video.paused,
      title: document.title.replace(" - YouTube", "").trim(),
    });
  }
});

function captureVideoFrame(format = "png", quality = 0.95) {
  return new Promise((resolve, reject) => {
    const video = document.querySelector("video");
    if (!video) return reject(new Error("No video element found on this page"));
    if (video.readyState < 2) return reject(new Error("Video is not ready yet"));

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const dataUrl = canvas.toDataURL(mimeType, quality);

    const title = document.title.replace(" - YouTube", "").trim();
    const timestamp = formatTimestamp(video.currentTime);

    resolve({ dataUrl, title, timestamp, width: canvas.width, height: canvas.height });
  });
}

function formatTimestamp(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}h${String(m).padStart(2, "0")}m${String(s).padStart(2, "0")}s`
    : `${m}m${String(s).padStart(2, "0")}s`;
}

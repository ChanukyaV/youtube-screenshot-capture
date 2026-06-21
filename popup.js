let capturedDataUrl = null;
let capturedTitle = "";
let capturedTimestamp = "";

const preview = document.getElementById("preview");
const placeholder = document.getElementById("placeholder");
const timestampBadge = document.getElementById("timestamp-badge");
const btnCapture = document.getElementById("btn-capture");
const btnCopy = document.getElementById("btn-copy");
const btnDownload = document.getElementById("btn-download");
const statusEl = document.getElementById("status");
const formatSelect = document.getElementById("format");
const qualitySelect = document.getElementById("quality");
const qualityLabel = document.getElementById("quality-label");

formatSelect.addEventListener("change", () => {
  const isJpeg = formatSelect.value === "jpeg";
  qualityLabel.style.display = isJpeg ? "" : "none";
  qualitySelect.style.display = isJpeg ? "" : "none";
});

btnCapture.addEventListener("click", async () => {
  setStatus("", "");
  btnCapture.disabled = true;
  btnCapture.textContent = "Capturing…";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.url?.includes("youtube.com")) {
      throw new Error("Navigate to a YouTube video first");
    }

    const format = formatSelect.value;
    const quality = parseFloat(qualitySelect.value);

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "captureFrame",
      format,
      quality,
    });

    if (!response?.success) {
      throw new Error(response?.error || "Failed to capture frame");
    }

    capturedDataUrl = response.dataUrl;
    capturedTitle = response.title;
    capturedTimestamp = response.timestamp;

    preview.src = capturedDataUrl;
    preview.style.display = "block";
    placeholder.style.display = "none";
    timestampBadge.textContent = capturedTimestamp;
    timestampBadge.style.display = "block";

    btnCopy.disabled = false;
    btnDownload.disabled = false;
    setStatus(`Captured ${response.width}×${response.height} at ${capturedTimestamp}`, "success");
  } catch (err) {
    setStatus(err.message, "error");
  } finally {
    btnCapture.disabled = false;
    btnCapture.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M9 3H5a2 2 0 00-2 2v4m0 6v4a2 2 0 002 2h4m6 0h4a2 2 0 002-2v-4m0-6V5a2 2 0 00-2-2h-4"/>
      </svg>
      Capture Frame`;
  }
});

btnDownload.addEventListener("click", async () => {
  if (!capturedDataUrl) return;
  const ext = capturedDataUrl.startsWith("data:image/jpeg") ? "jpg" : "png";
  const safeName = capturedTitle.replace(/[\\/:*?"<>|]/g, "_").slice(0, 80);
  const filename = `${safeName}_${capturedTimestamp}.${ext}`;

  try {
    await chrome.downloads.download({ url: capturedDataUrl, filename, saveAs: false });
    setStatus("Downloaded!", "success");
  } catch (err) {
    setStatus("Download failed: " + err.message, "error");
  }
});

btnCopy.addEventListener("click", async () => {
  if (!capturedDataUrl) return;
  try {
    const blob = await dataUrlToBlob(capturedDataUrl);
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    setStatus("Copied to clipboard!", "success");
  } catch (err) {
    setStatus("Copy failed — try downloading instead", "error");
  }
});

function dataUrlToBlob(dataUrl) {
  return fetch(dataUrl).then(r => r.blob());
}

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = type;
}

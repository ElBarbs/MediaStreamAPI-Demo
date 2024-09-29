// Define the constraints for the audio and video streams.
const constraints = {
  audio: true,
  video: {
    facingMode: "user",
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    frameRate: { min: 24, ideal: 30, max: 60 },
  },
};

// List all the available devices.
function listDevices() {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        const elem = document.createElement("li");
        elem.textContent = `${device.kind.toUpperCase()}: ${device.label}`;
        document.getElementById("detectedDevices").appendChild(elem);
      });
    })
    .catch((err) => {
      console.log(err.name, err.message);
    });
}

// Log audio and video tracks.
function logTracks(mediaStream) {
  mediaStream.getVideoTracks().forEach((track) => {
    const elem = document.createElement("li");
    elem.textContent = `Video Source: ${track.label}`;
    document.getElementById("connectedDevices").appendChild(elem);
  });

  mediaStream.getAudioTracks().forEach((track) => {
    const elem = document.createElement("li");
    elem.textContent = `Audio Source: ${track.label}`;
    document.getElementById("connectedDevices").appendChild(elem);
  });
}

// Setup the video stream.
function setupVideoStream(mediaStream) {
  const vid = document.getElementById("cameraVideo");
  vid.srcObject = mediaStream;
  vid.onloadedmetadata = () => vid.play();
}

// Setup the media recorder.
function setupMediaRecorder(mediaStream) {
  const mediaRecorder = new MediaRecorder(mediaStream);
  let chunks = [];

  mediaRecorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) {
      chunks.push(ev.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm;" });
    chunks = [];
    const videoURL = window.URL.createObjectURL(blob);
    document.getElementById("recordedVideo").src = videoURL;
  };

  return mediaRecorder;
}

// Setup the buttons.
function setupButtons(mediaRecorder) {
  const btnStart = document.getElementById("btnStart");
  const btnStop = document.getElementById("btnStop");
  const btnSnapshot = document.getElementById("btnSnapshot");
  const btnFilter = document.getElementById("btnFilter");
  const canvas = document.getElementById("snapshotCanvas");
  const context = canvas.getContext("2d");
  const vid = document.getElementById("cameraVideo");

  btnStart.addEventListener("click", () => mediaRecorder.start());
  btnStop.addEventListener("click", () => mediaRecorder.stop());

  btnSnapshot.addEventListener("click", () => {
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    context.drawImage(vid, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png");

    const gallery = document.getElementById("snapshotGallery");
    const img = document.createElement("img");
    img.src = dataURL;
    img.className = "snapshot";

    // Add the new snapshot to the end of the gallery.
    gallery.appendChild(img);

    // Remove excess snapshots if the gallery exceeds 5 items.
    if (gallery.childElementCount > 5) {
      gallery.removeChild(gallery.firstChild);
    }
  });

  canvas.addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "MediaStreamAPI-Demo-Snapshot.png";
    link.click();
  });
}

// Audio Visualizer
// Taken from: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
// and modified to fit the current example.
function setupAudioVisualizer(mediaStream) {
  const audioContext = new window.AudioContext();

  const source = audioContext.createMediaStreamSource(mediaStream);

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  const canvas = document.getElementById("audioVisualizer");
  const canvasCtx = canvas.getContext("2d");

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    // Clear the canvas.
    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Set the line style.
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    // Begin drawing the waveform.
    canvasCtx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    // Draw the line to the end of the canvas
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }

  draw();
}

// Initialize the media stream.
function initMediaStream() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      setupVideoStream(mediaStream);
      logTracks(mediaStream);
      const mediaRecorder = setupMediaRecorder(mediaStream);
      setupButtons(mediaRecorder);

      // Setup audio visualization.
      setupAudioVisualizer(mediaStream);
    })
    .catch((err) => {
      console.log(err.name, err.message);
    });
}

// Execute the functions
listDevices();
initMediaStream();

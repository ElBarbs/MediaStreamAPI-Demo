// Define the constraints for the video stream.
let constraintObj = {
  audio: true,
  video: {
    facingMode: "user",
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
  },
};

// List all the available devices.
navigator.mediaDevices
  .enumerateDevices()
  .then((devices) => {
    devices.forEach((device) => {
      console.log(device.kind.toUpperCase(), device.label);
    });
  })
  .catch((err) => {
    console.log(err.name, err.message);
  });

// Get the user's permission to access the webcam and microphone.
// If the user grants permission, the video stream will be displayed in the video element.
navigator.mediaDevices
  .getUserMedia(constraintObj)
  .then((stream) => {
    // Get the buttons elements.
    let btnStart = document.getElementById("btnStart");
    let btnStop = document.getElementById("btnStop");
    let btnSnapshot = document.getElementById("btnSnapshot");

    // Get the video elements.
    let vid = document.getElementById("cameraVideo");
    let recordedVid = document.getElementById("recordedVideo");

    // Get the canvas element.
    let canvas = document.getElementById("snapshotCanvas");
    let context = canvas.getContext("2d");

    // Connect the video stream to the video element.
    vid.srcObject = stream;

    // Once the video stream is loaded, play the video.
    vid.onloadedmetadata = function () {
      vid.play();
    };

    // Create a new MediaRecorder object, which will be used to record the video.
    let mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    // Setup the start and stop buttons.
    btnStart.addEventListener("click", () => {
      mediaRecorder.start();
    });
    btnStop.addEventListener("click", () => {
      mediaRecorder.stop();
    });

    // Setup the snapshot button.
    btnSnapshot.addEventListener("click", () => {
      // Display the canvas element.
      canvas.style.display = "block";

      // Set the canvas dimensions to match the video dimensions.
      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;

      // Draw the video frame on the canvas.
      context.drawImage(vid, 0, 0, canvas.width, canvas.height);
    });

    canvas.addEventListener("click", () => {
      // Get the data URL of the canvas.
      let dataURL = canvas.toDataURL("image/png");

      // Create a new link element and click it to download the image.
      let link = document.createElement("a");
      link.href = dataURL;
      link.download = "MediaStreamAPI-Demo-Snapshot.png";
      link.click();
    });

    // When data is available, add it to the chunks array.
    mediaRecorder.ondataavailable = function (ev) {
      if (ev.data && ev.data.size > 0) {
        chunks.push(ev.data);
      }
    };

    // When the recording stops, create a new Blob object and set the video element's src to the URL of the Blob.
    mediaRecorder.onstop = () => {
      let blob = new Blob(chunks, { type: "video/webm;" });
      chunks = [];

      let videoURL = window.URL.createObjectURL(blob);
      recordedVid.src = videoURL;
    };
  })
  .catch((err) => {
    console.log(err.name, err.message);
  });

# MediaStream API - Demo

This project demonstrates the use of the MediaStream API to capture audio and video from user devices, record the media, take snapshots, and visualize audio data.

## Features

- **List Devices**: Lists all available media devices (audio and video).
- **Video Stream**: Displays the live video stream from the user's camera.
- **Media Recorder**: Records the video stream and allows playback of the recorded video.
- **Snapshot**: Takes snapshots from the video stream and displays them in a gallery.
- **Audio Visualizer**: Visualizes the audio stream using the Web Audio API.

## Project Structure

- `index.html`: The main HTML file that sets up the structure of the web page.
- `style.css`: The CSS file that styles the web page.
- `script.js`: The JavaScript file that contains the logic for interacting with the MediaStream API and handling user interactions.
- `README.md`: This file.

## Setup

1. Clone the repository to your local machine.
2. Open `index.html` in a web browser.

## Usage

- **Start Recording**: Click the "START RECORDING" button to start recording the video stream.
- **Stop Recording**: Click the "STOP RECORDING" button to stop recording and display the recorded video.
- **Take Snapshot**: Click the "TAKE SNAPSHOT" button to take a snapshot from the video stream and add it to the gallery.

## Functions

### `listDevices()`

Lists all available media devices and displays them in the "Detected Devices" section.

### `setupVideoStream(mediaStream)`

Sets up the video stream and plays it in the video element.

### `setupMediaRecorder(mediaStream)`

Sets up the media recorder to record the video stream and handles the recording process.

### `setupButtons(mediaRecorder)`

Sets up the event listeners for the start, stop, and snapshot buttons.

### `setupAudioVisualizer(mediaStream)`

Visualizes the audio stream using the Web Audio API.

### `initMediaStream()`

Initializes the media stream by requesting access to the user's audio and video devices and setting up the video stream, media recorder, buttons, and audio visualizer.

### `logTracks(mediaStream)`

Logs the audio and video tracks to the "Connected Devices" section.

## References

- [MediaStream API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API)
- [Web Audio API Visualizations](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
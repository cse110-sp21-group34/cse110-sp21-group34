import styles from './webcamStyle.css';

const storage = require('storage');
let imageSource = document.createElement("video");
imageSource.setAttribute("autoplay", true);;

function showWebcam(){
  // Camera holder
  let cameraContainer = document.createElement("div");
  cameraContainer.id = "camera-container";

  // Control Bar
  let recordingControls = document.createElement("div");
  recordingControls.id = "recording-controls";

  let pictureBtn = document.createElement("button");
  pictureBtn.id = "picture";
  pictureBtn.setAttribute('disabled', true);
  let cameraIcon = document.createElement("i");
  cameraIcon.id = "cameraIcon";
  recordingControls.appendChild(pictureBtn);
  pictureBtn.appendChild(cameraIcon);

  let cameraOptionBtn = document.createElement("button");
  cameraOptionBtn.id = "cameraOption";
  cameraOptionBtn.setAttribute('disabled', true);
  let cameraOptionIcon = document.createElement("i");
  cameraOptionIcon.id = "cameraOptionIcon";
  recordingControls.appendChild(cameraOptionBtn);
  cameraOptionBtn.appendChild(cameraOptionIcon);

  // Preview Overlay
  let videoSnapshot = document.createElement("div");
  videoSnapshot.id = "video-snapshot-overlay";

  let video = document.createElement("video");
  video.id = "video-element";
  video.setAttribute("autoplay", "true");
  video.setAttribute("width", "640");
  video.setAttribute("height", "360");
  
  cameraContainer.appendChild(videoSnapshot);
  cameraContainer.appendChild(video);

  cameraContainer.appendChild(recordingControls);
  
  document.getElementById('editor').appendChild(cameraContainer);
}

function toggleScene(scene, canvas, editor) {
  const recordingControls = document.getElementById('recording-controls'),
        captureBtn = document.getElementById('picture'),
        cameraOptionBtn = document.getElementById('cameraOption');
  let pictureAcceptBtn = document.getElementById('pictureAccept'),
      pictureDeclineBtn = document.getElementById('pictureDecline');

  switch (scene) {
    case 'live':
      if (pictureAcceptBtn) pictureAcceptBtn.remove();
      if (pictureDeclineBtn) pictureDeclineBtn.remove();
      captureBtn.removeAttribute('hidden');
      cameraOptionBtn.removeAttribute('hidden');
      document.getElementById('camera_preview_img').remove();
      break;
    case 'preview':
      captureBtn.setAttribute('hidden', true);
      cameraOptionBtn.setAttribute('hidden', true);

      pictureAcceptBtn = document.createElement("button");
      pictureAcceptBtn.id = "pictureAccept";
      let pictureAcceptIcon = document.createElement("i");
      pictureAcceptIcon.id = "pictureAcceptIcon";
      recordingControls.appendChild(pictureAcceptBtn);
      pictureAcceptBtn.appendChild(pictureAcceptIcon);
    
      pictureDeclineBtn = document.createElement("button");
      pictureDeclineBtn.id = "pictureDecline";
      let pictureDeclineIcon = document.createElement("i");
      pictureDeclineIcon.id = "pictureDeclineIcon";
      recordingControls.appendChild(pictureDeclineBtn);
      pictureDeclineBtn.appendChild(pictureDeclineIcon);

      pictureAcceptBtn.addEventListener('click', () => {
        // transport to editor
        canvas.toBlob(blob => 
          storage.assets.save(blob).then(uid => editor.blocks.insert("image", {asset_id: uid}, {}, editor.blocks.getBlocksCount()))
        );
        toggleScene('live');
      });

      pictureDeclineBtn.addEventListener('click', () => {
        toggleScene('live');
      });
      break;
  }
}

let cameraChoices = [];

function populateCameraChoices() {
  let videoElem = document.getElementById("video-element");
  cameraChoices = [];
  navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
    mediaDevices.forEach(mediaDevice => {
      if (mediaDevice.kind === 'videoinput') {
        cameraChoices.push(mediaDevice);
      }
    });
  
    if (cameraChoices.length == 0) {
      console.error('No webcam found!');
      return;
    }
    // Default camera will run
    const cameraOptionBtn = document.getElementById('cameraOption'),
          pictureBtn = document.getElementById('picture');

    const constraints = {
      video: {
        deviceId: cameraChoices[0].deviceId
      }
    };

    console.log(cameraChoices);

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        let streamSettings = stream.getVideoTracks()[0].getSettings();
        imageSource.setAttribute('width', streamSettings.width);
        imageSource.setAttribute('height', streamSettings.height);
        imageSource.srcObject = stream;
        videoElem.srcObject = stream;  // Preview stream
        // if (videoOff.disabled) {
        //   toggleButtons();
        // }
        return navigator.mediaDevices.enumerateDevices();
    })

    cameraOptionBtn.setAttribute('camid', 0);
    cameraOptionBtn.setAttribute('cam_name', cameraChoices[0].label);

    cameraOptionBtn.addEventListener('click', () => {
      let nextCamid = 1 + +cameraOptionBtn.getAttribute('camid');
      if (nextCamid >= cameraChoices.length) {
        nextCamid = 0;
      }
      const constraints = {
        video: {
          deviceId: cameraChoices[nextCamid].deviceId
        }
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          // Stop the original camera before switching
          videoElem.srcObject.getTracks().forEach(track => track.stop());
          let streamSettings = stream.getVideoTracks()[0].getSettings();
          imageSource.setAttribute('width', streamSettings.width);
          imageSource.setAttribute('height', streamSettings.height);
          imageSource.srcObject = stream;
          videoElem.srcObject = stream;  // Preview stream
          // if (videoOff.disabled) {
          //   toggleButtons();
          // }
          return navigator.mediaDevices.enumerateDevices();
        });
        // .catch(error => {
        //   if (videoOff.disabled) {
        //     toggleButtons();
        //   }
        //   videoElem.srcObject = null;
        //   console.error(error);
        // });
      cameraOptionBtn.setAttribute('camid', nextCamid);
      cameraOptionBtn.setAttribute('cam_name', cameraChoices[nextCamid].label);
    });

    cameraOptionBtn.removeAttribute('disabled');
    pictureBtn.removeAttribute('disabled');
  });
}


let cameraActivated = false;

function initWebcam(editor) {
  // Show the webcam feature after the button has been clicked.
  document.getElementsByClassName("bi bi-plus-circle")[0].addEventListener("click", ()=> {
    if(cameraActivated == true) {
      let videoElem = document.getElementById("video-element");
      let photosContainer = document.getElementById('photos-container');
      let cameraContainer = document.getElementById('camera-container');
      videoElem.srcObject.getTracks().forEach(track => track.stop());
      videoElem.srcObject = null;
      imageSource.srcObject = null;
      document.getElementById('editor').removeChild(cameraContainer);
      cameraActivated = false;

    }
  })

  document.getElementById("additionCamera").addEventListener("click", () => {
    if(cameraActivated == true) {
      let videoElem = document.getElementById("video-element");
      let cameraContainer = document.getElementById('camera-container');
      videoElem.srcObject.getTracks().forEach(track => track.stop());
      videoElem.srcObject = null;
      imageSource.srcObject = null;
      document.getElementById('editor').removeChild(cameraContainer);
      cameraActivated = false;
    }
    else {
      cameraActivated = true;
      showWebcam(); 

      let pictureBtn = document.getElementById("picture");
      let videoElem = document.getElementById("video-element");
      let videoOverlay = document.getElementById('video-snapshot-overlay');

      // When the picture button is clicked, capture a frame from the video
      pictureBtn.addEventListener('click', () => {
        let previewCanvas = document.createElement('canvas');
        previewCanvas.id = 'camera_preview_img';
        previewCanvas.height = videoElem.height;
        previewCanvas.width = videoElem.width;
        previewCanvas.setAttribute('date-timestamp', new Date().getTime());

        let previewContext = previewCanvas.getContext('2d');
        previewContext.drawImage(videoElem, 0, 0, videoElem.width, videoElem.height);

        // Capture the actual high-def image
        let imageCanvas = document.createElement('canvas');
        imageCanvas.height = imageSource.height;
        imageCanvas.width = imageSource.width;
        imageCanvas.setAttribute('date-timestamp', new Date().getTime());

        let imageContext = imageCanvas.getContext('2d');
        imageContext.drawImage(imageSource, 0, 0, imageSource.width, imageSource.height);
      
        // flash effect
        videoOverlay.style.backgroundColor = 'white';
        videoOverlay.style.transition = 'none';
        setTimeout(() => {
          videoOverlay.style.transition = '0.05s ease all';
          videoOverlay.style.backgroundColor = 'transparent';
          videoOverlay.appendChild(previewCanvas);
          toggleScene('preview', imageCanvas, editor);
        }, 200);
      });
      
      // Find all Camera devices and let the user choose
      populateCameraChoices();
    }
  });
}


module.exports = initWebcam;
exports.webcam = initWebcam;
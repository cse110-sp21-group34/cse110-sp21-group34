const storage = require('storage');

/**
 * Creates a new recorder for recording audio notes
 */
function createRecorder() {
  var voiceArea = document.createElement("div");
  voiceArea.id = "voiceArea";

  var recordBtn = document.getElementsByClassName("bi bi-record-circle")[0];
  var stopBtn = document.getElementsByClassName("bi bi-stop-circle")[0];
  stopBtn.disabled = true;

  document.getElementById('editor').appendChild(voiceArea);
}


/**
 * Creates a new button to record the audio note and handles the behaviour of the same
 */
function createButton() {
  document.getElementsByClassName("bi bi-mic")[0].addEventListener("click", () => {
    if (document.getElementById('voiceArea')) return;
    createRecorder();

    let recordBtn = document.getElementsByClassName("bi bi-record-circle")[0];
    let stopBtn = document.getElementsByClassName("bi bi-stop-circle")[0];

    function toggleButtons() {
      if (recordBtn.disabled) {
        recordBtn.removeAttribute('disabled');
        stopBtn.setAttribute('disabled', 'true');
      } else {
        stopBtn.removeAttribute('disabled');
        recordBtn.setAttribute('disabled', 'true');
      }
    }

    // This checks whether your browser support getUser Media, 
    // not whether you have permitted recording your voice.
    if (navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');

      const constraints = { audio: true };
      let chunks = [];

      let onSuccess = function (stream) {
        let mediaRecorder = new MediaRecorder(stream);

        recordBtn.addEventListener('click', () => {
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          console.log("recorder started");
          toggleButtons();
          document.getElementById("additionMicrophone").style.opacity = "0";
          document.getElementById("additionMicrophoneClose").style.opacity = "1";
        });

        stopBtn.addEventListener('click', () => {
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          console.log("recorder stopped");
          toggleButtons();
          document.getElementById("additionMicrophone").style.opacity = "1";
          document.getElementById("additionMicrophoneClose").style.opacity = "0";
        });

        mediaRecorder.onstop = function (e) {
          console.log("data available after MediaRecorder.stop() called.");

          const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
          storage.assets.save(blob).then(uid => storage.currentEditor.blocks.insert("audio", { asset_id: uid }, {}, storage.currentEditor.blocks.getBlocksCount()));
          chunks = [];
          const audioURL = window.URL.createObjectURL(blob);
          console.log("recorder stopped");
        }

        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        }
      }

      let onError = function (err) {
        console.log('The following error occured: ' + err);
      }

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  })
}

module.exports = {
  createRecorder: createRecorder,
  createButton: createButton
}
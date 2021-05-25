// voice control functions
function createRecorder() {
    var voiceArea = document.createElement("div");
    voiceArea.id = "voiceArea";

    var title = document.createElement("div");
    title.innerText = "Voice Recorder";
    title.id = "record-title";
    title.contentEditable = true;
    voiceArea.appendChild(title);

    var message = document.createElement("p");
    message.id = "message";
    message.innerText = "Not Recording";
    voiceArea.appendChild(message);

    var controls = document.createElement("div");
    controls.id = "recording-controls";
    var recordBtn = document.createElement("button");
    recordBtn.id = "record";
    recordBtn.innerText = "Record";
    controls.appendChild(recordBtn);
    var stopBtn = document.createElement("button");
    stopBtn.id = "stop";
    stopBtn.innerText = "Stop";
    stopBtn.disabled = true;
    controls.appendChild(stopBtn);
    voiceArea.appendChild(controls);

    var audioElem = document.createElement("audio");
    audioElem.id = "audio-element";
    audioElem.controls = true;
    voiceArea.appendChild(audioElem);

    var editor = document.getElementById('editor');
    editor.appendChild(voiceArea);
}


/* Could someone please help me with this part? It functions well but the structure
is super messy. After we click the button and create the voice div, we should begin
to bind functions to the voice-recording system. (Starting from line 50)
Originally, all lines following are on outmost level (outside addEventListener).
But there were problems because those 4 variables will have null assigned to them
since they were run before I click the button and create vioce-recording. 
There shouldn't have been these many things like variable declaring, inner function,
etc. inside an EventListener.*/
document.querySelector("#voiceCreator").addEventListener("click", () => {
    createRecorder();

    let recordBtn = document.getElementById('record');
    let stopBtn = document.getElementById('stop');
    let message = document.getElementById('message');
    let audioElem = document.getElementById('audio-element');

    function toggleButtons() {
    if (recordBtn.disabled) {
        recordBtn.removeAttribute('disabled');
        recordBtn.style.backgroundColor = 'white';
        stopBtn.setAttribute('disabled', 'true');
        message.innerText = 'Not Recording';
        message.classList.remove('recording');
    } else {
        stopBtn.removeAttribute('disabled');
        recordBtn.setAttribute('disabled', 'true');
        recordBtn.style.backgroundColor = 'red';
        message.innerText = 'Recording';
        message.classList.add('recording');
    }
    }

    // This checks whether your browser support getUser Media, 
    // not whether you have permitted recording your voice.
    if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');

    const constraints = { audio: true };
    let chunks = [];

    let onSuccess = function(stream) {
        const mediaRecorder = new MediaRecorder(stream);

        recordBtn.addEventListener('click', () => {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        toggleButtons();
        });

        stopBtn.addEventListener('click', () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        // mediaRecorder.requestData();
        toggleButtons();
        });

        mediaRecorder.onstop = function(e) {
        console.log("data available after MediaRecorder.stop() called.");

        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audioElem.src = audioURL;
        console.log("recorder stopped");
        }

        mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
        }

        message.innerText = "Ready to record";
    }

    let onError = function(err) {
        console.log('The following error occured: ' + err);
        message.innerText = "Error, please check console."
    }

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

    } else {
    console.log('getUserMedia not supported on your browser!');
    }
})


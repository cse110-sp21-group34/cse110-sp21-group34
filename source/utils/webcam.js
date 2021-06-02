const Dexie = require('dexie');
function showWebcam(){

    let photosContainer = document.createElement("ul");
    photosContainer.id = "photos-container";

    let modalContainer = document.createElement("div");
    modalContainer.id = "modal-container";

    let modal = document.createElement("modal");
    modal.id = "modal";

    let modalImage = document.createElement("canvas");
    modalImage.id = "modal-image"
    modalImage.setAttribute("width", "640");
    modalImage.setAttribute("height", "360");

    let saveDelete = document.createElement("div");
    saveDelete.id = "save-delete";

    let saveBtn = document.createElement("button");
    saveBtn.id = "save-btn";

    let deleteBtn = document.createElement("button");
    deleteBtn.id = "delete-btn";

    let cameraContainer = document.createElement("div");
    cameraContainer.id = "camera-container";

    let recordingControls = document.createElement("div");
    recordingControls.id = "recording-controls";

    let pictureBtn = document.createElement("button");
    pictureBtn.id = "picture";

    let icon = document.createElement("i");
    icon.id = "icon";
    icon.setAttribute("class", "fas fa-camera");
    pictureBtn.appendChild(icon);
    
    let cameraSelectContainer = document.createElement("div");
    cameraSelectContainer.id = "camera-select-container";

    let selectCamera = document.createElement("select");
    selectCamera.id = "select-camera";
    selectCamera.setAttribute("placeholder", "Select Camera:");

    let option = document.createElement("option");
    option.id = "option";
    option.innerText = "Select Camera:"

    let videoSnapshot = document.createElement("div");
    videoSnapshot.id = "video-snapshot-overlay";

    let video = document.createElement("video");
    video.id = "video-element";
    video.setAttribute("autoplay", "true");
    video.setAttribute("width", "640");
    video.setAttribute("height", "360");

    modalContainer.appendChild(modal);

    modal.appendChild(modalImage);
    
    modal.appendChild(saveDelete);
    saveDelete.appendChild(saveBtn);
    saveDelete.appendChild(deleteBtn);

    cameraContainer.appendChild(cameraSelectContainer);
    cameraSelectContainer.appendChild(selectCamera);
    selectCamera.appendChild(option);
    
    cameraContainer.appendChild(videoSnapshot);
    cameraContainer.appendChild(video);

    cameraContainer.appendChild(recordingControls);
    recordingControls.appendChild(pictureBtn);
    

    let append = document.getElementById('append');
    append.appendChild(cameraContainer);
    append.appendChild(photosContainer);
}

// Show the webcam feature after the button has been clicked.
window.addEventListener('DOMContentLoaded', () => {
document.getElementById("additionCamera").addEventListener("click", ()=> {

    showWebcam(); 

    let pictureBtn = document.getElementById("picture");
    let select = document.getElementById('select-camera');
    let videoElem = document.getElementById("video-element");
    let videoOverlay = document.getElementById('video-snapshot-overlay');
    let photosContainer = document.getElementById('photos-container');
    let picturesTaken = parseInt(localStorage.getItem('picturesTaken')) || 0;
    let modalContainer = document.getElementById('modal-container');
    
    select.addEventListener('click', () =>{
        //Disable picture button if no webcam is selected.
        if(select.selectedIndex == 0){
          pictureBtn.setAttribute('disabled', 'true');
          videoElem.srcObject = null;
        }
        else{
          pictureBtn.removeAttribute('disabled');
        }
      });
      
      // When the picture button is clicked, capture a frame from the video
      pictureBtn.addEventListener('click', () => {
        picturesTaken += 1;
        localStorage.setItem('picturesTaken', picturesTaken);
        let newListItem = document.createElement('li');
        newListItem.id = `picNum${picturesTaken}`;
        let canvas = document.createElement('canvas');
      
        // Adding the captured image to the gallery, but we want to immidiately show
        canvas.classList.add('gallery-image');
        canvas.width = videoElem.width;
        canvas.height = videoElem.height;
        canvas.style.width = 160;
        canvas.style.heigth = 90;
        let timestamp = new Date();
        canvas.setAttribute('data-timestamp', timestamp.getTime());
        let context = canvas.getContext('2d');
      
        // Bring up the enlargened version if photo is clicked
        canvas.addEventListener('click', () => {
          modalContainer.style.display = 'grid';
          modalImage.getContext('2d').drawImage(canvas, 0, 0);
          modal.prepend(modalImage);
          saveBtn.setAttribute('data-canvas-id', newListItem.id);
          deleteBtn.setAttribute('data-canvas-id', newListItem.id);
        });
      
        // flash effect
        videoOverlay.style.backgroundColor = 'white';
        videoOverlay.style.transition = 'none';
        setTimeout(() => {
          videoOverlay.style.transition = '0.05s ease all';
          videoOverlay.style.backgroundColor = 'transparent';
        }, 200);
        
        // We don't need this since we don't have a mirror feature.
      
        // if (videoElem.classList.contains('mirror')) {
        //   // Flip the canvas to draw the image mirrored, then flip the canvas back
        //   // so that the image number isn't mirrored as well
        //   context.translate(canvas.width, 0);
        //   context.scale(-1, 1);
        //   context.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
        //   context.translate(canvas.width, 0);
        //   context.scale(-1, 1);
        // } else {
        //   context.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
        // }
      
        // Adding the captured image to the gallery
        context.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
      
        // Add photo count to bottom left
        // context.font = '80px Sans-serif';
        // context.strokeStyle = 'black';
        // context.lineWidth = 8;
        // context.strokeText(`${picturesTaken}`, 10, 350);
        // context.fillStyle = 'white';
        // context.fillText(`${picturesTaken}`, 10, 350);
      
        newListItem.appendChild(canvas);
        photosContainer.prepend(newListItem);
      });
      
        // Created IndexedDB database using Dexie.js
        console.log("Working");
        db = new Dexie("image_database");
        db.version(1).stores({
            images: 'timestamp,file,id'
        });
      
        // Find all Camera devices and let the user choose
        populateCameraChoices();
        console.log("Working");

        // Pull images from IndexedDB and insert them in the DOM
        populateImageContainer();
      
        // If the modal is clicked, close it
        modalContainer.addEventListener('click', () => {
          modalContainer.style.display = 'none';
        });
      
        // Save the image to IndexedDB
        saveBtn.addEventListener('click', () => {
          let listItem = document.getElementById(saveBtn.getAttribute('data-canvas-id'));
          let canvas = listItem.childNodes[0];
          canvas.toBlob(blob => {
            let imgTimestamp = canvas.getAttribute('data-timestamp');
            db.images.get(imgTimestamp).then(image => {
              console.log("memek");
              if (!image) {
                db.images.put({timestamp: imgTimestamp, file: blob, id: listItem.id}).then(() => {
                  return db.images.get(imgTimestamp);
                }).then(image => {
                  let saveFile = document.getElementById('save-file');
                  let blob = image.file;
                  let url  = URL.createObjectURL(blob);
                  saveFile.href = url;
                  saveFile.download = `Picture_${picturesTaken}`;
                  saveFile.click();
                  alert('Saved Successfully! (In Downloads folder)');
                  console.log('Saved Successfully!');
                }).catch(function(error) {
                  alert(`Error saving to IndexedDB: ${error}`);
                  console.log(`Error saving to IndexedDB: ${error}`);
                });
              } else {
                let saveFile = document.getElementById('save-file');
                let blob = image.file;
                let url  = URL.createObjectURL(blob);
                saveFile.href = url;
                saveFile.download = `${imgTimestamp}`;
                saveFile.click();
                alert('Saved Successfully! (In Downloads folder)');
                console.log('Saved Successfully!');
              }
            });
          });
        
      
        // Delete the image from IndexedDB and from the DOM
        deleteBtn.addEventListener('click', () => {
          let canvas = document.getElementById(deleteBtn.getAttribute('data-canvas-id')).childNodes[0];
          let imgTimestamp = canvas.getAttribute('data-timestamp');
          db.images.delete(imgTimestamp).then(() => {
            alert('Deleted from IndexedDB Sucessfully!');
            console.log('Deleted from IndexedDB Sucessfully!');
            let listItem = document.getElementById(deleteBtn.getAttribute('data-canvas-id'));
            photosContainer.removeChild(listItem);
            console.log('Removed from DOM');
          }).catch(function(error) {
            alert(`Error deleting from IndexedDB: ${error}`);
            console.log(`Error deleting from IndexedDB: ${error}`);
          });
        });
      

      });
      // Find all Camera devices and let the user choose
      function populateCameraChoices() {
      
        navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
          let count = 1;
          mediaDevices.forEach(mediaDevice => {
            if (mediaDevice.kind === 'videoinput') {
              let option = document.createElement('option');
              option.value = mediaDevice.deviceId;
              let label = mediaDevice.label || `Camera ${count++}`;
              let textNode = document.createTextNode(label);
              option.appendChild(textNode);
              select.appendChild(option);
            }
          });
        });
      
        select.addEventListener('change', () => {
          const videoConstraints = {};
          if (select.value == '' || select.value == 'Select Camera:') {
            videoConstraints.facingMode = 'environment';
          } else {
            videoConstraints.deviceId = { exact: select.value };
          }
          const constraints = {
            video: videoConstraints,
            audio: false
          };
      
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
              currStream = stream;
              videoElem.srcObject = stream;
              // if (videoOff.disabled) {
              //   toggleButtons();
              // }
              return navigator.mediaDevices.enumerateDevices();
            })
            // .catch(error => {
            //   if (videoOff.disabled) {
            //     toggleButtons();
            //   }
            //   videoElem.srcObject = null;
            //   console.error(error);
            // });
        });
      }
      
      // Pull images from IndexedDB and insert them in the DOM
      function populateImageContainer() {
        db.images.each(image => {
          // Create the list item and canvas elements
          let newListItem = document.createElement('li');
          newListItem.id = image.id;
          let canvas = document.createElement('canvas');
          canvas.classList.add('gallery-image');
          canvas.width = videoElem.width;
          canvas.height = videoElem.height;
          canvas.style.width = 160;
          canvas.style.heigth = 90;
          canvas.setAttribute('data-timestamp', image.timestamp);
      
          // Add the blob to the Canvas
          let context = canvas.getContext('2d');
          let img = new Image();
          img.onload = function(){
            context.drawImage(img, 0, 0, canvas.width, canvas.height)
          }
          img.src = URL.createObjectURL(image.file);
      
          // Bring up the enlargened version if photo is clicked
          canvas.addEventListener('click', () => {
            modalContainer.style.display = 'grid';
            modalImage.getContext('2d').drawImage(canvas, 0, 0);
            modal.prepend(modalImage);
            saveBtn.setAttribute('data-canvas-id', newListItem.id);
            deleteBtn.setAttribute('data-canvas-id', newListItem.id);
          });
          
          newListItem.appendChild(canvas);
          photosContainer.prepend(newListItem);
        });
      }
  });
});

module.exports = webcam;
exports.webcam = webcam;
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-new */
/* eslint-disable no-undef */
/* eslint-disable no-console */
// const Delimiter = require('@editorjs/delimiter');
const EditorJS = require('@editorjs/editorjs')
const Alert = require("editorjs-alert");
const NestedList = require('@editorjs/nested-list');
const Checklist = require('@editorjs/checklist');
const Marker = require("@editorjs/marker");
const AlignmentBlockTune = require('editorjs-text-alignment-blocktune');
const DragDrop = require('editorjs-drag-drop');
const Paragraph = require('@editorjs/paragraph');
const Embed = require('@editorjs/embed');
const Header = require('@editorjs/header');

const NotSoSimpleImage = require('./not-so-simple-image/src/index')
const NotSoSimpleAudio = require('./not-so-simple-audio/src/index')
const { resolveConfig } = require('prettier');

const storage = require('storage');

// Set up saving triggers after finishing initializing editor
const savingInterval = 1000;  // ms
let saveTimer;
// document.onkeydown = function onkeydown(e) {
//   if (e.which === 13 && e.shiftKey==false) {
//     e.preventDefault(); 
//     document.execCommand("insertLineBreak");    
//       console.log('enter pressed without shift');
//     return false;
//   } 
// }

function initListeners(editor, date, holderid) {
  document.getElementById(holderid).addEventListener('keydown', (e) => {
    // Map the behavior of 'enter' into 'shift + enter' for paragrah
    if (e.target.className === 'ce-paragraph cdx-block' || e.target.className === 'cdx-input embed-tool__caption') {
      if (e.key === 'Enter' && e.shiftKey==false) {
        e.preventDefault(); 
        document.execCommand("insertLineBreak"); 
      }
    }
  });
}

function newEditor(date, holder) {
  let editor_obj = new EditorJS({
    logLevel: 'VERBOSE',
    holderId: holder,
    data: storage.journals.get(date),
    defaultBlock: "list",
    onReady: () => {
      // new Undo({ editor_obj});
      new DragDrop(editor_obj);
      initListeners(editor_obj, date, holder);
      editor_obj.focus(true);
    },
    onChange: () => {
      editor_obj.save().then((outputData) => storage.journals.save(date, outputData));
    },
    tools: {
      list: {
        class: NestedList,
        inlineToolbar: true,
      },
      alert: Alert,
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        placeholder: "Type your content here"
      },

      header: {
        class: Header,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+H",
      },

      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },

      Marker: {
        class: Marker,
        shortcut: "CMD+SHIFT+M",
      },

      anyTuneName: {
        class: AlignmentBlockTune,
        config: {
          default: "left",
          blocks: {
            header: "center",
            list: "right",
          },
        },
      },
      image: {
        class: NotSoSimpleImage,
      },

      audio: {
        class: NotSoSimpleAudio,
      },

      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            coub: true,
          },
        },
      },
  },
  });
  editor_obj.date = date;
  return editor_obj;
}

/*
const saveBtn = document.querySelector("button");

saveBtn.addEventListener("click", () => {
  editor
    .save()
    .then((outputData) => {
      console.log("Article data: ", outputData);
      localStorage.setItem("Your content", outputData);
    })
    .catch((error) => {
      console.log("Saving failed: ", error);
    });
});
*/

module.exports = newEditor;
exports.newEditor = newEditor;

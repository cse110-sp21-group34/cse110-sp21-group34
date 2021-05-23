/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-new */
/* eslint-disable no-undef */
/* eslint-disable no-console */
// const Delimiter = require('@editorjs/delimiter');
const EditorJS = require('@editorjs/editorjs')

const NestedList = require('@editorjs/nested-list');
const Checklist = require('@editorjs/checklist');
const Warning = require('@editorjs/warning');
const Quote = require('@editorjs/quote');
const AnyButton = require('editorjs-button');
const Marker = require('@editorjs/marker');
const AlignmentBlockTune = require('editorjs-text-alignment-blocktune');
const ImageTool = require('@editorjs/image');
const DragDrop = require('editorjs-drag-drop');
const Undo = require('editorjs-undo');
const Paragraph = require('@editorjs/paragraph');
const Embed = require('@editorjs/embed');
const Header = require('@editorjs/header');

const Journals = require('./storage');

try {
  JSON.parse(localStorage.getItem("journal-entry"))
}
catch (e) {
  console.error("journal-entry is invalid");
  localStorage.setItem("journal-entry", '{"labels":{}, "journals": {}}');
}

// let date = "2021-5-11";

const savingInterval = 3000;  // ms
let saveTimer;

function initSaver(editor, date, holderid) {
  document.getElementById(holderid).addEventListener('keydown', () => {
    // reset saveTimer
    console.log("keydown triggered")
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {editor.save().then((outputData) => {journals.save(date, outputData)})} , savingInterval);

  })

  document.getElementById(holderid).addEventListener('focusout', () => {
    // Immediately save when bullet loses focus
    console.log("defocused")
    editor.save().then((outputData) => journals.save(date, outputData));
  })
}

const journals = new Journals(JSON.parse(localStorage.getItem("journal-entry")), (data) => {localStorage.setItem("journal-entry", data)})


function new_editor(date, holder) {
  let editor_obj = new EditorJS({
    holderId: holder,
    data: journals.get(date),

    onReady: () => {
      //new Undo({ editor });
      //new DragDrop(editor);
      initSaver(editor_obj, date, holder);
      editor_obj.focus(true);
    },
    tools: {
      list: {
        class: NestedList,
        inlineToolbar: true,
      },

      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        tunes: ["anyTuneName"],
      },

      header: {
        class: Header,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+H",
        tunes: ["anyTuneName"],
      },

      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },

      warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+W",
        config: {
          titlePlaceholder: "Title",
          messagePlaceholder: "Message",
        },
      },

      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+O",
        config: {
          quotePlaceholder: "Enter a quote",
          captionPlaceholder: "Quote's author",
        },
      },

      AnyButton: {
        class: AnyButton,
        inlineToolbar: false,
        config: {
          css: {
            btnColor: "btn--gray",
          },
        },
      },

      Marker: {
        class: Marker,
        shortcut: "CMD+SHIFT+M",
      },

      anyTuneName: {
        class: AlignmentBlockTune,
        config: {
          default: "right",
          blocks: {
            header: "center",
            list: "right",
          },
        },
      },

      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: "http://localhost:8000/uploadFile", // Your backend file uploader endpoint
            byUrl: "http://localhost:8000/fetchUrl", // Your endpoint that provides uploading by Url
          },
        },
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
    }
  });
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

module.exports = new_editor;

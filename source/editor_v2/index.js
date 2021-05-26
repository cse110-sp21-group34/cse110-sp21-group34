/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-new */
/* eslint-disable no-undef */
/* eslint-disable no-console */
// const Delimiter = require('@editorjs/delimiter');
const EditorJS = require('@editorjs/editorjs')
const SimpleImage = require('simple-image-editorjs');
const Alert = require('editorjs-alert');
const NestedList = require('@editorjs/nested-list');
const Checklist = require('@editorjs/checklist');
const Marker = require('@editorjs/marker');
const AlignmentBlockTune = require('editorjs-text-alignment-blocktune');
const DragDrop = require('editorjs-drag-drop');
const Paragraph = require('@editorjs/paragraph');
const Embed = require('@editorjs/embed');
const Header = require('@editorjs/header');
const Dexie = require('dexie')
const {Journals, Assets, AssetsDexieWrapper} = require('./storage');
const { resolveConfig } = require('prettier');

const iid = 1; // instanceid

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

const journal_db = new Dexie("journal-entry")
journal_db.version(1).stores({
  instance: "++instanceid"
});
let journals;

let init = new Promise((resolve, reject) => {
    journal_db.instance.get(iid).then(result => {
      if (result == undefined) {
        console.error("no journal found!");
        journal_db.instance.put({instanceid: iid, data: '{"labels":{}, "journals": {}}'});
      }
      return journal_db.instance.get(iid);
    }).then(obj => {
      journals = new Journals(JSON.parse(obj.data), (data) => journal_db.instance.put({instanceid: iid, data: data}));
      resolve(journals);
    });
});

const assets = new Assets(new AssetsDexieWrapper('journal-assets'))

function newEditor(date, holder) {
  let editor_obj = new EditorJS({
    holderId: holder,
    data: journals.get(date),
    defaultBlock: "list",
    onReady: () => {
      // new Undo({ editor_obj});
      new DragDrop(editor_obj);
      initSaver(editor_obj, date, holder);
      editor_obj.focus(true);
    },
    tools: {
      alert: Alert,
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

      image: SimpleImage,

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

module.exports = {
  newEditor: newEditor,
  init: init
}

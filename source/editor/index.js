/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-new */
/* eslint-disable no-undef */
/* eslint-disable no-console */
// const Delimiter = require('@editorjs/delimiter');
import styles from './css/index.css';

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

/**
 * Initialize the EventListener to map "enter" press to "soft break line".
 * @constructor
 * @param {string} holderid - The id of the editor.
 */
function initListeners(holderid) {
  document.getElementById(holderid).addEventListener('keydown', (e) => {
    // Map the behavior of 'enter' into 'shift + enter' ，which is the line break for paragrah
    if (e.target.className === 'ce-paragraph cdx-block' || e.target.className === 'cdx-input embed-tool__caption') {
      if (e.key === 'Enter' && e.shiftKey==false) {
        e.preventDefault(); 
        document.execCommand("insertLineBreak"); 
      }
    }
  });
}


/**
 * Initialize the text editor with tools.
 * @constructor
 * @param {string} date - The date of the journal entry.
 * @param {string} holder - The holder id of the editor.
 */
export function newEditor(holder) {
  let editor_obj = new EditorJS({
    logLevel: 'VERBOSE',
    holderId: holder,
    data: storage.journals.get(storage.currentDate),
    defaultBlock: "list",
    onReady: () => {
      new DragDrop(editor_obj);
      editor_obj.focus(true);
      initListeners(holder);
    },
    onChange: () => {
      editor_obj.save().then((outputData) => storage.journals.save(storage.currentDate, outputData));
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
  return editor_obj;
}


module.exports = newEditor;
exports.newEditor = newEditor;
exports.initListeners = initListeners;

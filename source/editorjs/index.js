// const Delimiter = require('@editorjs/delimiter');
import EditorJS from '@editorjs/editorjs';

import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist';
import Warning from '@editorjs/warning';
import Quote from '@editorjs/quote';
import AnyButton from 'editorjs-button';
import Marker from '@editorjs/marker';
import AlignmentBlockTune from 'editorjs-text-alignment-blocktune';
import ImageTool from '@editorjs/image';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';

const editor = new EditorJS({
    onReady: () => {
      new Undo({ editor });
      new DragDrop(editor);
    },
    tools: {
      list: {
        class: NestedList,
        inlineToolbar: true,
      },
      
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },

      warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+W',
        config: {
          titlePlaceholder: 'Title',
          messagePlaceholder: 'Message',
        }
      },

      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        }
      },

      anyButton: {
        class: AnyButton,
        inlineToolbar: false,
        config:{
          css:{
            "btnColor": "btn--gray",
          }
        }
      },

      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M'
      },

      anyTuneName: {
        class:AlignmentBlockTune,
        config:{
          default: "right",
          blocks: {
            header: 'center',
            list: 'right'
          }
        }
      },

      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
            byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
          }
        }
      }
    },
    /**
     * Id of Element that should contain Editor instance
     */
    holder: 'editorjs'
  });
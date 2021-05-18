// const Delimiter = require('@editorjs/delimiter');
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';


const editor = new EditorJS({

  holderId: 'editorjs',

  onReady: () => {
      new Undo({ editor });
      new DragDrop(editor);
    },
  tools: {
      list: {
        class: NestedList,
        inlineToolbar: true,
      },

      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        tunes: ['anyTuneName'],
      },

      header: {
        class: Header,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+H',
        tunes: ['anyTuneName'],
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
          },
        },

      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        },
      },

      AnyButton: {
        class: AnyButton,
        inlineToolbar: false,
        config:{
          css:{
            "btnColor": "btn--gray",
          }
        }
      },

      Marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
      },

      anyTuneName: {
        class:AlignmentBlockTune,
        config:{
          default: "right",
          blocks: {
            header: 'center',
            list: 'right'
          }
        },
      },

      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: 'http://localhost:8000/uploadFile', // Your backend file uploader endpoint
            byUrl: 'http://localhost:8000/fetchUrl', // Your endpoint that provides uploading by Url
          }
        }
      },

      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            coub: true
          }
        }
      },
    },
});

let saveBtn = document.querySelector('button');

saveBtn.addEventListener('click', ()=>{
  editor.save().then((outputData) => {
    console.log('Article data: ', outputData);
    localStorage.setItem('Your content', outputData);
  }).catch((error) => {
    console.log('Saving failed: ', error)
  });
});
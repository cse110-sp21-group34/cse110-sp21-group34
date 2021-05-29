/**
 * Build styles
 */
require('./index.css').toString();

const {Assets, AssetsDexieWrapper} = require('../../storage')

/**
 * SimpleImage Tool for the Editor.js
 * Works only with pasted image URLs and requires no server-side uploader.
 *
 * @typedef {object} SimpleAudioData
 * @description Tool's input and output data format
 * @property {string} url — image URL
 * @property {string} caption — image caption
 * @property {boolean} withBorder - should image be rendered with border
 * @property {boolean} withBackground - should image be rendered with background
 * @property {boolean} stretched - should image be stretched to full width of container
 */
class NotSoSimpleAudio {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: SimpleAudioData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    /**
     * Editor.js API
     */
    this.api = api;
    this.readOnly = readOnly;
    this.asset_api = new Assets(new AssetsDexieWrapper('journal-assets'));

    /**
     * When block is only constructing,
     * current block points to previous block.
     * So real block index will be +1 after rendering
     *
     * @todo place it at the `rendered` event hook to get real block index without +1;
     * @type {number}
     */
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;

    /**
     * Styles
     */
    this.CSS = {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,

      /**
       * Tool's classes
       */
      wrapper: 'cdx-simple-audio',
      audioHolder: 'cdx-simple-audio__player',
      caption: 'cdx-simple-image__caption',
    };

    /**
     * Nodes cache
     */
    this.nodes = {
      wrapper: null,
      audioHolder: null,
      audio: null,
      caption: null,
    };

    /**
     * Tool's initial data
     */
    this.data = {
      caption: data.caption || '',
      withBorder: data.withBorder !== undefined ? data.withBorder : false,
      withBackground: data.withBackground !== undefined ? data.withBackground : false,
      stretched: data.stretched !== undefined ? data.stretched : false,
    };

    if (data.url) {
      this.data.url = data.url;
    }
    else if (data.asset_id) {
      this.data.asset_id = data.asset_id;
    }
    else {
      this.data.url = '';
    }

    /**
     * Available Image settings
     */
    this.settings = [
      {
        name: 'withBorder',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
      },
      {
        name: 'stretched',
        icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`,
      },
      {
        name: 'withBackground',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`,
      },
    ];
  }

  static get toolbox() {
    return {
      title: 'Audio',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>'
    };
  }

  /**
   * Creates a Block:
   *  0) Show upload button
   *  1) Show preloader
   *  2) Start to load an image
   *  3) After loading, append image and caption input
   *
   * @public
   */
  render() {
    const wrapper = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]),
          loader = this._make('div', this.CSS.loading),
          audioHolder = this._make('div', this.CSS.audioHolder),
          audio = this._make('audio'),
          caption = this._make('div', [this.CSS.input, this.CSS.caption], {
            contentEditable: !this.readOnly,
            innerHTML: this.data.caption || '',
          });

    let loadButton = this._make('input', [], {
      type: 'file'
    });

    audio.setAttribute('controls', true);

    this.nodes.audioHolder = audioHolder;
    this.nodes.wrapper = wrapper;
    this.nodes.audio = audio;
    this.nodes.caption = caption;
    this.nodes.loader = loader;

    caption.dataset.placeholder = 'Enter a caption';

    let isAudioSaved = false;

    if (this.data.asset_id) {
      wrapper.appendChild(loader);
      isAudioSaved = true;
      this.asset_api.get(this.data.asset_id).then(blob => {
        audio.src = URL.createObjectURL(blob)
        audio.setAttribute('asset_id', this.data.asset_id)
      }).catch(err => {
        console.error("Failed to retrieve asset " + this.data.asset_id + ": " + err)
      });
    }
    else if (this.data.url) {
      wrapper.appendChild(loader);
      audio.src = this.data.url;
      isAudioSaved = true;
    }
    else {
      wrapper.appendChild(loadButton);
      loadButton.onchange = (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);

        this.data = {
          url: url,
          caption: file.name
        };

        loadButton.remove();
        loadButton = null;
      };
    }

    audio.oncanplay = () => {
      wrapper.classList.remove(this.CSS.loading);
      audioHolder.appendChild(audio);
      wrapper.appendChild(audioHolder);
      wrapper.appendChild(caption);
      loader.remove();
      if (loadButton !== null) {
        loadButton.remove();
        loadButton = null;
      }
      this.nodes.loader = null;
      this._acceptTuneView();
      // Check if user is adding image via button
      if (!isAudioSaved) {
        fetch(audio.src).then(response => {
          return response.blob();
        }).then(blob => {
          return this.asset_api.save(blob);
        }).then(uid => {
          this.data.asset_id = uid;
          delete this.data.url;
          audio.setAttribute('asset_id', uid);
        }).catch(err => {
          console.error("Failed to save asset " + audio.src + ": " + err)
        }).finally(() => {
          console.log("WHYYY NOT DISPATCH??????");
          audio.dispatchEvent(new Event('focusout'));
        });
      }
    };

    audio.onerror = (e) => {
      // @todo use api.Notifies.show() to show error notification
      console.log('Failed to load an audio', e);
    }; 

    return wrapper;
  }

  /**
   * @public
   * @param {Element} blockContent - Tool's wrapper
   * @returns {SimpleAudioData}
   */
  save(blockContent) {
    const audio = blockContent.querySelector('audio'),
        caption = blockContent.querySelector('.' + this.CSS.input);

    if (!audio) {
      return this.data;
    }

    if (!this.data.asset_id) {
      // Image is loaded by external url (non blob)
      return Object.assign(this.data, {
        url: audio.src,
        caption: caption.innerHTML,
      });
    }
    else {
      // Asset is already stored in database
      let tmp =  Object.assign(this.data, {
        caption: caption.innerHTML
      });
      delete tmp.url;
      return tmp;
    }
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      url: {},
      asset_id: {},
      withBorder: {},
      withBackground: {},
      stretched: {},
      caption: {
        br: true,
      },
    };
  }

  /**
   * Notify core that read-only mode is suppoorted
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Read pasted image and convert it to base64
   *
   * @static
   * @param {File} file
   * @returns {Promise<SimpleAudioData>}
   */
  onDropHandler(file) {
    return new Promise(resolve => {
      resolve({
        url: URL.createObjectURL(file)
      })
    })

    /*
    const reader = new FileReader();

    reader.readAsDataURL(file);

    return new Promise(resolve => {
      reader.onload = (event) => {
        resolve({
          url: event.target.result,
          caption: file.name,
        });
      };
    });
    */
  }

  /**
   * On paste callback that is fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted config
   */
  onPaste(event) {
    switch (event.type) {
      case 'tag': {
        const audio = event.detail.data;

        if (audio.hasAttributes('asset_id')) {
          // This is an image from database
          this.data = {
            asset_id: audio.getAttribute("asset_id"),
          };
        }
        else {
          this.data = {
            url: audio.src,
          };
        }
        break;
      }

      case 'pattern': {
        const { data: text } = event.detail;

        this.data = {
          url: text,
        };
        break;
      }

      case 'file': {
        const { file } = event.detail;

        this.onDropHandler(file)
          .then(data => {
            this.data = data;
          });

        break;
      }
    }
  }

  /**
   * Returns image data
   *
   * @returns {SimpleAudioData}
   */
  get data() {
    return this._data;
  }

  /**
   * Set image data and update the view
   *
   * @param {SimpleAudioData} data
   */
  set data(data) {
    this._data = Object.assign({}, this.data, data);

    if (this.nodes.audio) {
      this.nodes.audio.src = this.data.url;
      if (this.data.asset_id) this.nodes.audio.asset_id = this.data.asset_id;
    }

    if (this.nodes.caption) {
      this.nodes.caption.innerHTML = this.data.caption;
    }
  }

  /**
   * Specify paste substitutes
   *
   * @see {@link ../../../docs/tools.md#paste-handling}
   * @public
   */
  static get pasteConfig() {
    return {
      patterns: {
        audio: /https?:\/\/\S+\.(mp3|mp4|m3u|wav|ogg)$/i,
      },
      tags: [ 'audio' ],
      files: {
        mimeTypes: [ 'audio/*' ],
      },
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = document.createElement('div');

    this.settings.forEach(tune => {
      const el = document.createElement('div');

      el.classList.add(this.CSS.settingsButton);
      el.innerHTML = tune.icon;

      el.addEventListener('click', () => {
        this._toggleTune(tune.name);
        el.classList.toggle(this.CSS.settingsButtonActive);
      });

      el.classList.toggle(this.CSS.settingsButtonActive, this.data[tune.name]);

      wrapper.appendChild(el);
    });

    return wrapper;
  };

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Click on the Settings Button
   *
   * @private
   * @param tune
   */
  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }

  /**
   * Add specified class corresponds with activated tunes
   *
   * @private
   */
  _acceptTuneView() {
    this.settings.forEach(tune => {
      this.nodes.audioHolder.classList.toggle(this.CSS.audioHolder + '--' + tune.name.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`), !!this.data[tune.name]);

      if (tune.name === 'stretched') {
        this.api.blocks.stretchBlock(this.blockIndex, !!this.data.stretched);
      }
    });
  }
}

module.exports = NotSoSimpleAudio;

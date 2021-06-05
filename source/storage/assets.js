const Dexie = require("dexie");
const Md5 = require("md5");

class Assets {
  constructor(db) {
    this.db = db;
    this.map = {};
  }

  /**
   * Retrieve an asset from database
   * @param {String} uid asset unique id
   * @return {Promise<Blob>} promise object resolving to a blob object
   */
  get(uid) {
    console.log("get() called: " + uid);
    if (this.map.uid) {
      return new Promise(resolve => resolve(this.map[uid]));
    }

    return this.db.retrieve(uid).then(obj => {
      return fetch(obj.data);
    }).then(response => {
      return response.blob().then(blob => {
        this.map[uid] = blob;
        return blob;
      });
    });
  }

  /**
   * Saving an blob object to database
   * @param {Blob} blob blob object
   * @returns {Promise<String>} promise object resolving to the key of that object
   */
  save(blob) {
    console.log("save() called");
    const reader = new FileReader();

    reader.readAsDataURL(blob);

    return new Promise(resolve => {
      reader.onload = (event) => {
        resolve(this.db.submit({uid: Md5(event.target.result), type: blob.type, data: event.target.result}));
      }
    }).then(uid => {
      console.log("saved: " + uid)
      this.map[uid] = blob;
      return uid;
    });
  }

  del(uid) {
    this.db.remove(uid);
    if (this.map.uid) delete this.map[uid];
    return 0;
  }
}

class AssetsDexieWrapper {
  constructor(table) {
    this.db = new Dexie(table);
    this.db.version(1).stores({
      assets: 'uid,type',
    });
  }

  retrieve(uid) {
    return this.db.assets.get(uid);
  }

  submit(data) {
    return this.db.assets.put(data).then(obj => {
      console.log("submit() => obj: ", obj);
      return Promise.resolve(obj);
    })
  }

  remove(uid) {
    return this.db.assets.delete(uid);
  }
}

class AssetsMockWrapper {
  constructor() {
    this.db = {};
  }

  retrieve(uid) {
    return Promise.resolve({data:this.db[uid]});
  }

  submit(data) {
    this.db[data.uid] = data
    return Promise.resolve(data.uid);
  }

  remove(uid) {
    delete this.db[uid];
    return Promise.resolve(uid);
  }
}

module.exports = {
    Assets: Assets,
    AssetsDexieWrapper: AssetsDexieWrapper,
    AssetsMockWrapper: AssetsMockWrapper
}

exports.Assets = Assets;
exports.AssetsDexieWrapper = AssetsDexieWrapper;
exports.AssetsMockWrapper = AssetsMockWrapper;
const Journals = require('./journals');
const {Assets, AssetsDexieWrapper} = require('./assets');

const storage = {
  init: init,
  get journals() {
    init();
    return this.journals;
  },
  set journals(j) {
    delete this.journals;
    this.journals = j;
    this.j = j;
  },
  get assets() {
    init();
    return this.assets;
  },
  set assets(a) {
    delete this.assets;
    this.assets = a;
    this.a = a;
  }
}

/**
 * Initialize the storage component
 * @param {String} type type of database
 * @param {Object} args arguments for specific database
 */
function init(type, args) {
  // Delete all getter/setter for init short hand
  delete storage.journals;
  delete storage.assets;
  switch (type) {
    default:
    case 'dexie':
      const Dexie = require('dexie');
      const iid = 1; // instance id

      const assets_db = new AssetsDexieWrapper("journal-assets")
      const assets = new Assets(assets_db);

      // Loading journals from database
      const journal_db = new Dexie("journal-entry");

      journal_db.version(1).stores({
        instance: "++instanceid"
      });

      const journals = new Journals(
        journal_db.instance.get(iid).then(d => {
          if (d == undefined) return undefined;
          else return JSON.parse(d.data);
        }), 
        (data) => journal_db.instance.put({instanceid: iid, data: data})
      );

      storage.journals = journals;
      storage.assets = assets;
      // short hands
      storage.j = journals;
      storage.a = assets;

      break;
    case 'test':
      storage.journals = args.journals;
      storage.assets = args.assets;
      // short hands
      storage.j = args.journals;
      storage.a = args.assets;
      break;
  }
  delete storage.init;
  return storage;
}

module.exports = storage;
exports.storage = storage;
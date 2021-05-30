const Dexie = require('dexie');
const Journals = require('./journals');
const {Assets, AssetsDexieWrapper} = require('./assets');

const iid = 1; // instance id

const assets_db = new AssetsDexieWrapper("journal-assets")
const assets = new Assets(assets_db);

// Loading journals from database
const journal_db = new Dexie("journal-entry");

journal_db.version(1).stores({
  instance: "++instanceid"
});

const journals = new Journals(journal_db.instance.get(iid).then(d => {return JSON.parse(d.data)}), (data) => journal_db.instance.put({instanceid: iid, data: data}));

const storage = {
  journals: journals,
  assets: assets,
  // short hands
  j: journals,
  a: assets
};

module.exports = storage;
exports.storage = storage;
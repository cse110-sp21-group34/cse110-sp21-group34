const Dexie = require("dexie")

class Journals {
  /**
   * Constructor
   * @param {object} source journal database
   * @param {function} submit callback for saving data
   */
  constructor(source, submit) {
    if (
      !source ||
      typeof source !== "object" ||
      Object.keys(source).length === 0
    ) {
      console.error(
        "Source of journal is invalid. Received ",
        source,
        ". Using default"
      );
      source = {
        labels: {},
        journals: {},
      };
    } else if (!"journals" in source || !"labels" in source) {
      console.error("Invalid format. Using default");
      source = {
        labels: {},
        journals: {},
      };
    }

    /*
      database = {
        "labels": {},
        "journals": {}
      }
    */
    this.database = { ...source };
    this.journals = this.database.journals;

    this.labels = new Object();
    /*
      labels_prop = {
          "label1": {
              color: blue
          }
      }
    */
    let labels_prop = this.database.labels;

    this.submit = submit;

    // Initialize labels
    if (labels_prop) {
      for (const label in labels_prop) {
        this.labels[label] = new Label(label, labels_prop[label]);
      }
    } else {
      labels_prop = {};
    }

    for (const journal in this.journals) {
      const { label } = this.journals[journal];
      if (label) {
        if (!this.labels[label]) {
          let label_prop = labels_prop[label];
          if (!label_prop) label_prop = {}; // Default behavior when label prop is not set
          this.labels[label] = new Label(label, label_prop);
        }
        this.labels[label].link(journal, this.journals[journal]);
      }
    }
  }

  /**
   * Retrieve the journal object of a given date
   * @param {string} date
   * @return {object} journal object 
   */
  get(date) {
    if (!this.journals[date]) {
      console.log("no such date");
      return {};
    }
    return this.journals[date];
  }

  /**
   * Store journal of the given date
   * @param {string} date date
   * @param {object} data journal object
   */
  save(date, data) {
    if (data) {
      if (!this.journals[date]) this.journals[date] = {};
      for (const key in data) {
        this.journals[date][key] = data[key];
      }
      this.push().then(() => {
        console.log("data saved")
      }).catch(error => {
        console.error(`Error when saving journal on ${date}: ${error}`);
      })
    }
  }

  /**
   * Pushing data to backend asynchronously
   */
  push() {
    for (const label in this.labels) {
      this.database.labels[label] = this.labels[label].properties;
    }
    return this.submit(JSON.stringify(this.database));
    // console.log(this.database);
  }

  /**
   * Create new label
   * @param {string} label label name
   * @param {Object} properties properties of the label
   * @returns {string} label name
   */
  newlabel(label, properties = {}) {
    if (this.labels[label]) {
      console.warn("Attempting to create duplicated label: ", label);
    }
    this.labels[label] = new Label(label, properties);
    this.push();
    return label;
  }

  /**
   * Remove label
   * @param {string} label label name
   * @returns {int} return code
   */
  removelabel(label) {
    if (!this.labels[label]) return;
    if (Object.keys(this.labels[label].journals).length === 0) {
      // No journal is assicoated with this label, proceed to removal
      delete this.labels[label];
      this.push();
      return 0;
    }

    console.error(
      "Failed to remove label: ",
      this.labels[label].name,
      " is used in ",
      Object.keys(this.labels[label].journals).join(" ")
    );
    return 1;
  }

  /**
   * Label a journal
   * @param {string} date date
   * @param {string} label label = null to remove label from a journal
   */
  label(date, label = null) {
    if (label && !this.labels[label]) {
      console.error("Label does not exist: ", label);
      return;
    }
    if (label === null || this.journals[date].label) {
      // Remove it first
      const old_label = this.journals[date].label;
      if (this.labels[old_label]) this.labels[old_label].detach(date);
    }
    if (label) this.labels[label].link(date, this.journals[date]);
    this.push();
    return 0;
  }
}

class Label {
  /**
   * Lookup journals for reverse lookup (label -> dates)
   * Read-only. Do NOT modify directly. Maintained by Journal interface
   * @param {string} name 
   * @param {Object} properties 
   */
  constructor(name, properties) {
    this.name = name;
    this.properties = { ...properties };
    this.journals = {};
  }

  link(date, obj = null) {
    this.journals[date] = obj;
    return date;
  }

  detach(date) {
    const temp = this.journals[date];
    delete this.journals[date];
    return temp;
  }
}

class Assets {
  constructor(db) {
    this.db = db;
    this.map = {};
  }

  get(uid) {
    if (uid in map) {
      return map[uid];
    }

    let blob_url;
    (async () => await this.db.retrieve(uid).then(obj => {
      let type = obj.type;
      let raw_data = obj.data;
      let blob = new Blob(raw_data, type);
      map[uid] = URL.createObjectURL(blob);
      blob_url = map[uid];
    }).catch(error => {
      console.error("Failed to retrieve asset " + uid + " : " + error);
      blob_url = undefined;
    }))()

    return blob_url;
  }

  save(blob) {
    let plain_text = (async() => await blob.text())();
    let uid;
    (async() => await this.db.submit({type: blob.type, data: plain_text}).then(key => {
      uid = key;
      this.map[key] = blob;
    }).catch(error => {
      console.error("Error with saving asset " + blob + " : " + error);
      uid = undefined;
    }))();
    
    return uid;
  }

  del(uid) {
    if (!uid in asset_uids) {
      return 0;
    }
    this.db.remove(uid);
    delete this.map[uid];
    return 0;
  }
}

class AssetsDexieWrapper {
  constructor(table) {
    this.db = new Dexie(table);
    this.db.version(1).stores({
      assets: '++uid,type',
    })
  }

  retrieve(uid) {
    return this.db.assets.get(uid);
  }

  submit(data) {
    return this.db.assets.put(data).then(obj => {
      Promise.resolve(obj.uid);
    })
  }

  remove(uid) {
    return this.db.assets.delete(uid)
  }
}

module.exports = {
  Journals: Journals,
  AssetsDexieWrapper: AssetsDexieWrapper,
  Assets: Assets
}

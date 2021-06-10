class Journals {
  /**
   * Constructor
   * @param {Promise/function} source function or promise returning journal database
   * @param {function} submit callback for saving data
   */
  constructor(source, submit) {
    this.isReady = Promise.resolve(source).then(source => {
      return new Promise((resolve, reject) => {
        if (
          !source ||
          typeof source !== "object" ||
          Object.keys(source).length === 0
        ) {
          console.error(
            "[Journals] Source of journal is invalid. Received ",
            source,
            ". Using default"
          );
          source = {
            labels: {},
            journals: {},
            settings: {}
          };
        } else if (!"journals" in source || !"labels" in source) {
          console.error("[Journals] Invalid format. Using default");
          source = {
            labels: {},
            journals: {},
            settings: {}
          };
        }

        /*
          database = {
            "labels": {},
            "journals": {},
            "settings": {}
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

        resolve(this);
      });
    });
  }

  /**
   * Retrieve the journal object of a given date
   * @param {String} date
   * @return {object} journal object 
   */
  get(date) {
    if (!this.journals[date]) {
      console.log("[Journals] no such date");
      return {};
    }
    return this.journals[date];
  }

  /**
   * Store journal of the given date
   * @param {String} date date
   * @param {object} data journal object
   */
  save(date, data) {
    if (data) {
      if (!this.journals[date]) this.journals[date] = {};
      for (const key in data) {
        this.journals[date][key] = data[key];
      }
      return this.push().then(() => {
        console.log("[Journals] data saved")
      }).catch(error => {
        console.error(`[Journals] Error when saving journal on ${date}: ${error}`);
      });
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

  labelDate(date, label, args) {
    if (!this.journals[date]) {
      this.journals[date] = {labels: {}};
    }
    if (!this.journals[date].labels) {
      this.journals[date].labels = {};
    }
    this.journals[date].labels[label] = args;
    this.push();
  }

  removeLabelDate(date, label) {
    if (!this.journals[date] || 
        !this.journals[date].labels || 
        !this.journals[date].labels[label]) {
      return;
    }
    delete this.journals[date].labels[label];
    this.push();
  }

  getLabelDate(date) {
    if (!this.journals[date] || 
        !this.journals[date].labels) {
      return {};
    }
    return this.journals[date].labels;
  }


  /**
   * Create new label
   * @param {String} label label name
   * @param {Object} properties properties of the label
   * @returns {String} label name
   */
  newlabel(label, properties = {}) {
    if (this.labels[label]) {
      console.warn("[Journals] Attempting to create duplicated label: ", label);
    }
    this.labels[label] = new Label(label, properties);
    this.push();
    return label;
  }

  /**
   * Remove label
   * @param {String} label label name
   * @returns {int} return code
   */
  removelabel(label) {
    if (!this.labels[label]) return 1;
    if (Object.keys(this.labels[label].journals).length === 0) {
      // No journal is assicoated with this label, proceed to removal
      delete this.labels[label];
      this.push();
      return 0;
    }

    console.error(
      "[Journals] Failed to remove label: ",
      this.labels[label].name,
      " is used in ",
      Object.keys(this.labels[label].journals).join(" ")
    );
    return 1;
  }

  /**
   * Label a journal
   * @param {String} date date
   * @param {String} label label = null to remove label from a journal
   */
  label(date, label = null) {
    if (label && !this.labels[label]) {
      console.error("[Journals] Label does not exist: ", label);
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

  /**
   * Getter for editor settings
   * @return {Object} settings
   */
  get settings() {
    if (this.database.settings == undefined) {
      this.database.settings = {};
    }
    return this.database.settings;
  }

  /**
   * Setter for editor settings
   * @param {Object} newSettings settings object
   */
  set settings(newSettings) {
    this.database.settings = Object.assign(this.database.settings, newSettings);
    this.push();
  }
}

class Label {
  /**
   * Lookup journals for reverse lookup (label -> dates)
   * Read-only. Do NOT modify directly. Maintained by Journal interface
   * @param {String} name 
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

module.exports = Journals;
exports.Journals = Journals;
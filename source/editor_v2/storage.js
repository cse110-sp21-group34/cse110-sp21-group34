class Journals {
    constructor(source, submit) {
        if (!source || typeof(source) != "object" || Object.keys(source).length === 0) {
            console.error("Source of journal is invalid. Received ", source, ". Using default")
            source = {
                'labels': {},
                'journals': {}
            }
        }
        else if (!'journals' in source || !'labels' in source) {
            console.error("Invalid format. Using default")
            source = {
                'labels': {},
                'journals': {}
            }
        }

        this.database = {...source};
        this.journals = this.database['journals'];

        this.labels = new Object();
        /*
            labels_prop = {
                "label1": {
                    color: blue
                }
            }
        */
        let labels_prop = this.database['labels'];

        this.submit = submit;

        // Initialize labels
        if (labels_prop) {
            for (let label in labels_prop) {
                this.labels[label] = new Label(label, labels_prop[label]);
            }
        }
        else {
            labels_prop = {};
        }
        
        for (let journal in this.journals) {
            let label = this.journals[journal].label;
            if (label) {
                if (!this.labels[label]) {
                    let label_prop = labels_prop[label];
                    if (!label_prop) label_prop = {}   // Default behavior when label prop is not set
                    this.labels[label] = new Label(label, label_prop);
                }
                this.labels[label].link(journal, this.journals[journal]);
            }
        }
    }

    get(date) {
        if (!this.journals[date]) {
            console.log("no such date");
            return {};
        }
        return this.journals[date];
    }

    save(date, data) {
        if (data) {
            try {
                if (!this.journals[date]) 
                    this.journals[date] = {}
                for (let key in data) {
                    this.journals[date][key] = data[key];
                }
                this.push();
                console.log("data saved");
                return 0;
            }
            catch (e) {
                console.error("Error when saving journal on "+ date + ": " + e);
                return 1;
            }
        }
    }

    push() {
        for (let label in this.labels) {
            this.database['labels'][label] = this.labels[label].properties;
        }
        this.submit(JSON.stringify(this.database));
        //console.log(this.database);
        return 0;
    }

    newlabel(label, properties = {}) {
        if (this.labels[label]) {
            console.warn("Attempting to create duplicated label: ", label);
        }
        this.labels[label] = new Label(label, properties);
        this.push();
        return label;
    }

    removelabel(label) {
        if (!this.labels[label]) return
        if (Object.keys(this.labels[label].journals).length === 0) {
            // No journal is assicoated with this label, proceed to removal
            delete this.labels[label];
            this.push();
            return 0;
        }
        else {
            console.error("Failed to remove label: ", this.labels[label].name, " is used in ", Object.keys(this.labels[label].journals).join(' '));
            return 1;
        }
    }

    // Leave label = null to remove label from journal
    label(date, label=null) {
        if (label && !this.labels[label]) {
            console.error("Label does not exist: ", label);
            return;
        }
        if (label === null || this.journals[date].label) {
            // Remove it first
            let old_label = this.journals[date].label;
            if (this.labels[old_label])
                this.labels[old_label].detach(date);
        }
        if (label)
            this.labels[label].link(date, this.journals[date]);
        this.push();
        return 0;
    }
}

class Label {
    constructor(name, properties) {
        this.name = name;
        this.properties = {...properties};
        this.journals = {};
    }

    link(date, obj=null) {
        this.journals[date] = obj;
        return date;
    }

    detach(date) {
        let temp = this.journals[date];
        delete this.journals[date];
        return temp;
    }
}

module.exports = Journals;
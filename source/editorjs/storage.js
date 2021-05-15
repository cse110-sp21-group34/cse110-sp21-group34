export default class Journal {
    constructor(source, submit) {
        this.journals = source;
        this.submit = submit;
    }

    get(date) {
        if (!this.journals[date]) {
            console.log("no such date")
            return {}
        }
        return this.journals[date];
    }

    save(date, data) {
        if (data) {
            try {
                console.log(data)
                this.journals[date] = data;
                this.submit(JSON.stringify(this.journals));
                console.log("data saved")
                return 0;
            }
            catch (e) {
                console.error("Error when saving journal on "+ date + ": " + e)
                return 1;
            }
        }
    }
}
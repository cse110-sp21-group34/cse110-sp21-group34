
const Journals = require('storage/journals');
const Storage = require('storage');
const {Assets, AssetsMockWrapper} = require('storage/assets');

describe("Storage Interface", () => {
    describe("Pure Journal", () => {
        it('Initial from empty dictionary', () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };
            Storage.init("dexie");
            (new Journals(() => undefined, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
            (new Journals(() => null, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
            (new Journals(() => {}, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
            (new Journals(() => "", data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
            (new Journals(() => {return {"corrupted": {}}}, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
        });

        it('Adding journals', async () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };
            
            let obj = new Journals(JSON.parse(JSON.stringify(ref)), data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)));
            await obj.isReady;
            let date = new Date();
            date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            for (let count = 0; count < 50; count++) {
                let random_dict = {
                    "time" : 1550476186479,
                    "blocks" : [],
                    "version" : "2.8.1"
                };
                for (let x = 0; x < 10; x++) {
                    let temp = {}
                    temp[Math.random().toString(36).substring(7)] = Math.random().toString(36).substring(7);
                    random_dict.blocks.push(temp)
                }
                ref.journals[date + count] = random_dict
                await obj.save(date + count, random_dict)
            }
        });

        it('Loading journals from saved data', async () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };
            
            let saved_data;
            let obj = new Journals(JSON.parse(JSON.stringify(ref)), data => {return new Promise((resolve) => {saved_data = data; resolve();})});
            await obj.isReady;
            let date = new Date();
            date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            for (let count = 0; count < 50; count++) {
                let random_dict = {
                    "time" : 1550476186479,
                    "blocks" : [],
                    "version" : "2.8.1"
                };
                for (let x = 0; x < 10; x++) {
                    let temp = {}
                    temp[Math.random().toString(36).substring(7)] = Math.random().toString(36).substring(7);
                    random_dict.blocks.push(temp)
                }
                ref.journals[date + count] = random_dict
                await obj.save(date + count, random_dict)
            }

            obj = new Journals(JSON.parse(saved_data), data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)));
            await obj.isReady;
            expect(obj.journals).toEqual(ref.journals)
        });
    })


    describe("Journal with labels", () => {
        it('Adding journals and label it', async () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };

            let label = {
                "play": {
                    color: "FFFFFF"
                }, 
                "work": {
                    color: "FFFFFE"
                }, 
                "job": {
                    color: "FFFFFB"
                }, 
                "task": {
                    color: "FFFAFF"
                }, 
                "hobby": {
                    color: "F2FFFF"
                }, 
                "diary": {
                    color: "FF3FFF"
                }, 
                "show": {
                    color: "FF0FFF"
                }, 
                "music": {
                    color: "FFF1FF"
                }, 
                "sport": {
                    color: "9FFFFF"
                }, 
                "travel": {
                    color: "FFFFF9"
                }
            };
            
            // Preparing the journals
            let obj = new Journals(JSON.parse(JSON.stringify(ref)), data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)));
            await obj.isReady;
            let date = new Date();
            date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            for (let count = 0; count < 50; count++) {
                let random_dict = {
                    "time" : 1550476186479,
                    "blocks" : [],
                    "version" : "2.8.1"
                };
                for (let x = 0; x < 10; x++) {
                    let temp = {}
                    temp[Math.random().toString(36).substring(7)] = Math.random().toString(36).substring(7);
                    random_dict.blocks.push(temp)
                }
                ref.journals[date + count] = random_dict
                await obj.save(date + count, random_dict)
            }

            // Create labels
            for (let l in label) {
                ref.labels[l] = label[l]
                obj.newlabel(l, label[l])
            }

            for (let l in obj.labels) {
                expect(obj.labels[l].properties).toEqual(label[l])
            }

            let label_ref = {
                "play": [],
                "work": [],
                "job": [],
                "task": [],
                "hobby": [],
                "diary": [],
                "show": [],
                "music": [],
                "sport": [],
                "travel": []
            }

            // Assign labels
            for (let count = 0; count < 48; count++) {
                let l = Object.keys(label)[Math.floor(Math.random() * 10)]
                ref.journals[date + count]['label'] = l
                label_ref[l].push(date + count)
                obj.label(date + count, l)
                expect((date + count) in obj.labels[l].journals).toBeTruthy()
            }

            for (let l in label_ref) {
                expect(Object.keys(obj.labels[l].journals).sort()).toEqual(label_ref[l].sort())
            }
            
            
        });

        it('Checking labels from saved data', async () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };

            let label = {
                "play": {
                    color: "FFFFFF"
                }, 
                "work": {
                    color: "FFFFFE"
                }, 
                "job": {
                    color: "FFFFFB"
                }, 
                "task": {
                    color: "FFFAFF"
                }, 
                "hobby": {
                    color: "F2FFFF"
                }, 
                "diary": {
                    color: "FF3FFF"
                }, 
                "show": {
                    color: "FF0FFF"
                }, 
                "music": {
                    color: "FFF1FF"
                }, 
                "sport": {
                    color: "9FFFFF"
                }, 
                "travel": {
                    color: "FFFFF9"
                }
            };
            
            let saved_data;

            // Preparing the journals
            let obj = new Journals(JSON.parse(JSON.stringify(ref)), data => {return new Promise((resolve) => {saved_data = data; resolve();})});
            await obj.isReady;
            let date = new Date();
            date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            for (let count = 0; count < 50; count++) {
                let random_dict = {
                    "time" : 1550476186479,
                    "blocks" : [],
                    "version" : "2.8.1"
                };
                for (let x = 0; x < 10; x++) {
                    let temp = {}
                    temp[Math.random().toString(36).substring(7)] = Math.random().toString(36).substring(7);
                    random_dict.blocks.push(temp)
                }
                ref.journals[date + count] = random_dict
                await obj.save(date + count, random_dict)
            }

            // Create labels
            for (let l in label) {
                ref.labels[l] = label[l]
                obj.newlabel(l, label[l])
            }          

            let label_ref = {
                "play": [],
                "work": [],
                "job": [],
                "task": [],
                "hobby": [],
                "diary": [],
                "show": [],
                "music": [],
                "sport": [],
                "travel": []
            }

            // Assign labels
            for (let count = 0; count < 48; count++) {
                let l = Object.keys(label)[Math.floor(Math.random() * 10)]
                ref.journals[date + count]['label'] = l
                label_ref[l].push(date + count)
                obj.label(date + count, l)
            }
            // Remove labels, expected to fail because they are linked to journals
            // console.error = jest.fn()
            // for (let l in label) {
            //     expect(obj.removelabel(l)).toBe(1);
            // }       
            // Actual load test
            obj = new Journals(JSON.parse(saved_data), data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))
            await obj.isReady;

            for (let l in label_ref) {
                expect(Object.keys(obj.labels[l].journals).sort()).toEqual(label_ref[l].sort())
            }

            for (let l in obj.labels) {
                expect(obj.labels[l].properties).toEqual(label[l])
            }
        });

        it('Checking labels removing', async () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };

            let label = {
                "play": {
                    color: "FFFFFF"
                }, 
                "work": {
                    color: "FFFFFE"
                }, 
                "job": {
                    color: "FFFFFB"
                }, 
                "task": {
                    color: "FFFAFF"
                }, 
                "hobby": {
                    color: "F2FFFF"
                }, 
                "diary": {
                    color: "FF3FFF"
                }, 
                "show": {
                    color: "FF0FFF"
                }, 
                "music": {
                    color: "FFF1FF"
                }, 
                "sport": {
                    color: "9FFFFF"
                }, 
                "travel": {
                    color: "FFFFF9"
                }
            };

            let saved_data;
            
            // Preparing the journals
            let obj = new Journals(ref, data => {return new Promise((resolve) => {saved_data = data; resolve();})});
            await obj.isReady;
            let date = new Date();
            date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            expect(obj.removelabel("noneExisting")).toBe(1);
            expect(obj.getLabelDate(date)).toEqual({});
            // Create labels
            for (let l in label) {
                ref.labels[l] = label[l]
                obj.newlabel(l, label[l])
                obj.labelDate(l, date);
            }          

            // Remove labels
            for (let l in label) {
                obj.removeLabelDate(label[l], date)
                obj.removelabel(l)
            }       
            expect(obj.labels).toEqual({});

        });


        it('Testing ability to change settings', async () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };
            
            let saved_data;

            // Preparing the journals
            let obj = new Journals(ref, data => {return new Promise((resolve) => {saved_data = data; resolve();})});
            await obj.isReady;
            obj.settings = "test";
            let refSetting = {
                    "0": "t",
                    "1": "e",
                    "2": "s",
                    "3": "t",
            }
            expect(obj.settings).toEqual(refSetting);

        });
    });

    describe("Journals with date specific labels", () => {
        let ref, journal, date;
        it("Initialize Journal", async() => {
            ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            }
            journal = new Journals(JSON.parse(JSON.stringify(ref)), data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))
            await journal.isReady;

            date = new Date();
            date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            for (let count = 0; count < 50; count++) {
                let random_dict = {
                    "time" : 1550476186479,
                    "blocks" : [],
                    "version" : "2.8.1"
                };
                for (let x = 0; x < 10; x++) {
                    let temp = {}
                    temp[Math.random().toString(36).substring(7)] = Math.random().toString(36).substring(7);
                    random_dict.blocks.push(temp)
                }
                ref.journals[date + count] = random_dict;
                await journal.save(date + count, random_dict);
            }
        });

        it("Get Labels from empty journals", async () => {
            expect(journal.getLabelDate(date + 5)).toEqual({});
        });

        it("Remove Labels from empty journals", async() => {
            await journal.removeLabelDate(date + 6);
        });

        it("Create Labels", async () => {
            for (let count = 0; count < 50; count++) {
                ref.journals[date + count].labels = {};
                for (let x = 0; x < 10; x++) {
                    let label_name = Math.random().toString(36).substring(7);
                    ref.journals[date + count].labels[label_name] = {prop: label_name};
                    await journal.labelDate(date + count, label_name, {prop: label_name});
                }
            }
        });

        it("Edit Labels", async () => {
            for (let count = 0; count < 50; count+=2) {
                let labels = ref.journals[date + count].labels;
                for (let label in labels) {
                    let newProp = Math.random().toString(36).substring(7)
                    labels[label].prop = newProp;
                    await journal.labelDate(date + count, label, {prop: newProp});
                }
            }
        });

        it("Remove Labels", async () => {
            for (let count = 0; count < 50; count+=3) {
                let labels = ref.journals[date + count].labels;
                for (let label in labels) {
                    if (Math.random() < 0.5) {
                        delete ref.journals[date + count].labels[label];
                        await journal.removeLabelDate(date + count, label);
                    }
                }
            }
        });

        it("Get Labels", async () => {
            for (let count = 0; count < 50; count+=3) {
                let labels = ref.journals[date + count].labels;
                expect(journal.getLabelDate(date + count)).toEqual(labels);
            }
        });
    });

    describe("Settings", () => {
        let ref, journal;
        it("Initialize Journal", async() => {
            ref = {
                'labels': {},
                'journals': {}
            }
            journal = new Journals(JSON.parse(JSON.stringify(ref)), data => Promise.resolve(() => {
                expect(JSON.parse(data)).toEqual(ref);
            }));
            await journal.isReady;
            ref.settings = {};
        });
        it("Save Settings", async() => {
            for (let x = 0; x < 10; x++) {
                let property = Math.random().toString(36).substring(7);
                ref.settings[property] = property;
                let setting = {};
                setting[property] = property;
                journal.settings = setting;
            }
        });
        it("Load Settings", async() => {
            expect(journal.settings).toEqual(ref.settings);
        });
        it("Load Settings from storage", async() => {

            journal = new Journals(JSON.parse(JSON.stringify(ref)), data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))
            await journal.isReady;
            expect(journal.settings).toEqual(ref.settings);
        });
    })
})
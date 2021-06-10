const Journals = require('storage/journals')
const Storage = require('storage/storage')
const {Assets, AssetsMockWrapper} = require('../../storage/assets');
describe("Storage Interface", () => {
    it ('Test storage journal initialization', () => {
        expect(Storage.journals.isReady).resolves.toBe(expect.anything())
    })
    it ('Test storage assets initialization', () => {
        
        // const newJournal = new Journals(ref, data => expect(JSON.parse(data)).toEqual(ref));
        // // await newJournal.isReady;

        // const newAssetDB = new AssetsMockWrapper();
        // const newAsset = new Assets(newAssetDB);
        // Storage.init('dexie', {
        //     journals: newJournal,
        //     assets: newAsset
        // });
        // expect(Storage.assets.isReady).resolves.toBe(expect.anything())
        // Storage.journals= new Journals(() => undefined, data => Promise.resolve(expect(JSON.parse(data))));
        // expect(Storage.journals.isReady).resolves.toBe(expect.anything())
        
    })


    describe("Pure Journal", () => {
        it('Initial from empty dictionary', () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };
            
            (new Journals(() => undefined, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
            (new Journals(() => null, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
            (new Journals(() => {}, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
            (new Journals(() => "", data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))).isReady.then(o => o.push());
        });

        it('Adding journals', async () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };
            
            let obj = new Journals(ref, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)));
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
                obj.save(date + count, random_dict)
            }
        });

        it('Loading journals from saved data', async () => {
            let ref = {
                'labels': {},
                'journals': {},
                'settings': {}
            };
            
            let saved_data;
            let obj = new Journals(ref, data => {return new Promise((resolve) => {saved_data = data; resolve();})});
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
            let obj = new Journals(ref, data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)));
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
                obj.save(date + count, random_dict)
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
            let obj = new Journals(ref, data => {return new Promise((resolve) => {saved_data = data; resolve();})});
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
                obj.save(date + count, random_dict)
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
                obj.save(date + count, random_dict)
            }
            expect(obj.removelabel("noneExisting")).toBe(0);
            expect(obj.getLabelDate(date)).toEqual({});
            // Create labels
            for (let l in label) {
                ref.labels[l] = label[l]
                obj.newlabel(l, label[l])
                obj.labelDate(label[l], date);
            }          

            for (let l in label) {
                obj.removeLabelDate(label[l], date)
                obj.removelabel(label[l])
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
            // for (let count = 0; count < 48; count++) {
            //     let l = Object.keys(label)[Math.floor(Math.random() * 10)]
            //     ref.journals[date + count]['label'] = l
            //     label_ref[l].push(date + count)
            //     obj.label(date + count, l)
            // }
            // expect(obj.getLabelDate(date)).toEqual({});

            // // Actual load test
            // obj = new Journals(JSON.parse(saved_data), data => Promise.resolve(expect(JSON.parse(data)).toEqual(ref)))
            // await obj.isReady;

            // for (let l in label_ref) {
            //     expect(Object.keys(obj.labels[l].journals).sort()).toEqual(label_ref[l].sort())
            // }

            // for (let l in obj.labels) {
            //     expect(obj.labels[l].properties).toEqual(label[l])
            // }
        });
    });
})
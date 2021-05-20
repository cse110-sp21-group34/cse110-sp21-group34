const Journals = require('../storage')

describe("Storage Interface", () => {

    describe("Pure Journal", () => {
        it('Initial from empty dictionary', () => {
            let ref = {
                'labels': {},
                'journals': {}
            };
            
            (new Journals(undefined, data => expect(JSON.parse(data)).toEqual(ref))).push();
            (new Journals(null, data => expect(JSON.parse(data)).toEqual(ref))).push();
            (new Journals({}, data => expect(JSON.parse(data)).toEqual(ref))).push();
            (new Journals("", data => expect(JSON.parse(data)).toEqual(ref))).push();
        });

        it('Adding journals', () => {
            let ref = {
                'labels': {},
                'journals': {}
            };
            
            let obj = new Journals(ref, data => expect(JSON.parse(data)).toEqual(ref));
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

        it('Loading journals from saved data', () => {
            let ref = {
                'labels': {},
                'journals': {}
            };
            
            let saved_data;
            let obj = new Journals(ref, data => {saved_data = data});
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

            obj = new Journals(JSON.parse(saved_data), data => expect(JSON.parse(data)).toEqual(ref));
            expect(obj.journals).toEqual(ref.journals)
        });
    })


    describe("Journal with labels", () => {
        it('Adding journals and label it', () => {
            let ref = {
                'labels': {},
                'journals': {}
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
            let obj = new Journals(ref, data => expect(JSON.parse(data)).toEqual(ref));
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

        it('Checking labels from saved data', () => {
            let ref = {
                'labels': {},
                'journals': {}
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
            let obj = new Journals(ref, data => {saved_data = data});
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
            obj = new Journals(JSON.parse(saved_data), data => expect(JSON.parse(data)).toEqual(ref))

            for (let l in label_ref) {
                expect(Object.keys(obj.labels[l].journals).sort()).toEqual(label_ref[l].sort())
            }

            for (let l in obj.labels) {
                expect(obj.labels[l].properties).toEqual(label[l])
            }
        });
    });
})
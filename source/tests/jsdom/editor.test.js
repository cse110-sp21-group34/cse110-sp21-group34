/**
 * @jest-environment jsdom
 */

const Editor = require('editor');
const Journals = require('storage/journals');


describe("Editor", () => {
    it('Test 1', async() => {
        let ref = {
            'labels': {},
            'journals': {}
        };

        const newJournal = new Journals(ref, data => expect(JSON.parse(data)).toEqual(ref));
        await newJournal.isReady;
        

        let date = "2021-5-31";
        let holder = "editor";
        let newEditor = new Editor(date, holder);
        console.log(newEditor);
        expect(newEditor.date).toBe("2021-5-31");
    });
});
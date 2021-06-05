/**
 * @jest-environment jsdom
 */
describe("Editor", () => {
    it('Test 1', async() => {
        let ref = {
            'labels': {},
            'journals': {}
        };

        const Journals = require('storage/journals');
        const {Assets, AssetsMockWrapper} = require('storage/assets');

        const newJournal = new Journals(ref, data => expect(JSON.parse(data)).toEqual(ref));
        await newJournal.isReady;

        const newAssetDB = new AssetsMockWrapper();
        const newAsset = new Assets(newAssetDB);
        
        const storage = require('storage');
        storage.init('test', {
            journals: newJournal,
            assets: newAsset
        });
        const Editor = require('editor');

        let date = "2021-5-31";
        let holder = "editor";
        let newEditor = new Editor(date, holder, {journals: newJournal});
        console.log(newEditor);
        expect(newEditor.date).toBe("2021-5-31");
    });
});
/**
 * @jest-environment jsdom
 */
describe("Editor", () => {
    it('Initialize Test', async() => {
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
        let holderNode = document.createElement('div');
        holderNode.id = holder;
        document.body.appendChild(holderNode);
        console.log(document.getElementById('editor'));

        let newEditor = new Editor(date, holder, {journals: newJournal});
        expect(newEditor.isReady).resolves.toBe(expect.anything());
    });
});
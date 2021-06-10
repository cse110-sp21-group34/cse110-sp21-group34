/**
 * @jest-environment jsdom
 */
describe("Editor", () => {
    it('Initialize Test', async() => {
        let ref = {
            'labels': {},
            'journals': {}
        };

        const Journals = require('../../storage/journals');
        const {Assets, AssetsMockWrapper} = require('../../storage/assets');
        const newJournal = new Journals(ref, data=> expect(JSON.parse(data)).toEqual(ref) );

        await newJournal.isReady;


        const newAssetDB = new AssetsMockWrapper();
        const newAsset = new Assets(newAssetDB);
        
        const storage = require('storage');
        storage.init('test', {
            journals: newJournal,
            assets: newAsset
        });
        const Editor = require('editor');

        storage.currentDate = "2021-5-31";
        let holder = "editor";
        let holderNode = document.createElement('div');
        holderNode.id = holder;
        document.body.appendChild(holderNode);

        storage.currentEditor = new Editor(holder);
        expect(storage.currentEditor.isReady).resolves.toBe(expect.anything());
    });
});
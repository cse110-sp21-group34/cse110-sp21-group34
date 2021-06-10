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

        let date = "2021-5-31";
        let holder = "editor";
        let holderNode = document.createElement('div');
        holderNode.id = holder;
        document.body.appendChild(holderNode);

        let newEditor = new Editor(date, holder, {journals: newJournal});
        expect(newEditor.isReady).resolves.toBe(expect.anything());
        expect(storage.assets).toEqual({"db": {"db": {}}, "map": {}})
        storage.assets = {};
        expect(newJournal.settings).toEqual({});
        expect(storage.assets).toEqual({})
    });


    it('Testing assets with dexiesWrapper', async() => {
        const {Assets, AssetsDexieWrapper} = require('../../storage/assets');
        var aFileParts = ['<a id="a"><b id="b">hey!</b></a>']; // an array consisting of a single DOMString
        var blob= new Blob(aFileParts, {type : 'text/html'}); // the blob

        const newAssetDB = new AssetsDexieWrapper('test-assets')
        const newAsset = new Assets(newAssetDB);
        const uid = newAsset.save(blob);
        newAssetDB.submit(blob);

        console.log = jest.fn()
        newAssetDB.retrieve(uid);
        expect(newAsset.get(uid)).resolves.toEqual(blob);
        newAssetDB.remove(uid);
        expect(newAsset.del(uid)).toBe(0);
        
    });


    
    it('Testing assets with mockWrapper', async() => {
        const {Assets, AssetsMockWrapper} = require('../../storage/assets');
        var aFileParts = ['<a id="a"><b id="b">hey!</b></a>']; // an array consisting of a single DOMString
        var blob= new Blob(aFileParts, {type : 'text/html'}); // the blob

        const newAssetDB = new AssetsMockWrapper('test-assets')
        const newAsset = new Assets(newAssetDB);
        const uid = newAsset.save(blob);
        newAssetDB.submit(blob);

        
        console.log = jest.fn()
        newAssetDB.retrieve(uid);
        expect(newAsset.get(uid)).resolves.toEqual(blob);
        newAssetDB.remove(uid);
        expect(newAsset.del(uid)).toBe(0);
        
        
    });
});
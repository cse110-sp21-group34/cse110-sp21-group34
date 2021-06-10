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
        expect(storage.journals).not.toBe('')
        expect(storage.assets).not.toBe('')
        const Editor = require('editor');

        storage.currentDate = "2021-5-31";
        let holder = "editor";
        let holderNode = document.createElement('div');
        holderNode.id = holder;
        document.body.appendChild(holderNode);

        storage.currentEditor = new Editor(holder);
        expect(storage.currentEditor.isReady).resolves.toBe(expect.anything());
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
// constructs journal and editor
const Journal = require('storage');
const Editor = require('editor');

import {expect, jest, test} from '@jest/globals';

jest.useFakeTimers();

describe('Basic user flow for SPA ', () => {

    // test 1 is given
    it('Test2', () => {
        let ref = {
            'labels': {},
            'journals': {}
        };

        const newJournal = new Journal(ref, data => expect(JSON.parse(data)).toEqual(ref));
        newJournal.push();

        let date = "2021-06-02";
        let holder = "editor";
        let newEditor = new Editor(date, holder);
        console.log(newEditor);
        expect(newEditor.date).toBe("2021-06-02");
    });
        

});
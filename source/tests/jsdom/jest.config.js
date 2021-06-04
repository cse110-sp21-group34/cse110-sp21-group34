module.exports = {
    name: 'jsdom',
    displayName: 'Jsdom Tests',

    // A list of paths to directories that 
    // Jest should use to search for files in
    roots: [
      './'
    ],

    // ...and your other env options, 
    // such as test environment, coverage, etc
    "verbose": true,
    "silent": true,
    "preset": "jest-puppeteer"
};
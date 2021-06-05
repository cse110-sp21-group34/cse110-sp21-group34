module.exports = {
  verbose: true,
  projects: [
    {
      name: 'e2e',
      displayName: 'End-to-End Tests',
      preset: "jest-puppeteer",
  
      // A list of paths to directories that 
      // Jest should use to search for files in
      roots: [
        './'
      ],
      testMatch: ["**/*.e2e.js"]
    },
    {
      name: 'jsdom',
      displayName: 'Jsdom Tests',
      roots: [
        './'
      ],
      testMatch: ["**/*.jsdom.js"],
      moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "\\.(gif|ttf|eot|svg)$": "./__mocks__/fileMock.js"
      }
    },
    {
      name: 'unit',
      displayName: 'Unit Tests',
      roots: [
        './'
      ],
      testMatch: ["**/*.test.js"]
    }
  ]
}; 
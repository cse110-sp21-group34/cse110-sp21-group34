module.exports = {
  verbose: true,
  rootDir: "../",
  projects: [
    {
      name: 'e2e',
      displayName: 'End-to-End',
      preset: "jest-puppeteer",
  
      // A list of paths to directories that 
      // Jest should use to search for files in
      roots: [
        '../'
      ],
      testMatch: ["**/*.e2e.js"]
    },
    {
      name: 'jsdom',
      displayName: 'Jsdom',
      roots: [
        '../'
      ],
      testMatch: ["**/*.jsdom.js"],
      moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "\\.(gif|ttf|eot|svg)$": "./__mocks__/fileMock.js"
      }
    },
    {
      name: 'unit',
      displayName: 'Unit',
      roots: [
        '../'
      ],
      testMatch: ["**/*.test.js"]
    }
  ]
}; 
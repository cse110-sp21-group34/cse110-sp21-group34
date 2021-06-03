module.exports = {
 // "verbose": true,
 // "silent": true,
 // "preset": "jest-puppeteer",
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  }

}
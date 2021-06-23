
/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  productName: 'HexaDices',
  appId: 'com.hexarolls.hexadices',
  electronVersion: process.env.ELECTRON_VERSION, // only used for development debugging
  directories: {
    output: 'build',
    buildResources: 'build',
    app: 'dist'
  },
  // assign publish for auto-updater
  // set this to your own repo!
  publish: [{
    provider: 'github',
    owner: 'HexaRolls',
    repo: 'https://github.com/HexaRolls/HexaDices.git',
    token: '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'
  }],
  files: [
    // don't include node_modules as all js modules are bundled into production js by rollup
    // unless you want to prevent some module to bundle up
    // list them below
  ]
}

module.exports = config

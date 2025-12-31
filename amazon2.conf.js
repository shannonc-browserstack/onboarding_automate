exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  mochaOpts: {
        ui: 'bdd',
        // Increase the timeout to 60 seconds (60000ms) for robustness
        timeout: 20000, 
    },
  services: [
    [
      'browserstack',
      { browserstackLocal: false, 
        opts: { forcelocal: false },
        //setSessionStatus: true
        //testObservability: true,
        //testObservabilityOptions: {
        //        'projectName': 'Automate Test',
        //        'buildName': 'automate test',
        //        'buildTag': 'run-3'
        //    },
        //percy: 'false',
        //percyCaptureMode: 'auto'
      },
    ],
  ],
  // add path to the test file
  specs: ['./tests/amazon2.js'],
  capabilities: [
    {
      browserName: 'Chrome',
      'bstack:options': {
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11'
      }
    },
    {
      browserName: 'Safari',
      'bstack:options': {
        browserVersion: '15.6',
        os: 'OS X',
        osVersion: 'Monterey'
      }
    },
    {
      browserName: 'Chromium',
      'bstack:options': {
        deviceOrientation: 'portrait',
        deviceName: 'iPhone 14',
        osVersion: '18'
      }
    } 
  ],
  commonCapabilities: {
    'bstack:options': {
      projectName: 'Automate WDIO Amazon',
      buildName: 'automate test',
      buildIdentifier: "${BUILD_NUMBER}",
      consoleLogs: 'info',
      networkLogs: 'true'
    }
  },
  maxInstances: 10,
  // rest of your config goes here...
};
exports.config.capabilities.forEach(function (caps) {
  for (let i in exports.config.commonCapabilities)
    caps[i] = { ...caps[i], ...exports.config.commonCapabilities[i]};
});

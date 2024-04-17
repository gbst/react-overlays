const { rules, plugins } = require('webpack-atoms');

// for tests to run under WSL, you will have to configure karma
// https://stackoverflow.com/questions/54090298/karma-use-windows-chrome-from-wsl
// and you have to make sure browser has focus

// fix 0308010C:digital envelope routines::unsupported
// webpack 5.54+ fix this
const crypto = require('crypto');
const cryptoOrigCreateHash = crypto.createHash;
crypto.createHash = algorithm =>
  cryptoOrigCreateHash(algorithm === 'md4' ? 'sha256' : algorithm);

module.exports = config => {
  const { env } = process;

  config.set({
    frameworks: ['mocha', 'sinon-chai'],

    files: ['test/index.js'],

    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [rules.js()],
      },
      plugins: [
        plugins.define({
          'process.env.NODE_ENV': JSON.stringify('test'),
          __DEV__: true,
        }),
      ],
      devtool: 'cheap-module-inline-source-map',
    },

    webpackMiddleware: {
      noInfo: true,
    },

    reporters: ['mocha', 'coverage'],

    mochaReporter: {
      output: 'autowatch',
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
    },

    customLaunchers: {
      ChromeCi: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },

    browsers: env.BROWSER ? env.BROWSER.split(',') : ['Chrome'],
  });
};

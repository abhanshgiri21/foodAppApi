#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// This script is intended to execute all unit tests.
// ---------------------------------------------------------------------------------------------------------------------
/* eslint-env node, es6 */
// ---------------------------------------------------------------------------------------------------------------------
// This script is intended to execute all unit tests.
// ---------------------------------------------------------------------------------------------------------------------

require('shelljs/global');

// set directories and files for test and coverage report
var path = require('path'),

  NYC = require('nyc'),
  chalk = require('chalk'),
  recursive = require('recursive-readdir'),

  COV_REPORT_PATH = '.coverage',
  SPEC_SOURCE_DIR = path.join(__dirname, '..', 'test', 'unit');

module.exports = function (exit) {
  // banner line
  console.info(chalk.yellow.bold('Running unit tests using mocha on node...'));

  test('-d', COV_REPORT_PATH) && rm('-rf', COV_REPORT_PATH);
  mkdir('-p', COV_REPORT_PATH);

  const Mocha = require('mocha'),
    nyc = new NYC({
      reporter: ['text', 'text-summary', 'lcov'],
      reportDir: COV_REPORT_PATH,
      tempDirectory: COV_REPORT_PATH,
      hookRequire: true,
      include: ['api/**/*.js'],
      exclude: ['api/services', 'api/models'],
      all: true
    });

  nyc.wrap();
  // add all spec files to mocha
  recursive(SPEC_SOURCE_DIR, function (err, files) {
    if (err) {
      console.error(err);
      exit(1);

      return;
    }

    var mocha = new Mocha({ timeout: 1000 * 60 });

    // add bootstrap file
    mocha.addFile(path.join(SPEC_SOURCE_DIR, '_bootstrap.js'));

    files.filter(function (file) { // extract all test files
      return (file.substr(-8) === '.test.js');
    }).forEach(mocha.addFile.bind(mocha));

    mocha.run(async function (runError) {
      runError && console.error(runError.stack || runError);

      await nyc.reset();
      await nyc.writeCoverageFile();
      await nyc.report();
      exit(runError ? 1 : 0);
    });
  });
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(exit);

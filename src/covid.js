#! /usr/bin/env node

const ora = require('ora');

const { fetchCovidStats } = require('./data');
const { printStats } = require('./print');

const spinner = ora();

async function init() {
  try {
    spinner.start();
    const stats = await fetchCovidStats();
    spinner.stop();
    printStats(stats);
  } catch (error) {
    // fixme: better error log
    const customMessage =
      error.type === 'request-timeout'
        ? 'Request Timed Out! Please try again'
        : 'Something went wrong!';

    spinner.fail(customMessage);
    console.error(error.message);
    process.exit();
  }
}

init();

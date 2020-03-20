const Table = require('cli-table');
const { yellow, green, red, cyan, blue, dim } = require('kleur');
const terminalLink = require('terminal-link');

const districtTable = new Table({
  head: ['District', 'Cases', 'Recovered', 'Deaths'],
  colWidths: [26, 14, 14, 14],
  colAligns: ['left', 'right', 'right', 'right'],
  style: {
    head: ['cyan'],
    compact: true,
  },
});

const summaryTable = new Table({
  colWidths: [15, 17],
  colAligns: ['left', 'right'],
  style: {
    compact: true,
  },
});

const emptyRow = ['', '', '', ''];
const title = yellow('Sri Lanka COVID-19 Coronavirus Tracker');
const dataSourceLink = dim(terminalLink('http://covidsl.com', 'http://covidsl.com'));

function printDistrictStats(stats) {
  stats.districts.forEach(stat => {
    districtTable.push([stat.name, stat.cases, stat.recovered, stat.deaths]);
  });

  // unspecified data row
  if (stats.unspecified) {
    districtTable.push([
      stats.unspecified.name,
      stats.unspecified.cases,
      stats.unspecified.recovered,
      stats.unspecified.deaths,
    ]);
  }

  districtTable.push(emptyRow);

  // total count row
  districtTable.push([
    cyan(stats.total.name),
    blue(stats.total.cases),
    green(stats.total.recovered),
    red(stats.total.deaths),
  ]);

  console.log(yellow('\nDistrict Stats'));
  console.log(districtTable.toString());
}

function printSummary(stats) {
  summaryTable.push(['Tested', `${stats.tested.count}  (+${stats.tested.diff})`]);
  summaryTable.push([
    'Confirmed',
    `${blue(stats.confirmed.count)}  (+${stats.confirmed.diff})`,
  ]);
  summaryTable.push([
    'Recovered',
    `${green(stats.recovered.count)}  (+${stats.recovered.diff})`,
  ]);
  summaryTable.push([
    'Deaths',
    `${red(stats.deceased.count)}  (+${stats.deceased.diff})`,
  ]);

  console.log(yellow(`Summary Of ${stats.date}`));
  console.log(summaryTable.toString());
}

exports.printStats = function(stats) {
  const lastUpdated = dim(`Last updated: ${stats.lastUpdated} \n`);

  console.log(title);
  console.log(lastUpdated);

  printSummary(stats.summary);
  printDistrictStats(stats);

  console.log(`\n${dim('For complete stats: ')} ${dataSourceLink}`);
};

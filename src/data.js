const fetch = require('node-fetch');

const { convertObjectValuesToNumber } = require('./utils');

function normalize(stat = {}) {
  return {
    name: stat.prefecture,
    cases: +stat.cases,
    recovered: +stat.recovered,
    deaths: +stat.deaths,
  };
}

function extractSummaryStats(dailyStats = []) {
  let length = dailyStats.length;
  if (length === 0) return {};

  const lastRecord = dailyStats[length - 1];
  const date = lastRecord.date;
  const lastRecordCount = convertObjectValuesToNumber(lastRecord);

  if (length === 1) {
    return {
      date,
      tested: { count: lastRecordCount.tested, diff: 0 },
      confirmed: { count: lastRecordCount.confirmed, diff: 0 },
      recovered: { count: lastRecordCount.recovered, diff: 0 },
      deceased: { count: lastRecordCount.deceased, diff: 0 },
    };
  }

  const secondToLastRecordCount = convertObjectValuesToNumber(dailyStats[length - 2]);

  return {
    date,
    tested: {
      count: lastRecordCount.tested,
      diff: lastRecordCount.tested - secondToLastRecordCount.tested,
    },
    confirmed: {
      count: lastRecordCount.confirmed,
      diff: lastRecordCount.confirmed - secondToLastRecordCount.confirmed,
    },
    recovered: {
      count: lastRecordCount.recovered,
      diff: lastRecordCount.recovered - secondToLastRecordCount.recovered,
    },
    deceased: {
      count: lastRecordCount.deceased,
      diff: lastRecordCount.deceased - secondToLastRecordCount.deceased,
    },
  };
}

function dto(stats) {
  const formattedData = {
    lastUpdated: 'N/A',
    districts: [],
    total: {},
    unspecified: {},
    summary: {},
  };

  if (stats.updated.length) {
    formattedData.lastUpdated = stats.updated[0].lastupdated;
  }

  stats.prefectures
    .filter(p => +p.cases || +p.recovered || +p.deaths)
    .forEach(item => {
      if (item.prefecture === 'Total') {
        formattedData.total = normalize(item);
        return;
      }

      if (item.prefecture === 'Unspecified') {
        formattedData.unspecified = normalize(item);
        return;
      }

      formattedData.districts.push(normalize(item));
    });

  // sort the districts by cases in descending order
  formattedData.districts = formattedData.districts.sort((a, b) => b.cases - a.cases);

  // Daily summary
  formattedData.summary = extractSummaryStats(stats.daily);

  return formattedData;
}

exports.fetchCovidStats = function() {
  const dataSource = 'https://covid-19sl.s3-ap-northeast-1.amazonaws.com/data.json';
  const timeout = 10000; // 10 second

  return fetch(dataSource, { timeout })
    .then(res => res.json())
    .then(stats => {
      return dto(stats);
    });
};

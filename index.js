// import * as dotenv from 'dotenv';
// dotenv.config();

const https = require('https');
const JSONStream = require('JSONStream');
const { DATA_URL } = require('./config/download.js');
const bqConfig = require('./config/bigquery.js');
const { getTable, insertData } = require('./bigquery.js');

const downloadFile = async () => {
  if (!DATA_URL) {
    throw 'No url';
  }

  https.get(DATA_URL, (res) => {
    const jsonStream = res.pipe(JSONStream.parse('*'));
    const tableConfig = bqConfig['nacp'];
    getTable(tableConfig).then(() => insertData(jsonStream, tableConfig));
  });
};

downloadFile();

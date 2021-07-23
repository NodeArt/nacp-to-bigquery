import * as dotenv from 'dotenv';
dotenv.config();

import * as JSONStream from 'JSONStream';
import * as https from 'https';

import { DATA_URL } from './config/download.js';

const downloadFile = async () => {
  // Import in function for correct env config setup
  const bqConfig = await import('./config/bigquery.js');
  const { getTable, insertData } = await import('./bigquery.js');

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

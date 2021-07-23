import * as bq from '@google-cloud/bigquery';
import * as rs from 'readable-stream';
import { bigqueryConfig, nacp } from './config/bigquery.js';

// Check all env variables in bigquery config
if (Object.values(bigqueryConfig).includes(undefined)) {
  throw 'no connection settings in env';
}

// Connect to Google BigQuery
const db = new bq.BigQuery({
  projectId: bigqueryConfig.projectID,
  credentials: {
    client_email: bigqueryConfig.client_email,
    private_key: bigqueryConfig.private_key,
  },
  clientOptions: {
    clientId: bigqueryConfig.clientId,
  },
});

// Create table with name in tableID
const createTable = (tableConfig) => {
  const options = {
    schema: tableConfig.settlementsSchema,
  };

  console.log('Creating table ', tableConfig.tableID);

  return db
    .dataset(bigqueryConfig.datasetID)
    .createTable(tableConfig.tableID, options);
};

// Drop table and call createTable
export async function getTable(tableConfig) {
  const exists = await db
    .dataset(bigqueryConfig.datasetID)
    .table(tableConfig.tableID)
    .exists();

  if (exists[0]) {
    console.log('Drop table');
    await db
      .dataset(bigqueryConfig.datasetID)
      .table(tableConfig.tableID)
      .delete();
  }

  return createTable(tableConfig);
}

export async function insertData(jsonStream, tableConfig) {
  // Creating BigQuery table connect
  const bqStream = db
    .dataset(bigqueryConfig.datasetID)
    .table(tableConfig.tableID)
    .createWriteStream({
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
    });

  let count = 1;
  // All properties from scheme, to check them all
  const propertiesArray = [];
  nacp.settlementsSchema.forEach((obj) => propertiesArray.push(obj.name));

  const stream = jsonStream.pipe(
    new rs.Transform({
      objectMode: true,
      transform(chunk, enc, callback) {
        const dataObj = {};
        propertiesArray.forEach((prop, index) => {
          if (index === 31) {
            // in response we have case like [{},null], null we need to catch
            if (Array.isArray(chunk?.[prop])) {
              dataObj[prop] = [];
              chunk[prop].forEach((elem) => {
                if (elem) {
                  dataObj[prop].push(elem);
                }
              });
            } else {
              dataObj[prop] = [
                {
                  codexArticleId: null,
                  codexArticleName: null,
                },
              ];
            }
          } else {
            dataObj[prop] = chunk?.[prop] ?? null;
          }
        });
        // Next row for debug
        // console.log(`Count ${count} ${JSON.stringify(dataObj)}`);

        this.push(JSON.stringify(dataObj) + '\n');
        if (count % 1000 === 0) {
          console.log(count);
        }
        count++;
        callback();
      },
    })
  );

  stream.pipe(bqStream);
  bqStream.once('complete', () => {
    console.log('bq end');
    process.exit(0);
  });
}

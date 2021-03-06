const { BigQuery } = require('@google-cloud/bigquery');
const { Transform } = require('readable-stream');
const { bigqueryConfig, nacp } = require('./config/bigquery.js');

// Check all env variables in bigquery config
if (Object.values(bigqueryConfig).includes(undefined)) {
  throw 'no connection settings in env';
}

// Connect to Google BigQuery
const db = new BigQuery({
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
module.exports.getTable = async (tableConfig) => {
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
};

module.exports.insertData = async (jsonStream, tableConfig) => {
  // Creating BigQuery table connect
  const bqStream = db
    .dataset(bigqueryConfig.datasetID)
    .table(tableConfig.tableID)
    .createWriteStream({
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
    });

  let count = 1;

  const stream = jsonStream.pipe(
    new Transform({
      objectMode: true,
      transform(chunk, enc, callback) {
        const dataObj = {};
        nacp.settlementsSchema.forEach((prop) => {
          if (prop.mode === 'REPEATED') {
            // in response we have case like [{},null], null we need to catch
            if (Array.isArray(chunk?.[prop.name])) {
              dataObj[prop.name] = chunk[prop.name].filter((el) => el);
            } else {
              dataObj[prop.name] = [
                {
                  codexArticleId: null,
                  codexArticleName: null,
                },
              ];
            }
          } else {
            dataObj[prop.name] = chunk?.[prop.name] ?? null;
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
};

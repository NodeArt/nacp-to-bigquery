import { BigQuery } from '@google-cloud/bigquery';

import { bigqueryConfig } from './config/bigquery.js';

// Check all env variables in bigquery config
if (Object.values(bigqueryConfig).includes(undefined)) {
  console.log(bigqueryConfig);
  console.error('no connection settings in env');
  process.exit(100);
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

export async function insertData(objectsArray, tableConfig) {
  // Creating BigQuery table connect
  const bqTable = db
    .dataset(bigqueryConfig.datasetID)
    .table(tableConfig.tableID);

  let count = 0;
  // How much rows we send in one iteration
  const step = 1000;
  while (objectsArray[count]) {
    console.log(count);
    await bqTable.insert(objectsArray.slice(count, count + step));
    count += step;
  }
}

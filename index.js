import { config } from 'dotenv';
config();
import fetch from 'node-fetch';
import Excel from 'exceljs';

import { DATA_URL } from './config/download.js';

const downloadFile = async () => {
  // Import in function for correct env config setup
  const bqConfig = await import('./config/bigquery.js');
  const { getTable, insertData } = await import('./bigquery.js');

  // Finding direct url
  const res = await fetch(DATA_URL);
  const json = await res.json();
  const resourcesArray = json.result.resources;
  const allDataRsourse = resourcesArray.find((resource) => {
    return resource?.name?.includes('GetAllData');
  });

  const fileUrl = allDataRsourse?.url;
  const fileReq = await fetch(fileUrl);

  const workbook = new Excel.Workbook();
  await workbook.xlsx.read(fileReq.body);
  const worksheet = workbook.getWorksheet(2);
  const propertiesArray = [];
  const objectsArray = [];
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber === 1) {
      const parsedArray = JSON.parse(JSON.stringify(row.values)).slice(1);
      parsedArray.forEach((element) => {
        propertiesArray.push(element.replace(/[.]+/g, ''));
      });
      return;
    }
    const valuesArray = JSON.parse(JSON.stringify(row.values)).slice(1);
    const rowObject = {};
    propertiesArray.forEach((prop, index) => {
      rowObject[prop] = valuesArray?.[index] ?? null;
    });
    objectsArray.push(rowObject);
  });

  const tableConfig = bqConfig['nacp'];
  await getTable(tableConfig);
  await insertData(objectsArray, tableConfig);
  console.log('complete');
};

downloadFile();

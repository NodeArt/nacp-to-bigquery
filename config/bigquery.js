export const bigqueryConfig = {
  datasetID: process.env?.BQ_DATASET_ID,
  projectID: process.env?.BQ_PROJECT_ID,
  private_key: decodeURI(process.env?.BQ_PRIVATE_KEY),
  clientId: process.env?.BQ_CLIENT_ID,
  client_email: process.env?.BQ_CLIENT_EMAIL,
};

export const nacp = {
  tableID: 'nacp_s',
  settlementsSchema: [
    { name: 'Column1id', type: 'INT64', mode: 'NULLABLE' },
    { name: 'Column1punishmentType', type: 'STRING', mode: 'NULLABLE' },
    { name: 'Column1entityType', type: 'STRING', mode: 'NULLABLE' },
    {
      name: 'Column1indLastNameOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'Column1indFirstNameOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'Column1indPatronymicOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'Column1indPlaceOfWorkOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'Column1indPositionOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    { name: 'Column1offenseName', type: 'STRING', mode: 'NULLABLE' },
    { name: 'Column1courtCaseNumber', type: 'STRING', mode: 'NULLABLE' },
    { name: 'Column1sentenceDate', type: 'STRING', mode: 'NULLABLE' },
    { name: 'Column1punishmentStart', type: 'STRING', mode: 'NULLABLE' },
    { name: 'Column1courtId', type: 'INT64', mode: 'NULLABLE' },
    { name: 'Column1courtName', type: 'STRING', mode: 'NULLABLE' },
    {
      name: 'Column1activitySphereOnOffenseMomentId',
      type: 'INT64',
      mode: 'NULLABLE',
    },
    {
      name: 'Column1activitySphereOnOffenseMomentName',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    { name: 'Column1sentenceNumber', type: 'STRING', mode: 'NULLABLE' },
    { name: 'Column1codexArticles', type: 'STRING', mode: 'NULLABLE' },
  ],
};

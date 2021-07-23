module.exports.bigqueryConfig = {
  datasetID: process.env?.BQ_DATASET_ID,
  projectID: process.env?.BQ_PROJECT_ID,
  private_key: decodeURI(process.env?.BQ_PRIVATE_KEY),
  clientId: process.env?.BQ_CLIENT_ID,
  client_email: process.env?.BQ_CLIENT_EMAIL,
};

module.exports.nacp = {
  tableID: 'nacp_s',
  record: ['punishmentType', 'entityType'],
  repeated: ['codexArticles'],
  settlementsSchema: [
    { name: 'id', type: 'INT64', mode: 'NULLABLE' },
    {
      name: 'punishmentType',
      type: 'STRUCT',
      mode: 'NULLABLE',
      fields: [
        {
          name: 'code',
          type: 'INT64',
          mode: 'NULLABLE',
        },
        {
          name: 'name',
          type: 'STRING',
          mode: 'NULLABLE',
        },
      ],
    },
    {
      name: 'entityType',
      type: 'STRUCT',
      mode: 'NULLABLE',
      fields: [
        {
          name: 'code',
          type: 'INT64',
          mode: 'NULLABLE',
        },
        {
          name: 'name',
          type: 'STRING',
          mode: 'NULLABLE',
        },
      ],
    },
    {
      name: 'indLastNameOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'indFirstNameOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'indPatronymicOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'indPlaceOfWorkOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'indPositionOnOffenseMoment',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    {
      name: 'activitySphereOnOffenseMomentId',
      type: 'INT64',
      mode: 'NULLABLE',
    },
    {
      name: 'activitySphereOnOffenseMomentName',
      type: 'STRING',
      mode: 'NULLABLE',
    },
    { name: 'addrPostIndex', type: 'STRING', mode: 'NULLABLE' },
    { name: 'addrCountryId', type: 'INT64', mode: 'NULLABLE' },
    { name: 'addrCountryName', type: 'STRING', mode: 'NULLABLE' },
    { name: 'addrStateId', type: 'STRING', mode: 'NULLABLE' },
    { name: 'addrStateName', type: 'STRING', mode: 'NULLABLE' },
    { name: 'addrStr', type: 'STRING', mode: 'NULLABLE' },
    { name: 'leFullNameOnOffenseMoment', type: 'STRING', mode: 'NULLABLE' },
    { name: 'leRegistrationNumber', type: 'STRING', mode: 'NULLABLE' },
    { name: 'leLegalFormId', type: 'INT64', mode: 'NULLABLE' },
    { name: 'leLegalFormName', type: 'STRING', mode: 'NULLABLE' },
    { name: 'offenseId', type: 'INT64', mode: 'NULLABLE' },
    { name: 'offenseName', type: 'STRING', mode: 'NULLABLE' },
    { name: 'punishment', type: 'STRING', mode: 'NULLABLE' },
    { name: 'decreeDate', type: 'STRING', mode: 'NULLABLE' },
    { name: 'decreeNumber', type: 'STRING', mode: 'NULLABLE' },
    { name: 'courtCaseNumber', type: 'STRING', mode: 'NULLABLE' },
    { name: 'sentenceDate', type: 'STRING', mode: 'NULLABLE' },
    { name: 'sentenceNumber', type: 'STRING', mode: 'NULLABLE' },
    { name: 'punishmentStart', type: 'STRING', mode: 'NULLABLE' },
    { name: 'courtId', type: 'INT64', mode: 'NULLABLE' },
    { name: 'courtName', type: 'STRING', mode: 'NULLABLE' },
    {
      name: 'codexArticles',
      type: 'STRUCT',
      mode: 'REPEATED',
      fields: [
        {
          name: 'codexArticleId',
          type: 'INT64',
          mode: 'NULLABLE',
        },
        {
          name: 'codexArticleName',
          type: 'STRING',
          mode: 'NULLABLE',
        },
      ],
    },
  ],
};

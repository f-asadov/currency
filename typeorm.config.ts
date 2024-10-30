const { DataSource } = require('typeorm');
const { dbConfig } = require('./src/config/typeorm.ts');

module.exports = new DataSource(dbConfig);

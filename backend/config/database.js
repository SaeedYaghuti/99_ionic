const Sequelize = require('sequelize');

const db = new Sequelize('shop', 'postgres', 'rootpass', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = db;



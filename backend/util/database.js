const Sequelize = require('sequelize');

const sequelize = new Sequelize('shop', 'postgres', 'rootpass', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;



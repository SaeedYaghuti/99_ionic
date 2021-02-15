"use strict";
 const Sequelize = require("sequelize");
 const sequelize = new Sequelize('shop', 'postgres', 'rootpass', {
    host: 'localhost',
    dialect: 'postgres',
    // pool: {
    //   max: 5,
    //   min: 0,
    //   idle: 10000
    // }
  });

const models = {
  Product: sequelize.import("./product") // kindly import the model created in the same folder in this manner and import more models name been created
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
module.exports = models;


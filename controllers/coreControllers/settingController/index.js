const createCRUDController = require("@/controllers/middlewaresControllers/createCRUDController");
const crudController = createCRUDController("Setting");

const listBySettingKey = require("./listBySettingsKey");
const readBySettingKey = require("./readBySettingKey");
const updateBySettingKey = require("./updateBySettingKey");
const updateManySetting = require("./updateManySetting");

const settingMethods = {
  read: crudController.read,
  create: createCRUDController.create,
  update: crudController.update,
  list: crudController.list,
  listAll: crudController.listAll,
  filter: crudController.filter,
  search: crudController.search,
  listBySettingKey,
  readBySettingKey,
  updateBySettingKey,
  updateManySetting,
};

module.exports = settingMethods;

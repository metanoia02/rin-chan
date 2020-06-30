const utils = require('./utils');

const database = require('./sql.js');

module.exports = class User {
  /**
   *
   * @param {string} userId
   * @param {string} guildId
   */
  constructor(userId, guildId) {
    this.user = database.getUser(userId, guildId);
  }

  /**
   * Modify quantity of object in users inventory
   * @param {string} objectName Name of object
   * @param {integer} modifier +/- modifier of object quantity
   */
  changeInventory(objectName, modifier) {
    const inventory = database.getInventory(this.user, objectName);

    database.setInventory.run(inventory);
  }
  getInventory() {}

  getObject() {}
  setSet() {}

  changeAffection() {}
  getAffection() {}
};

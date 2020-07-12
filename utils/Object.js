const database = require('./sql.js');
const CommandException = require('./CommandException.js');

module.exports = class RinObject {
  /**
   * Database object
   * @param {string} objectName Name of object
   */
  constructor(objectName) {
    this._obj = database.getObject(objectName);
  }

  getName() {
    return this._obj.name;
  }
  getValue() {
    return this._obj.value;
  }
  getDeterminer() {
    return this._obj.determiner;
  }
  getPlural() {
    return this._obj.plural;
  }
  getFilling() {
    return this._obj.filling;
  }

  //todo add setters
};

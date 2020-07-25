const database = require('./sql.js');
const CommandException = require('./CommandException.js');
const language = require('node-nlp/src/language');

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
  getNameTranslation(languageCode) {
    if (this._obj.hasOwnProperty(languageCode)) {
      return this._obj[languageCode];
    } else {
      throw new Error('Invalid language');
    }
  }

  //todo add setters
};

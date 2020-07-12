const database = require('./sql.js');
const RinObject = require('./Object.js');
const CommandException = require('./CommandException.js');

module.exports = {
  init() {
    const objects = database.getAllObjects.all();
    this._objects = objects.reduce((acc, obj) => {
      acc.push(new RinObject(obj.name));
      return acc;
    }, []);
  },

  get(objectName) {
    const object = this._objects.find(
      (obj) =>
        obj.getName().toLowerCase() === objectName.toLowerCase() ||
        obj.getPlural().toLowerCase() === objectName.toLowerCase()
    );
    if (!object) {
      throw new CommandException('What is that?', 'rinwha.png');
    }
    return object;
  },

  isObject(objectName) {
    return this._objects.some((obj) => obj.getName() === objectName);
  },

  getAll() {
    return this._objects;
  },

  // todo for admin commands
  createObject() {},

  deleteObject() {},
};

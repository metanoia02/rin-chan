const database = require('./sql.js');
const CommandException = require('./CommandException.js');
const Entity = require('./Entity');

module.exports = {
  init() {
    this._entities = database.getEntities();
  },

  get(entityId) {
    const entity = this._entities.find((ent) => entityId == ent.id);

    if (!entity) {
      throw new CommandException('What is that?', 'rinwha.png');
    }
    return entity;
  },

  isEntity(entityId) {
    return this._entities.some((obj) => obj.id === entityId);
  },

  getAll() {
    return this._entities;
  },

  // todo for admin commands
  createEntity() {},

  deleteEntity() {},
};

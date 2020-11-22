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

  find(entityAlt) {
    const entity = this._entities.find((ent) => {
      return ent.alts.some((alt) => alt.alt.toLowerCase() == entityAlt.toLowerCase());
    });

    if (!entity) {
      throw new CommandException('What is that?', 'rinwha.png');
    }
    return entity;
  },

  getAll() {
    return this._entities;
  },

  // todo for admin commands
  createEntity() {},

  deleteEntity() {},
};

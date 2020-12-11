/* eslint-disable spellcheck/spell-checker */
const CommandException = require('./CommandException.js');

module.exports = class Entity {
  /**
   * @param {*} ent Database entity Entity
   * @param {*} alts Entity array
   * @param {*} feedable Database feedable Entity
   * @param {*} searchable Database searchable Entity
   * @param {*} tradable  Database tradable Entity
   */
  constructor(ent, alts, feedable, searchable, tradable, singable) {
    this.id = ent.id;
    this.name = ent.name;
    this.determiner = ent.determiner;
    this.plural = ent.plural;
    this.image = ent.image;

    this.alts = alts.map((ele) => {
      return {alt: ele.alt, language: ele.language};
    });

    if ((this.feedable = feedable)) {
      this.filling = feedable.filling;
    }
    if ((this.searchable = searchable)) {
      this.searchTerm = searchable.searchTerm;
    }
    if ((this.tradable = tradable)) {
      this.value = tradable.value;
    }
    if ((this.singable = singable)) {
      this.url = singable.url;
    }
  }
};

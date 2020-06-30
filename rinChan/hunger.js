module.exports = {
  hungerIcon: {
    0: './images/hunger/0.png', // Stuffed
    1: './images/hunger/1.gif', // Turbo Flap
    2: './images/hunger/2.gif', // Normal Flap
    3: './images/hunger/3.png', // NoFlap
    4: './images/hunger/4.png', // Pout
    5: './images/hunger/5.png', // Angrey
  },

  setIcon(client, hunger) {
    client.guilds.cache.first().setIcon(this.hungerIcon[hunger]);
  },

  changeHunger(client, hunger, maxHunger) {
    if (hunger < maxHunger) {
      this.setIcon(client, hunger);
      return hunger;
    } else {
      this.setIcon(client, maxHunger);
      return maxHunger;
    }
  },
};

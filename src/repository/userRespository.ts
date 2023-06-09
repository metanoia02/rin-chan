import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export const userRepository = AppDataSource.getRepository(User).extend({
  //TODO: this whole system sucks
  getLevel() {
    //return config.levels.findIndex((ele:object) => this.getXp() >= ele.xp);
  },

  changeAffection(modifier:number) {
  /* if (modifier == 0) throw new Error("Modifier was 0");
    this.setProperty(
      "affection",
      utils.clamp(0, 100, this.getAffection() + modifier)
    );*/
  },

  async addXp(addedXp:number) {
    /*
    const levelIds = config.levels.map((level) => level.role);

    if (
      this.member.roles.cache.some((role) =>
        levelIds.includes(role.id)
      )
    ) {
      if (addedXp < 0) throw new Error(`Can not remove experience.`);
      this.setProperty("xp", this.getXp() + addedXp);

      const calculatedLevelIndex = this.getLevel();

      if (
        !this.member.roles.cache.has(
          config.levels[calculatedLevelIndex].role
        )
      ) {
        const newLevel = config.levels[calculatedLevelIndex];
        await this.member.roles.remove(
          config.levels[calculatedLevelIndex + 1].role,
          "Level up"
        );
        await this.member.roles.add(newLevel.role, "Level up");

        const attachment = new Discord.MessageAttachment(
          `./images/emotes/rinverywow.png`,
          "rinverywow.png"
        );

        message.channel.send(
          new Discord.MessageEmbed()
            .setColor("#FFD700")
            .setTitle("Level up!")
            .setDescription(`You reached the rank of ${newLevel.name}.`)
            .attachFiles(attachment)
            .setThumbnail(`attachment://rinverywow.png`)
        );
      }  */
    }

    changeQuantity(anItem: Item, modifier:number) {
      /*
      if (typeof modifier != "number") throw new Error("Modifier must be number");
      if (modifier == 0) throw new Error("Modifier was 0");
      if (!entityManager.isEntity(entityId))
        throw new Error(`Invalid Entity: ${entityId}`);
  
      const inventory = database.getInventoryEntity(this._user, entityId);
      if (inventory.quantity + modifier < 0)
        throw new Error("Tried to set quantity below zero");
  
      inventory.quantity += modifier;
      database.setInventory.run(inventory);*/
    }
  
    getQuantity(itemId: string) {
      /*
      if (!entityManager.isEntity(entityId))
        throw new Error(`Invalid Entity: ${entityId}`);
  
      const inventory = database.getInventoryEntity(this._user, entityId);
      return inventory.quantity;*/
      return 1;
    }
});



  
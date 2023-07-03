import { AppDataSource } from "../data-source";
import { RinChan } from "src/entity/RinChan";
import * as schedule from "node-schedule";
import { userRepository } from "./userRespository";
import { User } from "src/entity/User";
import { clamp } from "src/util/clamp";

export const rinChanRepository = AppDataSource.getRepository(RinChan).extend({

});

/**
 * Run once an hour
 */
schedule.scheduleJob('0 * * * *', function () {
  const randomDelay = Math.floor(Math.random() * 3600000) + 1;

  setTimeout(() => {
    module.exports.setHunger(module.exports.getHunger() + 1);
  }, randomDelay);
});

/**
 * Run once a day.
 */
schedule.scheduleJob('0 0 * * *', async function () {
  // Set Random moods for RinChans
  const rinChans = await rinChanRepository.find();
  rinChans.forEach((rinChan:RinChan) => {
    const modifier = Math.floor((4 - 1) / 2);
    let newMood = Math.floor(Math.random() * 4) - modifier;
    newMood = clamp(0, 5, newMood);
  })
});

import { ICommand } from '../interfaces/ICommand';
import { Collection } from 'discord.js';

export const CommandList: Collection<string, ICommand> = new Collection();

//events
import { happybirthday } from './events/happyBirthday';
CommandList.set('happybirthday', happybirthday);

import { merrychristmas } from './events/merryChristmas';
CommandList.set(merrychristmas.data.name, merrychristmas);

//interactions
import { headpat } from './interactions/headpat';
CommandList.set('headpat', headpat);

import { hug } from './interactions/hug';
CommandList.set('hug', hug);

//items
import { feed } from './items/feed';
CommandList.set('feed', feed);

import { harvest } from './items/harvest';
CommandList.set('harvest', harvest);

import { inventory } from './items/inventory';
CommandList.set('inventory', inventory);

import { leaderboard } from './items/leaderboard';
CommandList.set('leaderboard', leaderboard);

import { showSongBook } from './items/showSongBook';
CommandList.set(showSongBook.data.name, showSongBook);

import { give } from './items/give';
CommandList.set(give.data.name, give);

import { giveEveryone } from './items/giveEveryone';
CommandList.set(giveEveryone.data.name, giveEveryone);

import { items } from './items/items';
CommandList.set(items.data.name, items);

//rinchan
import { hungry } from './rinchan/hungry';
CommandList.set(hungry.data.name, hungry);

import { predict } from './rinchan/predict';
CommandList.set(predict.data.name, predict);

import { sayhi } from './rinchan/sayHi';
CommandList.set(sayhi.data.name, sayhi);

import { thanks } from './rinchan/thanks';
CommandList.set(thanks.data.name, thanks);

import { rate } from './rinchan/rate';
CommandList.set(rate.data.name, rate);

import { howAreYou } from './rinchan/howAreYou';
CommandList.set(howAreYou.data.name, howAreYou);

import { sing } from './rinchan/sing';
CommandList.set(sing.data.name, sing);

//test
import { ping } from './test/ping';
CommandList.set('ping', ping);

import { server } from './test/server';
CommandList.set('server', server);

import { user } from './test/user';
CommandList.set('user', user);

//utility
import { currency } from './utility/currency';
CommandList.set(currency.data.name, currency);

import { serverConfig } from './admin/serverConfig';
CommandList.set(serverConfig.data.name, serverConfig);

import { temperature } from './utility/temperature';
CommandList.set(temperature.data.name, temperature);

import { safebooru } from './utility/safebooru';
CommandList.set(safebooru.data.name, safebooru);

import { level } from './utility/level';
CommandList.set(level.data.name, level);

//shopping
import { supermarket } from './shopping/supermarket';
CommandList.set(supermarket.data.name, supermarket);

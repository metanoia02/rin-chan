import { ICommand } from '../interfaces/ICommand';
import { Collection } from 'discord.js';

import { harvest } from './items/harvest';
import { inventory } from './items/inventory';
import { ping } from './test/ping';
import { server } from './test/server';
import { user } from './test/user';
import { currency } from './utility/currency';
import { serverConfig } from './admin/serverConfig';

export const CommandList: Collection<string, ICommand> = new Collection();

CommandList.set('harvest', harvest);
CommandList.set('inventory', inventory);
CommandList.set('ping', ping);
CommandList.set('server', server);
CommandList.set('user', user);
CommandList.set('currency', currency);
CommandList.set(serverConfig.data.name, serverConfig);

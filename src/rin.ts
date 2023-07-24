import tokens from './tokens.json';
import { client } from './client';

// Listeners
import interactionCreate from './listeners/interactionCreate';
import ready from './listeners/ready';

//Utils
import loadCommands from './util/loadCommands';

console.log('Rin-chan is waking up...');

loadCommands();
ready(client);
interactionCreate(client);

client.login(tokens.token);

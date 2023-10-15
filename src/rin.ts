import tokens from './tokens.json';
import { client } from './client';

// Listeners
import interactionCreate from './listeners/interactionCreate';
import ready from './listeners/ready';
import guildMemberAdd from './listeners/guildMemberAdd';
import guildMemberRemove from './listeners/guildMemberRemove';
import message from './listeners/message';

console.log('Rin-chan is waking up...');

ready(client);
message(client);
interactionCreate(client);
guildMemberAdd(client);
guildMemberRemove(client);

client.login(tokens.token);

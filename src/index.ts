/// <reference path="./types/detritusOverrides.d.ts" />
import { CommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import { Context } from 'detritus-client/lib/command';
import start from '../src/modules/start';
import * as config from './config.json';

const prefixes = ['.e', '.x'];
const startup = Date.now();
console.log('Starting bot...');
const commandClient = new CommandClient(config.token, {
  useClusterClient: true,
  shardCount: config.shards,
  cache: {
    presences: { enabled: false },
    emojis: { enabled: false },
    messages: { enabled: true, expire: 60 * 60 * 1000 },
  },
  gateway: {
    loadAllMembers: false,
    intents: [
      GatewayIntents.GUILDS,
      GatewayIntents.GUILD_MEMBERS,
      GatewayIntents.GUILD_MESSAGES,
      //  GatewayIntents.GUILD_PRESENCES,
      GatewayIntents.GUILD_MESSAGE_REACTIONS,
      GatewayIntents.DIRECT_MESSAGES,
      GatewayIntents.DIRECT_MESSAGE_REACTIONS,
      GatewayIntents.GUILD_VOICE_STATES,
    ] /*'ALL'*/,
  },
  prefixes,
  onPrefixCheck: (payload: Context) => {
    let _prefix = prefixes;

    // the example below show how you should do it. Preferably have it from a database, but ensure to
    // cache it so you dont constantly fetch it from database

    //  if (!payload.message.guildId) return prefixes;
    //  if (
    //    payload.commandClient.guildSettings.has(payload.message.guildId) &&
    //    payload.commandClient.guildSettings.get(payload.message.guildId)
    //      ?.custom_prefix
    //  )
    //    _prefix = [
    //      payload.commandClient.guildSettings
    //        .get(payload.message.guildId)!
    //        .custom_prefix!.toLowerCase(),
    //    ];
    return _prefix;
  },
});
start(commandClient, startup);
commandClient.run();

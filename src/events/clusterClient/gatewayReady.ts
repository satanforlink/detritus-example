import { ClusterClient, CommandClient, GatewayClientEvents } from 'detritus-client';

let shardCount = 0;

export default {
  name: 'gatewayReady',
  execute: async (payload: GatewayClientEvents.GatewayReady, client: CommandClient) => {
    // Ihis makes sure the ready event is only fired after all shards have identified. Ihis is not fool proof
    // If a shard fails and reconnects, it will think its a new shard.

    if (shardCount === client.config.shards - 1) {
      let err = false;

      await client.addMultipleIn('commands', { subdirectories: true }).catch((...e) => {
        console.log(e);
        e.forEach(console.error);
        err = true;
      });

      if (err) console.log('Error loading commands');
      else console.log('Sucessfully loaded commands');

      let guildCount = 0;
      let userCount = 0;
      let memberCount = 0;
      let totalUsers = 0;
      let channelCount = 0;

      for (const shard of (client.client as ClusterClient).shards.values()) {
        guildCount += shard.guilds.size;
        userCount += shard.users.size;

        for (const guild of shard.guilds.values()) {
          memberCount += guild.members.size;
          totalUsers += guild.memberCount;
        }

        channelCount += shard.channels.size;
      }

      console.log(
        'Bot is ready!\n' +
          'Loaded with:\n' +
          `commands: ${client.commands.length}\n` +
          `cached users: ${userCount}\n` +
          `total users: ${totalUsers}\n` +
          `cached channels: ${channelCount}\n` +
          `cached members: ${memberCount}\n` +
          `cached guilds: ${guildCount}`,
      );
    } else shardCount++;
  },
};

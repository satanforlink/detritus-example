import { ClusterClient, CommandClient, GatewayClientEvents } from 'detritus-client';
let shardCount = 0;

export default {
  name: 'gatewayReady',
  async execute(payload: GatewayClientEvents.GatewayReady, client: CommandClient) {
    // this makes sure the ready event is only fired after all shards have identified. this is not fool proof
    // if a shard fails and reconnects, it will think its a new shard.

    if (shardCount === client.config.shards - 1) {
      let err = false;
      await client.addMultipleIn('../src/commands', { subdirectories: true }).catch(e => {
        console.log(e);
        err = true;
      });
      if (err) console.log('Error loading commands');
      else console.log('Sucessfully loaded commands');
      let guildCount = 0,
        userCount = 0,
        memberCount = 0,
        totalUsers = 0,
        channelCount = 0;
      for (let shard of (client.client as ClusterClient).shards.values()) {
        guildCount += shard.guilds.size;
        userCount += shard.users.size;
        for (let guild of shard.guilds.values()) {
          memberCount += guild.members.size;
          totalUsers += guild.memberCount;
        }
        channelCount += shard.channels.size;
      }
      console.log(`Bot is ready!`);
      console.log(`Loaded with:
commands: ${client.commands.length}
cached users: ${userCount}
total users: ${totalUsers}
cached channels: ${channelCount}
cached members: ${memberCount}
cached guilds: ${guildCount}`);
    } else shardCount++;
  },
};

import { ClusterClient } from 'detritus-client';
let shardCount = 0;

export default {
  name: 'gatewayReady',
  async execute(client: ClusterClient, startup: number) {
    // this makes sure the ready event is only fired after all shards have identified. this is not fool proof
    // if a shard fails and reconnects, it will think its a new shard.
    if (shardCount === client.commandClient?.config.shards) {
      let err = false;
      await client.commandClient
        .addMultipleIn('../src/commands', { subdirectories: true })
        .catch((e) => {
          console.log(e);
          err = true;
        });
      if (err) console.log('Error loading commands');
      else console.log('Sucessfully loaded commands');
    } else shardCount++;
  },
};

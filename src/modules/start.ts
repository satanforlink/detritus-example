import { CommandClient } from 'detritus-client/lib/commandclient';
import * as config from '../config.json';
import fs from 'fs';

interface EventImport {
  name: 'string';
  execute(payload: any, attachment: any): void;
}

// this is just cleaning stuff out of index.
export default (client: CommandClient, startup: number) => {
  // attach anything you want here to the client. for example your database driver
  // make sure you also add the type declaration in types.ts
  // client.postgres = new Pool(client.config.databaseUser);
  client.config = config;

  //reading all events in /events folder
  const commandClientEvents = fs
    .readdirSync('./src/events/commandClient')
    .filter((file) => file.endsWith('.ts'));
  for (let file of commandClientEvents) {
    //importing events
    import(`../events/commandClient/${file}`).then((ret: EventImport) => {
      //binding the eventListeners
      client.on(ret.name, (payload) => ret.execute(payload, client));
    });
  }
  const clusterClientEvents = fs
    .readdirSync('./src/events/clusterClient')
    .filter((file) => file.endsWith('.ts'));
  for (let file of clusterClientEvents) {
    import(`../events/clusterClient/${file}`).then((ret: EventImport) => {
      client.client.on(ret.name, (payload) => ret.execute(payload, client));
    });
  }
};

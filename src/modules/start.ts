import { ClusterClient, CommandClient, GatewayClientEvents } from 'detritus-client';
import * as config from '../config.json';
import fs from 'fs';

interface EventImport {
  default: { name: 'string'; execute(payload: any, attachment: CommandClient): void };
}

// this is just cleaning stuff out of index.
export default async (client: CommandClient, startup: number) => {
  // attach anything you want here to the client. for example your database driver
  // make sure you also add the type declaration in types.ts
  // client.postgres = new Pool(client.config.databaseUser);
  client.config = config;

  //reading all events in /events folder
  const commandClientEvents = fs.readdirSync('./src/events/commandClient').filter(file => file.endsWith('.ts'));
  for (let file of commandClientEvents) {
    //importing events
    let ret: EventImport = await import(`../events/commandClient/${file}`);
    // console.log(ret);
    //binding the eventListeners
    client.on(ret.default.name, payload => ret.default.execute(payload, client));

    console.log(`Loaded event ${ret.default.name} to commandClient`);
  }

  const clusterClientEvents = fs.readdirSync('./src/events/clusterClient').filter(file => file.endsWith('.ts'));
  for (let file of clusterClientEvents) {
    let ret: EventImport = await import(`../events/clusterClient/${file}`);
    // console.log(ret);
    client.client.on(ret.default.name, payload => ret.default.execute(payload, client));
    console.log(`Loaded event ${ret.default.name} to clusterClient`);
  }
};

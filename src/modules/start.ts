import { CommandClient } from 'detritus-client';
import * as config from '../config.json';

import fs from 'fs';
import path from 'path';

interface EventImport {
  default: { name: 'string'; execute(payload: any, attachment: CommandClient): void };
}

// This is just cleaning stuff out of index.
export default async (client: CommandClient, startup: number) => {
  // Attach anything you want here to the client. For example, your database driver
  // Make sure you also add the type declaration in types.ts
  // client.postgres = new Pool(client.config.databaseUser);
  client.config = config;

  // Reading all events in /events folder
  try {
    const commandClientEvents = fs
      .readdirSync(path.resolve(__dirname, '../events/commandClient'), { withFileTypes: true })
      .filter(file => ['js', 'ts'].some(e => file.name.endsWith(e)) && !file.name.endsWith('.d.ts'));

    for (const file of commandClientEvents) {
      // Importing events
      const ret: EventImport = await import(path.resolve(__dirname, `../events/commandClient/${file.name}`));

      // Binding the eventListeners
      client.on(ret.default.name, payload => ret.default.execute(payload, client));

      console.log(`Loaded event ${ret.default.name} to commandClient`);
    }

    const clusterClientEvents = fs
      .readdirSync(path.resolve(__dirname, '../events/clusterClient'), { withFileTypes: true })
      .filter(file => ['js', 'ts'].some(e => file.name.endsWith(e)) && !file.name.endsWith('.d.ts'));

    for (const file of clusterClientEvents) {
      // Importing events
      const ret: EventImport = await import(path.resolve(__dirname, `../events/clusterClient/${file.name}`));

      // Binding the eventListeners
      client.client.on(ret.default.name, payload => ret.default.execute(payload, client));

      console.log(`Loaded event ${ret.default.name} to clusterClient`);
    }
  } catch (e) {
    console.log(e);
  }
};

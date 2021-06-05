import { Context } from 'detritus-client/lib/command';
import { ParsedArgs } from 'detritus-client/lib/command/argumentparser';
import { Permissions } from 'detritus-client/lib/constants';
import { BaseCommand } from '../commandBase';
import { CommandClient } from 'detritus-client';

export const COMMAND_NAME = 'reload';

export default class MainCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      permissionsClient: [Permissions.ADD_REACTIONS],
      permissions: [],
      metadata: {
        description: 'Reloads commands',
        examples: [COMMAND_NAME],
        type: 'admin',
        usage: `${COMMAND_NAME}`,
        adminOnly: true,
      },
    });
  }

  async run(payload: Context, __args: ParsedArgs): Promise<any> {
    const message = payload.message;
    const cc = message?.client.commandClient;
    if (!cc || !message.channel || !payload.client.commandClient) return;
    let args: string[] = __args[this.name].split(/ +/g);

    switch (args[0]) {
      case 'commands': {
        let err = false;
        try {
          payload.client.commandClient.clear();
          await payload.client.commandClient
            .addMultipleIn('../src/commands', { subdirectories: true })
            .catch((...e) => {
              console.log(e);
              err = true;
            });
          if (!err) console.log('Reloaded Commands');
        } catch (e) {
          err = true;
          console.log(e);
          payload.message.react('❎');
        }
        if (!err) return await message.react('✅');
        else return message.react('❎');
        break;
      }
      case 'events': {
        // handle event reloading here
        break;
      }
      default: {
        let err = false;
        try {
          payload.client.commandClient.clear();
          await payload.client.commandClient
            .addMultipleIn('../src/commands', { subdirectories: true })
            .catch((...e) => {
              console.log(e);
              err = true;
            });
          if (!err) console.log('Reloaded Commands');
          // await payload.client.commandClient.genshin.setCommands(payload.client.commandClient);
        } catch (e) {
          err = true;
          console.log(e);
          payload.message.react('❎');
        }

        if (!err) return await message.react('✅');
        else return message.react('❎');
      }
    }
  }
}

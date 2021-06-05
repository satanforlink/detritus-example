import { Context } from 'detritus-client/lib/command';
import { ParsedArgs } from 'detritus-client/lib/command/argumentparser';
import { Permissions } from 'detritus-client/lib/constants';
import { CommandClient } from 'detritus-client';

import { BaseCommand } from '../BaseCommand';

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
    let args: string[] = __args[this.name].split(/ +/g);

    switch (args[0]) {
      case 'events': {
        // handle event reloading here
        break;
      }
      case 'commands':
      default: {
        // Hoist the error variable
        let err = false;
        
        try {
          // Clear all of the commands
          this.commandClient.clear();

          // Readd all of the commands
          await this.commandClient
          .addMultipleIn('commands', { subdirectories: true })
          .catch((...e) => {
            e.forEach(console.error);
            err = true;
          });
          
          if (!err) console.log('Reloaded Commands');
        } catch (e) {
          err = true;
          console.error(e);
        }
        
        // React to the message
        if (!err) return await message.react('✅');
        else return await message.react('❎');
      }
    }
  }
}

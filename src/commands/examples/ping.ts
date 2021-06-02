import { Context, ParsedArgs } from 'detritus-client/lib/command';
import { Permissions } from 'detritus-client/lib/constants';
import { BaseCommand } from '../commandBase';
import { CommandClient } from 'detritus-client';

export const COMMAND_NAME = 'ping';

export default class MainCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      permissionsClient: [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
      permissions: [],
      metadata: {
        description: 'Ping Command',
        examples: [COMMAND_NAME],
        type: 'extra',
        usage: `${COMMAND_NAME}`,
      },
    });
  }

  async run(payload: Context, __args: ParsedArgs): Promise<any> {
    const message = payload.message;
    const cc = message?.client.commandClient;

    if (!message || !cc || !message.channel) return;

    //this is your array of strings, usually known as args
    let args: string[] = __args[this.name].split(/ +/g);

    // replying to the message with pong!
    // this can be done with payload.reply('pong');
    // or message.channel.createMessage('pong');

    await message.reply('Pong!');
  }
}

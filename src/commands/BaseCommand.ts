import { Command, CommandClient } from 'detritus-client';
import { Permissions } from 'detritus-client/lib/constants';
import { ParsedArgs } from 'detritus-client/lib/command';

/**
 * The command metadata
 *
 * Used for the help menu
 */
export interface CommandMetadata {
  description?: string;
  examples?: string[];
  nsfw?: boolean;
  usage?: string;
  adminOnly?: boolean;
}

export class BaseCommand<ParsedArgsFinished = Command.ParsedArgs> extends Command.Command<ParsedArgsFinished> {
  declare metadata: CommandMetadata;
  permissionsIgnoreClientOwner = true;

  constructor(commandClient: CommandClient, options: Partial<Command.CommandOptions>) {
    super(
      commandClient,
      // Assign the default options
      {
        name: '',
        ratelimits: [{ duration: 5000, limit: 5, type: 'guild' }],
        ...options,
      },
    );
  }

  get commandDescription(): string {
    if (typeof this.metadata.usage === 'string') {
      return `${this.name} ${this.metadata.usage}`.trim();
    }
    return '';
  }

  onCancelRun(context: Command.Context, args: unknown) {}

  onBeforeRun(context: Command.Context, args: ParsedArgs) {
    console.log(
      `Running ${Object.entries(args)[0].join(' | ')} | C: ${context.channelId} | U: ${context.userId} | G: ${
        context.guildId
      }`,
    );

    if (context.command?.metadata.adminOnly) {
      if (!context.commandClient.config.whitelist.includes(context.userId)) return false;
      else return true;
    }

    // Check for blacklisted/whitelisted commands
    return true;
  }

  onPermissionsFailClient(context: Command.Context, failed: bigint[]) {
    console.log({ context, failed, type: 'onPermissionsFailClient' });
  }

  onPermissionsFail(context: Command.Context, permissions: bigint[]) {
    try {
      const perms = context.guild!.me?.permissionsIn((context.message as any)?.channel)!;

      // eslint-disable-next-line no-bitwise
      if ((perms & Permissions.SEND_MESSAGES) === Permissions.SEND_MESSAGES) {
        context.channel?.createMessage(
          `Missing permissions ${permissions
            .map(perm => {
              let e = '';
              for (const [key, val] of Object.entries(Permissions)) if (perm === val) e = key;
              return e;
            })
            .flat()
            .join(' , ')
            .replace('_', ' ')}`,
        );
      }
    } catch (err) {
      context.message.author
        .createMessage(
          `Missing permissions ${permissions
            .map(perm => {
              let e = '';
              for (const [key, val] of Object.entries(Permissions)) if (perm === val) e = key;
              return e;
            })
            .flat()
            .join(' , ')
            .replace('_', ' ')}`,
        )
        .catch(() => {
          /* Voiding, nothing else can be done past this point */
        });
    }
  }

  async onSuccess(context: Command.Context, args: ParsedArgsFinished) {}

  async onRunError(context: Command.Context, args: ParsedArgsFinished, error: any) {
    console.log({ context, args, error, type: 'onRunError' });
  }

  async onTypeError(context: Command.Context, args: ParsedArgsFinished, errors: Command.ParsedErrors) {
    console.log({ context, args, errors, type: 'onTypeError' });
  }
}

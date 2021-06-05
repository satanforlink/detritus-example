import { CommandClient, GatewayClientEvents } from 'detritus-client';

export default {
  name: 'messageCreate',
  async execute(payload: GatewayClientEvents.MessageCreate, cmdClient: CommandClient) {
    const message = payload.message;
    // Do whatever you want with message here
  },
};

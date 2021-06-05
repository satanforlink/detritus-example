import { CommandClient, GatewayClientEvents } from 'detritus-client';

export default {
  name: 'messageCreate',
  execute: async (payload: GatewayClientEvents.MessageCreate, cmdClient: CommandClient) => {
    const message = payload.message;
    // Do whatever you want with message here
  },
};

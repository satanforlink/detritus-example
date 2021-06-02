import { ClusterClient, GatewayClientEvents } from 'detritus-client';

export default {
  name: 'messageCreate',
  async execute(
    payload: GatewayClientEvents.Raw,
    clusterClient: ClusterClient
  ) {
    // do whatever you want here.
  },
};

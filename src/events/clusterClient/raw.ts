import { ClusterClient, GatewayClientEvents } from 'detritus-client';

export default {
  name: 'raw',
  async execute(payload: GatewayClientEvents.Raw, clusterClient: ClusterClient) {
    // Do whatever you want here.
    // console.log(payload);
  },
};

import { ClusterClient, GatewayClientEvents } from 'detritus-client';

export default {
  name: 'raw',
  execute: async (payload: GatewayClientEvents.Raw, clusterClient: ClusterClient) => {
    // Do whatever you want here.
    // console.log(payload);
  },
}

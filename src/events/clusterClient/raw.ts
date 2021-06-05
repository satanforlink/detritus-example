import { ClusterClient, GatewayClientEvents } from 'detritus-client';

export default {
  name: 'raw',
  execuite: async (payload: GatewayClientEvents.Raw, clusterClient: ClusterClient) => {
    // Do whatever you want here.
    // console.log(payload);
  },
};

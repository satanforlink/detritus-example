export interface Settings {
  [key: string]: any;
}
//make sure to add anything here that you'll be attaching to your client
//in the example below, client.config will now not show an error.
// remember that this is ONLY DECLARATIONS, meaning this is just so you dont get errors when compiling/writing
// you still need to do client.config = something somewhere in ur code
declare module 'detritus-client/lib/commandclient' {
  interface CommandClient {
    config: Settings;
  }
}

import type { Principal } from '@dfinity/principal';
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface SrteamingCallbackToken {
  'key' : string,
  'sha256' : [] | [Array<number>],
  'index' : bigint,
  'content_encoding' : string,
}
export interface StreamingCallbackHttpResponse {
  'token' : [] | [SrteamingCallbackToken],
  'body' : Array<number>,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : SrteamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export interface _SERVICE {
  'get' : () => Promise<bigint>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'increment' : () => Promise<undefined>,
  'set' : (arg_0: bigint) => Promise<undefined>,
}

import Text "mo:base/Text";
import Nat "mo:base/Nat"
// Create a simple Counter actor.
actor Counter {
   public type Key = Text;

   public type Path = Text;

   public type ChunkId = Nat;

   public type SetAssetContentArguments = {
     key: Key;
     sha256: ?[Nat8];
     chunk_ids : [ChunkId];
     content_encoding: Text;
   };

   public type StreamingCallbackHttpResponse = {
     token : ?SrteamingCallbackToken;
     body: [Nat8];
   };
  
   public type SrteamingCallbackToken = {
     key: Text;
     sha256 : ?[Nat8];
     index : Nat;
     content_encoding : Text;
   };

   public type StreamingStrategy = {
     #Callback : {
       token :SrteamingCallbackToken;
       callback :shared query SrteamingCallbackToken -> async StreamingCallbackHttpResponse;
     };
   };

  public type HeaderField = (Text, Text);
  public type HttpRequest = {
    url: Text;
    method: Text;
    body: Blob;
    headers: [HeaderField];
  };

  type HttpResponse = {
    body: Blob;
    headers: [HeaderField];
    streaming_strategy: ?StreamingStrategy;
    status_code: Nat16;
  };

  stable var currentValue : Nat = 0;

  // Increment the counter with the increment function.
  public func increment() : async () {
    currentValue += 1;
  };

  // Read the counter value with a get function.
  public query func get() : async Nat {
    currentValue
  };

  // Write an arbitrary value with a set function.
  public func set(n: Nat) : async () {
    currentValue := n;
  };

  public shared query func http_request(request: HttpRequest): async HttpResponse{
    {
      body = Text.encodeUtf8("<html><body><h1>当前counter值为:"# Nat.toText(currentValue) # "</h1></body></html>");
      headers = [("Content-Type","text/html;charset=UTF-8")];
      streaming_strategy = null;
      status_code = 200;
    }
  }
}
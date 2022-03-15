import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
actor {
    public type Message = {
        text: Text;
        time: Time.Time;
        author: Text;
    };

    stable var authorName : Text = "mrxccc";

    public type Microblog = actor {
        follow : shared(Principal) -> async Text; // 添加关注对象
        unfollow : shared(Principal) -> async (); // 取消关注对象
        follows: shared query() -> async [Principal]; // 返回关注列表
        post: shared(otp: Text, text: Text) -> async ();// 发布新消息
        posts: shared query(since: Time.Time) -> async [Message]; // 返回所有发布的消息
        timeline: shared (since: Time.Time) -> async [Message]; // 返回所有关注对象发布的消息
        get_name: shared () -> async Text; // 获取作者名字
        set_name: shared (name : Text) -> async (); // 设置作者名字
    };

    // 关注列表
    stable var followed : List.List<Principal> = List.nil();

    // 关注过后不再关注
    public shared func follow(id: Principal) : async Text {
        let res = List.find<Principal>(followed, func (v) {Principal.toText(v) == Principal.toText(id)});
        if(res == null) {
            followed := List.push(id, followed);
            return "关注成功"
        } else {
            return "已关注，无需再关注"
        };
    };

    // 取消关注指定Principal
    public shared func unfollow(id: Principal) : async () {
        let res = List.filter<Principal>(followed, func (v) {Principal.toText(v) != Principal.toText(id)});
        followed := res
    };

    public shared query func follows(): async [Principal]{
        List.toArray(followed)
    };

    // 发布的消息
    stable var messages : List.List<Message> = List.nil();

    public shared (msg) func post(otp: Text, content: Text): async (){
        assert(otp == "123456");
        var msgObj = {
            text = content;
            time = Time.now();
            author = authorName;
        };
        messages := List.push(msgObj, messages);
    };

    public shared query func posts(since: Time.Time): async [Message]{
        var all : List.List<Message> = List.nil();
        for(msg in Iter.fromList(messages)){
            let time = msg.time;
            if(time > since){
                all := List.push(msg, all);
            } 
        };
        List.toArray<Message>(all)
    };

    public shared func timeline(since: Time.Time): async [Message]{
        var all : List.List<Message> = List.nil();
        for(id in Iter.fromList(followed)){
            let canister : Microblog = actor(Principal.toText(id));
            let msgs = await canister.posts(since);
            for(msg in Iter.fromArray(msgs)){
                 all := List.push(msg, all);
            }
        };
        List.toArray<Message>(all)
    };

    public shared query func get_name(): async Text{
        return authorName
    };

    public shared func set_name(name : Text): async (){
        authorName := name
    };

};

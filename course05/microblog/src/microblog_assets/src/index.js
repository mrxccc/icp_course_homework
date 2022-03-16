import { createActor, microblog } from "../../declarations/microblog";
import { Principal } from "@dfinity/principal";
import Moment from 'moment'

const sortDesc = (a, b) => -Number(a.time - b.time)

var followsList = [];
// 关注
async function follow(){
  let follow_button = document.getElementById("follow")
  let followError = document.getElementById("followError")
  follow_button.disabled = true
  followError.innerText = ""
  let pid = document.getElementById("followInput").value
  try{
     var msg = await microblog.follow(Principal.fromText(pid))
     alert(msg)
  } catch (err){
    console.log(err)
    followError.innerText = "follow Failed";
  }
  follow_button.disabled = false
  // 关注后需要重新加载关注列表和消息列表
  load_follows()
  timeline()
}

// 取消关注
async function unfollow(){
  let unfollow_button = document.getElementById("unfollow")
  let unfollowError = document.getElementById("unfollowError")
  unfollow_button.disabled = true
  unfollowError.innerText = ""
  let pid = document.getElementById("unfollowInput").value
  try{
     await microblog.unfollow(Principal.fromText(pid))
     alert("成功取消关注")
  } catch (err){
    console.log(err)
    unfollowError.innerText = "unfollow Failed";
  }
  unfollow_button.disabled = false
  // 关注后需要重新加载关注列表和消息列表
  load_follows()
  timeline()
}

// 获取指定author对象的消息
async function getPosts(pid, author){
  let actor = createActor(pid)
  let list =  await actor.posts(123)
  document.getElementById("authorLable").innerText = author
  var followsMsgList = list
  followsMsgList.sort(sortDesc)
  refreshTimeLineList("msgList", followsMsgList)
}

// 获取所有关注对象消息列表
async function allPost(){
  let allPost_btn = document.getElementById("allPost");
  allPost_btn.disabled = true
  await timeline()
  allPost_btn.disabled = false
}

// 获取自己发布的消息列表
async function myPost(){
  let myPost_btn = document.getElementById("myPost");
  myPost_btn.disabled = true
  let posts = await microblog.posts(123);
  var followsMsgList = posts
  followsMsgList.sort(sortDesc)
  refreshTimeLineList("myPostList", followsMsgList)
  myPost_btn.disabled = false
}

// 获取关注列表
async function load_follows(){
  let follows = await microblog.follows()
  console.log(follows)
  followsList = []
  for(var i= 0; i < follows.length; i++){
    // 实时查author
    await createActor(follows[i]).get_name()
    .then(name => {
      console.log(name)
      followsList.push({"pid": follows[i].toText(), "author": name})
    })
  }
  console.log(followsList)
  refreshFollowsList()
}

// 渲染关注列表
async function refreshFollowsList(){
  var followsListNode = document.getElementById("followsList")
  followsListNode.replaceChildren([])
  for(var i= 0; i< followsList.length;i++){
    addFollowsNode(followsList[i].pid, followsList[i].author)
  }
}

// 获取关注对象发布的消息
async function timeline(){
  let posts = await microblog.timeline(123);
  var followsMsgList = posts
  followsMsgList.sort(sortDesc)
  refreshTimeLineList("msgList", followsMsgList)
}

// 渲染消息列表: node是节点名称
function refreshTimeLineList(nodeName, followsMsgList){
  var msgListNode = document.getElementById(nodeName)
  msgListNode.replaceChildren([])
  followsMsgList.forEach(element => {
    addPostNode(element.text, element.author, element.time, nodeName)
  });
}

// 添加消息节点
function addPostNode(text, author, time, nodeName){
  var node = document.createElement("LI");
  var bulletDiv = document.createElement("DIV");
  bulletDiv.setAttribute("class", "bullet pink");
  var dateDiv = document.createElement("DIV");
  dateDiv.setAttribute("class", "date");
  var timeMillis = Math.floor(Number(time)/ 1000000)
  var stamp = new Date(timeMillis)
  var time = Moment(stamp).format('YYYY年MM年DD HH:mm:ss')
  dateDiv.innerText = time
  var descDiv = document.createElement("DIV");
  descDiv.setAttribute("class", "desc");
  var h3 = document.createElement("H3");
  h3.innerText = text;
  var h4 = document.createElement("H4");
  h4.innerText = "作者：" + author;
  descDiv.appendChild(h3);
  descDiv.appendChild(h4);
  node.appendChild(bulletDiv)
  node.appendChild(dateDiv)
  node.appendChild(descDiv)
  document.getElementById(nodeName).appendChild(node);
}

// 添加关注节点
function addFollowsNode(pid, author){
  var node = document.createElement("LI");
  var bulletDiv = document.createElement("DIV");
  bulletDiv.setAttribute("class", "bullet pink");
  var dateDiv = document.createElement("DIV");
  dateDiv.setAttribute("class", "date");
  dateDiv.innerText = pid
  var descDiv = document.createElement("DIV");
  descDiv.setAttribute("class", "desc");
  var a = document.createElement("a");
  a.setAttribute("style", "cursor: pointer;")
  a.innerText = author;
  a.onclick = function() {getPosts(pid, author)}
  descDiv.appendChild(a);
  node.appendChild(bulletDiv)
  node.appendChild(dateDiv)
  node.appendChild(descDiv)
  document.getElementById("followsList").appendChild(node);
}

//加载文章消息
function load(){
  let post_btn = document.getElementById("post");
  post_btn.onclick = post;

  let follow_btn = document.getElementById("follow");
  follow_btn.onclick = follow;

  let unfollow_btn = document.getElementById("unfollow");
  unfollow_btn.onclick = unfollow;

  let allPost_btn = document.getElementById("allPost");
  allPost_btn.onclick = allPost;

  let myPost_btn = document.getElementById("myPost");
  myPost_btn.onclick = myPost;

  setInterval(myPost, 3000);
  myPost()
  load_follows()
  timeline()
}

window.onload = load;
import { microblog,createActor } from "../../declarations/microblog";
import { Principal } from "@dfinity/principal";
import Moment from 'moment'

async function post(){
  let post_button = document.getElementById("post")
  let error = document.getElementById("error")
  post_button.disabled = true
  error.innerText = ""
  let texarea = document.getElementById("message")
  let otp = document.getElementById("otp").value
  let text = texarea.value;
  try{
     await microblog.post(otp, text)
     texarea.value = ""
  } catch (err){
    console.log(err)
    error.innerText = "Post Failed";
  }
  post_button.disabled = false
}

var num_posts = 0;
var num_follows = 0;

async function load_posts(){
  let posts_section = document.getElementById("posts");
  let posts= await microblog.posts(123);
  if(num_posts == posts.length) return;
  posts_section.replaceChildren([]);
  num_posts = posts.length;
  for(var i= 0; i< posts.length;i++){
    let post = document.createElement("p");
    post.innerText = posts[i].text + posts[i].author
    posts_section.appendChild(post)
  }
}

// 获取关注列表
async function load_follows(){
  let follows_section = document.getElementById("follows");
  let follows = await microblog.follows();
  if(num_follows == follows.length) return;
  follows_section.replaceChildren([]);
  num_follows = follows.length;
  for(var i= 0; i< follows.length;i++){
    let follow = document.createElement("p");
    let actor = createActor(follows[i])
    var author = await actor.get_name()
    console.log(author)
    follow.innerText = "Pid:  " + follows[i].toText() + "   " + "author:   " + author
    follows_section.appendChild(follow)
  }
}

// 返回关注对象发布的消息
async function timeline(){
  let posts = await microblog.timeline(123);
  if(posts.length > 0){
    posts.forEach(element => {
      addPostNode(element.text , element.author, element.time)
    });
  }
}

function addPostNode(text, author, time){
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
  document.getElementById("mylist").appendChild(node);
}

function load(){
  let post_btn = document.getElementById("post");
  post_btn.onclick = post;
  setInterval(load_posts, 3000);
  load_posts()
  load_follows()
  timeline()
}

window.onload = load;
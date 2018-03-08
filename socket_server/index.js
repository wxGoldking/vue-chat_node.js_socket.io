//express_demo.js 文件
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
//监听客服端链接

io.on("connection", function(client) {
  console.log("a service connected");
  //监听新用户加入
  client.on("login", function(obj) {
      if(obj.username==='') return;
    //将新加入用户的唯一标识当作client的名称，后面退出的时候会用到
    client.name = obj.userid;

    //检查在线列表，如果不在里面就加入
    if (!onlineUsers.hasOwnProperty(obj.userid)) {
      onlineUsers[obj.userid] = { name: obj.username, sex: obj.usersex, id: obj.userid };
      //在线人数+1
      onlineCount++;
    }

    //向所有客户端广播用户加入
    io.emit("login", {
      onlineUsers: onlineUsers,
      onlineCount: onlineCount,
      user: obj
    });
    console.log(obj.username + "加入了聊天室");
  });
  //监听客户端发来的信息
  client.on("message_service", function(msg) {
    for(k in io.sockets.sockets){
      if(io.sockets.sockets[k].name==msg.destination_id){
        io.sockets.sockets[k].emit("new_message", msg);//把客服发来的数据转发给对应客户
      }
    };
  });

  //监听客服断开链接
  client.on("disconnect", function() {
    //将退出的用户从在线列表中删除
    if (onlineUsers.hasOwnProperty(client.name)) {
      //退出用户的信息
      var obj = { userid: client.name, username: onlineUsers[client.name].name };

      //删除
      delete onlineUsers[client.name];
      //在线人数-1
      onlineCount--;
        console.log(onlineUsers);
      //向所有客户端广播用户退出
      io.emit("logout", {
        onlineUsers: onlineUsers,
        onlineCount: onlineCount,
        user: obj
      });
      console.log(obj.username + "退出了聊天室");
    }
  });
});

//开启http服务器,监听8888端口
var server = http.listen(8888, function() {
  console.log("server start");
});

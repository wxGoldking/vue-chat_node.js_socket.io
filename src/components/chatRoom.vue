<template>
  <div class='chatroom'>
    <div class="wrap">
      <div class="left">
        <h3>在线人员{{count}}</h3>
          <ul class="member">
            <li 
              v-for="item in memmbers" 
              :key="item.id" 
              :title="item.id" 
              :class="item.name==username ? 'cur' : ''"
              :style="{backgroundColor:item.id==to_userid?'orange':''}"
              @click="set_to_userid(item.id,item.name)"
              >
              <span>{{item.name}}&nbsp;</span>
              <span>{{item.sex}}&nbsp;</span>
            </li>
          </ul>
      </div>
      <div class="right">
        <div class="messages">
          <div class="content">
            <h3>聊天信息({{to_username}})</h3>
            <ul v-if="to_userid" id='xiaoxi'>
              <li
                v-for="(item,index) in curmessages"
                :key="index"
                :class="item.username==username ? 'local' : ''"
              >
              <p>{{item.username}}&nbsp;{{item.time}}</p>
              <p>{{item.content}}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="shuru">
          <textarea v-model="cur_message" @keyup.enter="send"></textarea>
        </div>
        <div class="butt">
          <button @click="clear">清空</button>
          <button @click="send">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
export default {
  data() {
    return {
      cur_message: "",
      userid: new Date().getTime() + "" + Math.floor(Math.random() * 1000),
      username: this.$store.state.chatroom.cur_nickname,
      usersex: this.$store.state.chatroom.cur_sex,
      messages: {},
      curmessages: [],
      memmbers: [],
      count: 1,
      to_userid: "",
      to_username: ""
    };
  },
  methods: {
    set_to_userid(id, name) {
      if (id == this.userid) return;
      this.to_userid = id;
      this.curmessages = this.messages[id];
      this.to_username = name;
    },
    getTime(t) {
      var _time = new Date(t);
      var year = _time.getFullYear();
      var month = _time.getMonth() + 1;
      var date = _time.getDate();
      var hour = _time.getHours();
      var minute = _time.getMinutes();
      var second = _time.getSeconds();
      hour = hour.length == 1 ? "0" + hour : hour;
      minute = minute.length == 1 ? "0" + minute : minute;
      second = second.length == 1 ? "0" + second : second;
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    clear() {
      this.cur_message = "";
    },
    send() {
      if (this.to_userid === "") return;
      if (this.cur_message.trim() !="") {
        var obj = {
          userid: this.userid,
          username: this.username,
          destination_id: this.to_userid,
          to_username: this.to_username,
          content: this.cur_message,
          time: this.getTime(new Date())
        };
        this.socket.emit("message_service", obj);
        if (!this.messages.hasOwnProperty(obj.destination_id)) {
          this.messages[obj.destination_id] = [];
        }
        this.messages[obj.destination_id].push(obj);
        this.curmessages = this.messages[obj.destination_id];
        this.clear();
      }
    }
  },
  created() {
    if (this.username === "") {
      router.push({ name: "login" });
    }
  },
  mounted() {
    this.socket = io.connect("ws://localhost:8888");

    //告诉服务器端有用户登录
    this.socket.emit("login", {
      userid: this.userid,
      username: this.username,
      usersex: this.usersex
    });
    //监听新用户登录
    let _this = this;
    this.socket.on("login", function(o) {
      let temp = [];
      for (const key in o.onlineUsers) {
        temp.push(o.onlineUsers[key]);
      }
      _this.memmbers = temp;
      _this.count = o.onlineCount;
    });
    this.socket.on("logout", function(o) {
      let temp = [];
      for (const key in o.onlineUsers) {
        temp.push(o.onlineUsers[key]);
      }
      _this.memmbers = temp;
      _this.count = o.onlineCount;
    });
    this.socket.on("new_message", function(o) {
      if (!_this.messages.hasOwnProperty(o.userid)) {
        _this.messages[o.userid] = [];
      }
      _this.messages[o.userid].push(o);
    });
  },
  updated: function(){
    if(document.getElementById('xiaoxi')){
      document.getElementById('xiaoxi').scrollTop = document.getElementById('xiaoxi').scrollHeight;
    }
  }
};
</script>

<style scoped>
.chatroom {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #222;
}
.chatroom .wrap {
  position: absolute;
  width: 800px;
  height: 700px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto auto;
  border: 1px solid #eee;
}
.chatroom .wrap .left {
  float: left;
  width: 27%;
  height: 100%;
  background-color: skyblue;
}
.chatroom .wrap .left .member li {
  text-align: left;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
}
.chatroom .wrap .left .member li.cur {
  color: red;
}
.chatroom .wrap .right {
  position: relative;
  float: right;
  width: 73%;
  height: 100%;
  background-color: #fff;
}
.chatroom .wrap .right .messages {
  position: relative;
  width: 100%;
  height: 75%;
  background-color: burlywood;
}
.chatroom .wrap .right .messages .content {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 50px 0px 20px 20px;
}
.chatroom .wrap .right .messages .content h3 {
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color:yellowgreen;
}
.chatroom .wrap .right .messages .content ul {
  box-sizing: border-box;
  padding-right:20px;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.chatroom .wrap .right .messages li {
  text-align: left;
  margin-bottom:5px;
}
.chatroom .wrap .right .messages li.local {
  text-align: right;
}
.chatroom .wrap .shuru {
  width: 100%;
  height: 20%;
}
.chatroom .wrap textarea {
  box-sizing: border-box;
  padding: 20px;
  resize: none;
  width: 100%;
  height: 100%;
  border: none;
}
.chatroom .wrap .right .butt {
  width: 100%;
  height: 5%;
  text-align: right;
  background: #ccc;
}
.chatroom .wrap .right .butt button {
  width: 70px;
  margin: 10px;
}
</style>
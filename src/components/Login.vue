<template>
  <div class='login'>
    <div class="info">
      昵称:<input type="text" class='nickname' v-model="nickname">
      <br>
      性别：
      <label><input type="radio" name='sex' value='male' v-model="sex">男</label>
      &nbsp;
      <label><input type="radio" name='sex' value='female' v-model="sex">女</label>
      <br>
      <button @click="enter">登录</button>
    </div> 
  </div>
</template>

<script>
import router from '../router';
export default {
  data() {
    return {
      nickname:this.$store.state.chatroom.cur_nickname,
      sex:this.$store.state.chatroom.cur_sex
    }
  },
  methods:{
    enter(){
      if(this.nickname==='') return;
      this.changenick();
      this.changesex();
      router.push({name:'room'})
    },
    changenick(){
      this.$store.commit({type:'changenick', data:this.nickname})
    },
    changesex(){
      this.$store.commit({type:'changesex', data:this.sex})
    }
  }
}
</script>

<style scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #333;
  color: #eee;
  font-weight: bold;
}
.login .info{
  box-sizing: border-box;
  font-size:18px;
  width: 350px;
  height: 200px;
  position: relative;
  top:50%;
  left:50%;
  margin-left:-175px;
  margin-top:-125px;
  background-color:darkorange;
  border-radius:10px;
  text-align: left;
  padding:50px 50px;
}
.login .info .nickname{
  height: 20px;
  margin-bottom:20px;
  border-radius:3px;
}
.login .info button{
  width: 50px;
  height: 30px;
  margin-top:20px;
}
</style>

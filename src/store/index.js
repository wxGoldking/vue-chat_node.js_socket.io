import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    chatroom: {
      cur_nickname: "",
      cur_sex: "male"
    }
  },
  mutations: {
    changenick(state, { data }) {
      state.chatroom.cur_nickname = data;
    },
    changesex(state, { data }) {
      state.chatroom.cur_sex = data;
    }
  },
  plugins: [createLogger()]
});

export default store;

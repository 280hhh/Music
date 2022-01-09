import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    src:null,
    musicList:[]
  },
  mutations: {
    getMusic(state){
      // console.log("!!")
      // var music=localStorage.getItem("musicList")
      // if(music==null||music==''){
      //   return;
      // }

      // state.musicList=JSON.parse(music)
      // console.log(state.musicList)
    }
  },
  actions: {
    
  },
  modules: {
  }
})

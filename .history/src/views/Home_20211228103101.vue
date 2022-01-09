<template>
    <div class="home">
      <el-menu default-active="1" class="el-menu-demo" mode="horizontal" background-color="#242424" text-color="#fff" align="center" active-text-color="white">
        <el-menu-item index="1" @click="$router.push({name: 'FindMusic'})">发现音乐</el-menu-item>
          <el-submenu index="2">
            <template slot="title">我的音乐库</template>
            <el-menu-item index="2-2" @click="$router.push({name: 'UpLoad'})">上传音乐</el-menu-item>
            <el-menu-item index="2-3" @click="$router.push({name: 'MyLove'})">我的喜欢</el-menu-item>
          </el-submenu>
        <el-menu-item active-text-color="white" index="3" v-if="!use"  @click="login()">
          <a style="color:white">登录</a>
        </el-menu-item>
        <el-menu-item active-text-color="white" index="5"  @click="exit" v-else>
          <a style="color:white">退出</a>
        </el-menu-item>
        <el-menu-item active-text-color="white" index="4">
          <el-autocomplete size="mini" v-model="state"
          :fetch-suggestions="querySearchAsync" placeholder="请输入内容"
          @select="handleSelect">
            <template slot-scope="{ item }">
              <div class="name">{{ item.musicname }}</div>
            </template>
          </el-autocomplete>
        </el-menu-item>
      </el-menu>
      <div class="hover1" v-show="!drawer" @mouseenter="drawer=!drawer"></div>
      <router-view ref="rou"></router-view>
        <el-drawer id="mydrawer" :visible.sync="drawer" direction="btt" :modal="false" @mouseleave="out()"
          manual="false" :size="size">
            <template>
              <div style="width: 80%;margin:0px;position:relative;"></div>
                <div  v-if="$store.state.src != null" >
                  <audio id="audio1" controls autoplay style="width: 80%;position:absolute;bottom:35%;right:10%" :src="$store.state.src">
                  </audio> 
                  <span style="position:absolute;bottom:10%;right:15%" v-if="$store.state.musicList.length!=0&&kind==1">待播：{{$store.state.musicList.length-1}}</span> 
                    <el-tooltip style="position:absolute;bottom:38%;right:6%"  class="item" effect="dark" content="按列表播放" placement="right" v-if="kind==1">
                      <el-button icon="el-icon-refresh-right"  @click="kind1()" circle></el-button>
                    </el-tooltip>
                    <el-tooltip style="position:absolute;bottom:38%;right:6%"  class="item" effect="dark" content="单曲循环" placement="right" v-if="kind==2">
                      <el-button   icon="el-icon-refresh" @click="kind2()" circle></el-button>
                    </el-tooltip>
                    <el-tooltip style="position:absolute;bottom:38%;right:6%"  class="item" effect="dark" content="播完暂停" placement="right" v-if="kind==3">
                      <el-button   icon="el-icon-arrow-down" @click="kind3()" circle></el-button>
                    </el-tooltip>
                  </span>
              </div>
              <span v-if="$store.state.musicList.length!=0" style="position:absolute;bottom:10%;right:45%">目前播放歌曲：{{$store.state.musicList[$store.state.musicList.length-1].musicname}}</span> 
              <div style="margin-top:40px;" v-else>当前暂无音乐播放</div>
            </template>
        </el-drawer>
        <login ref="login"></login>
</div>
</template>

<script>
import login from "./Login.vue"

export default {
  data() {
      return {
        photos:[],
        size:'25%',
        kind:1,
        state: '',
        drawer: false,
        use:false,
        username:''
      }
  },
  methods: {
    //移开抽屉时关闭抽屉
    out(){
      this.drawer=!this.drawer
    },
    //输入关键词，查询音乐
    handleSelect(item) {
      this.state=item.musicname
      console.log(this.$route.path)
      if(!this.$router=='/home/findMusic')this.$router.push({name: 'FindMusic'})
      this.$refs.rou.getMusic()
    },
    //弹出登陆窗口
    login(){
      this.$refs.login.toggle();
    },
    //退出账户
    exit(){
      document.cookie='cookie'+'='+''
      this.use=false
     this.$message({
          message: '已退出',
          type: 'success'
        });
    },
    //模糊查询音乐
    querySearchAsync(queryString, cb) {
      var _this=this
        axios({
            url:'http://localhost:8080/Music/findServlet',
            method:'get',
            params:{findText:_this.state,pageSize:10,currentPage:1},
        }) .then(function(res){
            // alert(JSON.stringify(res.data))
            console.log(res.data)
            clearTimeout(_this.timeout);
      _this.timeout = setTimeout(() => {
        cb(res.data.Array);
      }, 1000 * Math.random());
            })
    },
    //按列表播放音乐
    kind1(){
      this.kind=3
      console.log(document.getElementById("audio1"))
      var _this=this
      if(document.getElementById("audio1")!=null){
        document.getElementById("audio1").addEventListener('ended',function(){
        console.log("???")
        document.getElementById("audio1").pause();
        document.getElementById("audio1").src = require("@/assets/music/"+_this.$store.state.musicList[_this.$store.state.musicList.length-2].path);
        document.getElementById("audio1").load();
        document.getElementById("audio1").play();
      _this.$store.state.musicList=_this.$store.state.musicList.splice(_this.$store.state.musicList.length)
      },false);
    }
  },
    //播完暂停
    kind2(){
      this.kind=1
      document.getElementById("audio1").loop=false
      console.log(document.getElementById("audio1").loop)
    },
    //单曲循环
    kind3(){
      this.kind=2
      document.getElementById("audio1").loop=true
    },
    //打开抽屉
    up(){
      console.log(document.getElementById("mydrawer"))
      document.getElementById("mydrawer").size="100%"
    },
    //轮播图
    photo(){
      for(var i=1;i<5;i++){
        console.log(i)
        var a={src:require('@/assets/photo/'+i+".jpg")}
        this.photos.push(a)
      }
    },
  },
components: {login:login,},
mounted(){
  this.kind1()
  this.photo()
  this.$router.push({name: 'FindMusic'})
  var fin=document.cookie.match("cookie")
  if(document.cookie.match("cookie")==null||document.cookie.match("cookie").input=="cookie="){
    this.use=false
  }
  else{
    this.use=true
  }
}
}
</script>

<style scoped>
.hover1{
  position: fixed;
  height:5px;
  bottom: 0px;
  width: 100%;
  background-color:#545c64
}
.home{
  min-height: 1000px;
  position: relative;
  background-color: #f5f5f5;
}
.lunbo{
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
  margin-bottom: 40px;
  width: 1500px;
}
.small img{
  max-width: 100%;
	max-height: 100%;
}
/deep/.el-drawer .el-drawer__body{
  background:#242424;
}
</style>
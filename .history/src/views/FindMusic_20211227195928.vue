<template>
<div class="FindMusic">
  <center>
      <div class="lunbo">
        <el-carousel :interval="5000" arrow="always" type="card" height="295px">
          <el-carousel-item v-for="(item,index) in photos" :key="index">
            <h3 class="small"><img :src="item.src" id="img"></h3>
          </el-carousel-item>
        </el-carousel>
      </div>
  <el-link class="size"type="primary" @click="musicKind='1';getMusic()">华语</el-link>
  <el-link class="size" type="success" @click="musicKind='2';getMusic()">说唱</el-link>
  <el-link class="size" type="warning" @click="musicKind='3';getMusic()">流行</el-link>
  <el-link class="size" type="danger" @click="musicKind='4';getMusic()">民谣</el-link>
    <el-table
    :data="tableData"
    border
    style="width: 80%;background-image: linear-gradient(120deg,#3498db,#8e44ad);">
    <el-table-column v-for="item in tableHead"
    align="center"
      :prop="item.props"
      :label="item.describe">
    </el-table-column>
     <el-table-column
      fixed="right"
      label="我喜欢"
      width="200">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">播放</el-button>
        <el-button @click="downLoad(scope.row)" type="text" size="small">下载</el-button>
        <span>
          <el-button type="text" v-show="scope.row.love" @click="love(scope.row)" ><img src="@/assets/喜欢.png" style="width:30px;height:30px"></el-button>
          <el-button type="text" v-show="!scope.row.love" @click="love(scope.row)" ><img src="@/assets/未喜欢.png" style="width:30px;height:30px"></el-button>
        </span>
      </template>
    </el-table-column>
  </el-table>

        <div class="block" style="backgroundColor:white;width:80%">
          <br/>
    <el-pagination  style="backgroundColor:white"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="page.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
     </div>
       </center>
</div>
</template>

<script>
export default {
  data() {
      return {
        photos:[],
    tableHead:[
        {
            describe:'歌曲名',
            props:'musicname'
        }, 
        {
            describe:'演唱者',
            props:'singer'
        },
        {
            describe:'发表时间',
            props:'time'
        },
        {
            describe:'发表人',
            props:'username'
        },
    ],
    tableData:[
    ],
    musicKind:'',
    page:{
      currentPage:1,
      total:10,
      pagesize:3
    },
      }
  },
    methods: {
      downLoad(row){
        console.log(row.musicId)
 axios({
              url:'http://localhost:8080/Music/DownLoad',
              method:'get',
              params:{'id':row.musicId},
              responseType: 'blob'
          }) .then(function(res){
            console.log(res.data.data)
              if (!res.data) { this.$Message.error('下载内容为空');  return; }
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', row.musicname+'.mp3')
        document.body.appendChild(link)
        link.click()
        //释放URL对象所占资源
        window.URL.revokeObjectURL(url)
        //用完即删
        document.body.removeChild(link)
             })
      },
        getMusic(){
          if(document.cookie.match("cookie")==null||document.cookie.match("cookie").input=="cookie="){
            var username=''
          }else{
            var username=document.cookie.match("cookie").input.replace("cookie=",'')
          }
            var _this=this
            var state=this.$parent.state
            console.log(this.page)
            axios({
              url:'http://localhost:8080/Music/findServlet',
              method:'get',
              params:{findText:state,pageSize:_this.page.pagesize,currentPage:_this.page.currentPage,musicKind:this.musicKind,username:username},
          }) .then(function(res){
              console.log(res.data)
            _this.page.total=res.data.total
            var love=res.data.love.map(function(el){
              return el.musicId
            })
            _this.tableData=res.data.Array.map(function(el){
              if(love.indexOf(el.musicId)!=-1)el.love=true
              return el
            })
             })
             console.log(_this.tableData)
        },
        handleClick(row){
            console.log(row.path)
            this.$store.state.musicList.push(row)
             this.$store.state.src=require("@/assets/music/"+row.path)
             console.log(this.$store.state.src)
            //this.$parent.freshMusic()
            this.$parent.kind1()
            
        },
        handleSizeChange(val) {
        this.page.pagesize=val
        console.log(val)
        this.getMusic()
      },
      handleCurrentChange(val) {
        console.log(val)
        this.page.currentPage=val
        this.getMusic()
      },
      photo(){
        for(var i=1;i<5;i++){
          console.log(i)
          var a={src:require('@/assets/photo/'+i+".jpg")}
          this.photos.push(a)
        }
      },
      love(row){
          if(document.cookie.match("cookie")==null||document.cookie.match("cookie").input=="cookie="){
            var username=''
          }else{
            var username=document.cookie.match("cookie").input.replace("cookie=",'')
          }
          var _this=this
         axios({
              url:'http://localhost:8080/Music/LoveServlet',
              method:'get',
              params:{username:username,musicId:row.musicId},
          }) .then(function(res){
              console.log(res.data)
                if(res.data.message=='error'){
                _this.$message({
                    message: '请登录后再进行操作',
                    type: 'error'
                });
             }else{
               row.love=!row.love
                _this.$message({
                    message: res.data.data,
                    type: 'success'
                });
             }
             })
      }
    },
    computed:{
    },
  components: {
  },
  mounted(){
      if(this.$store.state!=null)this.getMusic()
      this.photo()
      this.$parent
  }
}
</script>

<style scoped>
.hover1{
  position: fixed;
  height:20px;
  bottom: 0px;
  width: 100%;
  background-color:#242424
}
.home{
  min-height: 900px;
  position: relative;
}
.lunbo{
  margin-left: auto;
  margin-right: auto;
  margin-top: 140px;
  margin-bottom: 40px;
  width: 1500px;
}
.FindMusic{
 min-height: 500px;
 margin-top:20px;
}
.small img{
  max-width: 100%;
	max-height: 100%;
}
.el-table{
    background-image: linear-gradient(120deg,#3498db,#8e44ad);
}
.table-wrapper /deep/ .el-table--fit{
        padding: 20px;
}
.table-wrapper /deep/  .el-table, .el-table__expanded-cell {
    background-color: transparent;
}
.table-wrapper /deep/ .el-table tr {
    background-color: transparent!important;
}
.table-wrapper /deep/  .el-table--enable-row-transition .el-table__body td, .el-table .cell{
    background-color: transparent;
}
.el-carousel__item h3 {
  color: white;
  font-size: 14px;
  opacity: 1;
  line-height: 300px;
  margin: 0;
  text-align: center;
}
  
.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}
  
.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
.size{
    font-size: 20px;
    margin: 20px;
}
</style>
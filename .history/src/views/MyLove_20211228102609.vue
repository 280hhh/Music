<template>
<div class="FindMusic">
  <center>
    <el-link class="size"type="primary" @click="musicKind='1';getMusic()">华语</el-link>
    <el-link class="size" type="success" @click="musicKind='2';getMusic()">说唱</el-link>
    <el-link class="size" type="warning" @click="musicKind='3';getMusic()">流行</el-link>
    <el-link class="size" type="danger" @click="musicKind='4';getMusic()">民谣</el-link>
    <el-table
    :data="tableData"
    border
    style="width: 80%;">
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
            <el-button class="el-icon-video-play" @click="handleClick(scope.row)" size="small" circle></el-button>
            <el-button class="el-icon-download" @click="downLoad(scope.row)" size="small" circle></el-button>
            <span>
              <el-button class="el-icon-star-on" v-show="scope.row.love" @click="love(scope.row)" size="small" circle style="margin-left:10px;"></el-button>
              <el-button class="el-icon-star-off" v-show="!scope.row.love" @click="love(scope.row)" size="small" circle></el-button>
            </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="backgroundColor:white;width:80%"><br/>
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
            describe:'上传时间',
            props:'time'
        },
        {
            describe:'上传人',
            props:'username'
        },
    ],
    tableData:[],
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
        axios({
              url:'http://localhost:8080/Music/DownLoad',
              method:'get',
              params:{'id':row.musicId},
              responseType: 'blob'
          }) .then(function(res){
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
              var total=0
              _this.page.total=res.data.total
              var love1=res.data.love.map(function(el){
              return el.musicId
          })
              _this.tableData.splice(0,_this.tableData.length)
              for(var el in res.data.Array){
                  // console.log(res.data.Array[el].musicId)
                  if(love1.indexOf(res.data.Array[el].musicId)!=-1){
                  res.data.Array[el].love=true
                      total++;
                  _this.tableData.push(res.data.Array[el])
                  }
              }
              _this.page.total=total
            })
      },
      handleClick(row){
        this.$store.state.musicList.push(row)
        this.$store.state.src=require("@/assets/music/"+row.path)
        this.$parent.kind1()
      },
      handleSizeChange(val) {
        this.page.pagesize=val
        this.getMusic()
      },
      handleCurrentChange(val) {
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
         axios({
              url:'http://localhost:8080/Music/LoveServlet',
              method:'get',
              params:{username:username,musicId:row.musicId},
          }) .then(function(res){
              console.log(res.data)
              row.love=!row.love
             })
      }
    },
computed:{},
components: {},
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
  background-color:#545c64
}
.home{
  min-height: 900px;
  position: relative;
}
.FindMusic{
 min-height: 500px;
 margin-top:20px;
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
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
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
.el-table{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.block{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>
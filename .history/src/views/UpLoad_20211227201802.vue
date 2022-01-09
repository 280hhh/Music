<template>
  <div class="UpLoad">
    <el-upload
  class="upload-demo"
  drag
  :auto-upload="false"
  ref="upload"
  action="http://localhost:8080/Music/UpLoad"
  :file-list="list"
  :before-upload="beforeUpload"
  :data="{'musicname':form.musicname,'singer':form.singer,'username':username}"
  :on-success="onSuccess"
  >
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传mp3文件，且不超过10mb</div>
   
</el-upload>
<br/><br/><br/>
  <el-form ref="form" :model="form" label-width="80px" :inline="true" :rules="FormRules">
  <el-form-item label='歌曲标题' style="color: white;" prop="musicname">
    <el-input v-model="form.musicname"></el-input>
  </el-form-item>
  <el-form-item label='歌手' prop="singer">
    <el-input v-model="form.singer"></el-input>
  </el-form-item>
</el-form>
<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>

  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  data(){
    return{
    form:{
      musicname:'',
      singer:'',
    },
    username:'',
    list:[],
    FormRules:{
      musicname: [
        { required: true, message: '请输入歌曲标题', trigger: 'blur' },
        { min: 1, message: '长度在1个字符以上', trigger: 'blur' }
      ],
      singer: [
        { required: true, message: '请输入歌曲标题', trigger: 'blur' },
        { min: 1, message: '长度在1个字符以上', trigger: 'blur' }
      ],
    }
  }
  },
  methods:{
    onSuccess(){
      this.$message({
          message: '上传成功',
          type: 'success'
        });
    },
    beforeUpload(){
              if(document.cookie.match("cookie")==null||document.cookie.match("cookie").input=="cookie="){
            this.$message({
              message: '登录后才能发表作品哦！',
          });
                return ;
    }
        this.username=document.cookie.match("cookie").input.replace("cookie=",'')
    },
      submitUpload() {
        if(document.cookie.match("cookie")==null||document.cookie.match("cookie").input=="cookie="){
            this.$message({
              message: '登录后才能发表作品哦！',
          });
                return ;
    }
        this.username=document.cookie.match("cookie").input.replace("cookie=",'')
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$refs.upload.submit();
          } else {
            this.$message({
                    message: '请将信息填写完全后再进行提交',
                });
            return false;
          }
        });
      },
  },
  mounted(){
    if(document.cookie.match("cookie")==null||document.cookie.match("cookie").input=="cookie="){
        this.$message({
          message: '登录后才能发表作品哦！',
      });
            return ;
}
    this.username=document.cookie.match("cookie").input.replace("cookie=",'')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.UpLoad{
  margin-top: 8%;
}
.el-upload__tip{
  color: #242424;
  font-size:20px;
}
.el-form-item__label{
  color: #242424;
}
</style>

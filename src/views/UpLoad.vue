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
          :data="{'musicname':form.musicname,'singer':form.singer,'username':username,'kind':form.kind}"
          :on-success="onSuccess"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传mp3文件，且不超过10mb</div>
      </el-upload>
      <br/><br/><br/>
      <el-form ref="form" :model="form" label-width="100px" :inline="true" :rules="FormRules">
        <el-form-item label='歌曲标题'  prop="musicname">
          <el-input v-model="form.musicname"></el-input>
        </el-form-item>
        <el-form-item label='歌手' prop="singer">
          <el-input v-model="form.singer"></el-input>
        </el-form-item>
        <el-form-item label="歌曲类型">
          <el-select v-model="form.kind" placeholder="请选择类型">
            <el-option label="华语" value="1"></el-option>
            <el-option label="说唱" value="2"></el-option>
            <el-option label="流行" value="3"></el-option>
            <el-option label="民谣" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button style="margin-left: 10px;" type="primary" @click="submitUpload" round>上传到服务器</el-button>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  data(){
    return{
    form:{
      musicname:'',
      singer:'',
      kind:''
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
          message: '登录后才能上传歌曲哦！',
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
  font-size:18px;
}
.el-form-item__label{
  color: #242424;
  font-size:18px;
}
</style>

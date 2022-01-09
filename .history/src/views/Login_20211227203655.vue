<template>
    <el-dialog
    :visible.sync="dialogVisible"
    width="25%">
    <div style="height:350px">
            <div class="userphoto"><img src="../assets/头像.jpg"></div>
            <!--表单部分-->
            <div class="form">
            <el-form ref="loginFormRef" :model="loginForm" label-width="80px" :rules="loginFormRules" >
            <el-form-item prop="username">
                <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input placeholder="请输入密码" prefix-icon="el-icon-edit" v-model="loginForm.password" show-password></el-input>
            </el-form-item>
                <div class="go"><router-link to='/register'><el-link>点击注册</el-link></router-link></div>
            <el-form-item style="clear:both">
            <el-button type="primary" @click="login()" round>登陆</el-button>
            </el-form-item>
            </el-form>
            </div>
    </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
      return {
          dialogVisible:false,
          //登陆信息
        loginForm: {
          username: '',
          password:'',
        },
        //登陆信息的规则
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 5, message: '长度在 5 个字符以上', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, message: '长度在 5 个字符以上', trigger: 'blur' }
          ],
          usergroup:[]
      }}},
        methods:{
            toggle(){
                this.dialogVisible=!this.dialogVisible
            },
          //点击登陆
            login(){
                let flag=0;
                var _this=this;
                this.$refs.loginFormRef.validate(valid =>{
                    if(!valid) {
                        this.$message({showClose: true,message: '请输入正确的账号密码',type: 'error'});
                        return;
                        }
                        flag=1;
                    })
                if(flag){
                    axios({
              url:'http://localhost:8080/Music/loginServlet',
              method:'post',
              params:{username:_this.loginForm.username,password:_this.loginForm.password},
          }) .then(function(res){
             // alert(JSON.stringify(res.data))
             if(res.data.message=='success'){
                _this.$message({
                    message: '登录成功',
                    type: 'success'
                });
                console.log(res.data)
                _this.$parent.use=true
                 document.cookie = 'cookie' + "=" + res.data.user.username ;
                _this.dialogVisible=false
             }
             else{
                _this.$message({
                    message: '账号或密码有误',
                    type: 'error'
                });
             }

          })//.catch(function(err){alert(err)})
      
            }
          },
          //点击注册
          register(){
              this.$router.push({ path:'/home'}); 
          },

      },
      mounted(){
      }
}
</script>

<style scoped>
.body{
    width: 100%;
    min-height: 900px;
    background-image: linear-gradient(120deg,#3498db,#8e44ad);
    position: relative;
}
.main{
    width: 370px;
    height: 500px;
    background-color: rgba(238,238,238,0.2);
    margin: auto;
    margin-top: 6%;
    left: 38%;
    position: absolute;
    border-radius: 20px;
    box-shadow: 0px 0px 3px #eee;
}
.userphoto{
    width: 100px;
    height: 100px;
    background-color: white;
    border-radius: 50%;
    padding: 1px;
    box-shadow: 0px 0px 4px rgb(104, 103, 103);
    margin: auto;
    margin-bottom: 1%;
    position: absolute;
    top:15%;
    left: 36%;

}
.userphoto  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}
.form{
    position:absolute;
    top:50% ;
    left: 10%;
    margin: auto;
    padding: 0px;
}
.go{
    margin: 0px;
    padding: 0px;
    text-align: right;
}
.go{
    color: black;
}
.main:hover{
    box-shadow: 0px 0px 10px #eee;
}
</style>
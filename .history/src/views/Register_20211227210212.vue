<template>
               <div style="height:450px;">
                    <h1>注册</h1>
                    <el-form ref="registerFormRef" :model="registerForm" label-width="80px" :rules="registerRules">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="registerForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="registerForm.password" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPassword">
                            <el-input v-model="registerForm.checkPassword" show-password></el-input>
                        </el-form-item>
                        <el-form>
                        <div class="submit">
                            <el-button type="primary" @click="resetForm()">重置</el-button>
                            <el-button type="primary" @click="onSubmit()">注册</el-button>
                            <el-button type="primary" @click="$router.push({name: 'Home'})">返回</el-button>
                        </div>
                        </el-form>
                    </el-form>
               </div>
</template>
<script>
export default {
    data(){
        //设置旧密码与新密码不允许一致
        let validateNewPassword = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                callback(new Error('与新密码不一致!'))
            } else {
                callback()
            }
        }
        //设置用户名不允许重复
        let noRepeat1 = (rule, value, callback) => {
            if(!window.localStorage) {callback();return ;}
            if(localStorage.userGroup==null) {callback();return ;}
            let flag=0;
            for(var item in this.userGroup){
                if(value == this.userGroup[item].username){callback(new Error('该用户名已经存在'));return ;}
            }
            callback();
        }
        return{
            dialogVisible:false,
            //注册信息
            registerForm:{
                username:'',
                password:'',
                checkPassword:'',
            },
            //注册的信息必须符合的规则
            registerRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, message: '长度在 5 个字符以上', trigger: 'blur' },
                    { pattern:'^[^ ]+$', message: '用户名不允许存在空格', trigger: 'blur' },
                    { validator:noRepeat1, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请设置密码', trigger: 'blur' },
                    { min: 5, message: '要求密码长度在 5 个字符以上', trigger: 'blur' },
                    { pattern:'^[^ ]+$', message: '密码不允许存在空格', trigger: 'blur' },
                ],
                 checkPassword: [
                    { required: true, message: '请确认密码', trigger: 'blur' },
                    { validator: validateNewPassword, trigger: 'blur' },
                    { min: 5, message: '要求密码长度在 5 个字符以上', trigger: 'blur' }
                 ],
            },
            //用户组
            userGroup:[
                
            ],
            //超级用户
            superUser:{
                username:'admin',
                password:'12345',
                checkPassword:'',
            },            
        }
    },
    methods:{
        toggle(){
                this.dialogVisible=!this.dialogVisible
        },
        //点击注册时
        onSubmit(){
            let flag=0;//若预验证成功则返回1，若失败返回0
            this.$refs.registerFormRef.validate( valid =>{
                if(!valid) {
                    this.$message({showClose: true,message: '请输入正确的信息',type: 'error'
                    });
                    return false;
                }
                flag=1;//预验证成功！
                })
            if(flag){
                var _this=this
                axios({
              url:'http://localhost:8080/Music/registerServlet',
              method:'post',
              params:{username:_this.registerForm.username,password:_this.registerForm.password},
          }) .then(function(res){
             // alert(JSON.stringify(res.data))
             //console.log(JSON.stringify(res.data))
             if(res.data=='success'){
              //   _this.$router.push({name: 'Login'})
                _this.$message({
                    message: '注册成功',
                    type: 'success'
                });
            this.$router.push("/home");
             }
             else if(res.data=='error1'){
                 _this.$message({
                    message: '已存在该账号',
                    type: 'success'
                });
             }
             })
                
            }else{
                this.$message({showClose: true,message: '注册失败！请输入按要求填写注册信息！',type: 'error'});
            
            }

          },
        //点击重置
        resetForm(){
        this.$refs.registerFormRef.resetFields();
        },

        },mounted(){
          
        }
}
</script>
<style scoped>
.body{
    width: 100%;
    min-height: 900px;
    background-image: linear-gradient(5000deg,#fff1eb,#ace0f9);
    position: relative;
}
.main{
    width: 600px;
    height: 600px;
    left: 30%;
    margin-top: 3%;
    position: absolute;
}
.submit{
    margin-top:50px ;
    text-align: center;
}
.submit .el-button{
    width: 20%;
    height: 40px;
}
</style>
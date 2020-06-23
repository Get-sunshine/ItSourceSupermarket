<template>
    <div class="login">
        <div class="login-wraper">
            <div class="title">
                <h3><span class="el-icon-user-solid"></span><span>超市管理系统</span></h3>
            </div>
            <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style lang="less">
    @import './login.less';
</style>
<script>
//引入密码验证工具
import utilsValidator from '@/utils/validator.js'; //暂时没有使用
console.log(utilsValidator.passwordReg);

export default {
    data(){
        const checkPassword=(rule,value,callback)=>{
            if(value===''){
                callback(new Error('密码不能为空！'));
            }else {
                if(this.loginForm.checkPass!==''){
                    this.$refs.loginForm.validateField('checkPass');
                }
                callback();
            }
        }
        const confirmPassword= (rule,value,callback)=>{
                if(value===''){
                    callback(new Error('不能为空！'));
                }else if(value!==this.loginForm.password){
                    callback(new Error('两次密码不一致！'));
                }else{
                    callback();
                }
            }
        return {
            // 表单数据
            loginForm:{
                account:'',
                password:'',
                checkPass:''
            },
            //验证规则
            rules:{
                account:[
                    {required:true,message:'请输入账号！',trigger:'blur'},
                    {min:3,max:6,message:'长度 3~6 位！',trigger:'blur'}
                ],
                password:[
                    {required:true,validator:checkPassword} //自定义验证
                ],
                checkPass:[
                    {required:true,validator:confirmPassword} //自定义验证
                ]
            }
        }
    },
    methods:{
        //登录
        submitForm(formName){
            this.$refs[formName].validate(valid =>{
                //如果所有的前端验证都通过了 valid就是true 否则就是false
                if(valid){
                    //提交数据给后端
                    let params={
                        account:this.loginForm.account,
                        password:this.loginForm.password
                    }
                    this.$router.push('/home');
                }else {
                    console.log('验证不通过！');
                    return false;
                }
            });
        },
        //重置
        resetForm(formName){
            this.$refs[formName].resetFields();
        }
    }
}
</script>
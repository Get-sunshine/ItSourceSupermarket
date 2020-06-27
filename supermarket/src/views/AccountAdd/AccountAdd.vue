<template>
  <div class="account-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>管理员账号添加</h3>
      </div>
      <div class="text item">
        <div class="login-wraper">
          <el-form
            style="width:300px;"
            :model="accountAddForm"
            status-icon
            :rules="rules"
            ref="accountAddForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="账号：" prop="account">
              <el-input type="text" v-model="accountAddForm.account" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input type="password" v-model="accountAddForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="checkPass">
              <el-input type="password" v-model="accountAddForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户身份：" prop="userType">
              <el-select v-model="accountAddForm.userType" placeholder="请选择身份">
                <el-option label="普通管理员" value="普通管理员"></el-option>
                <el-option label="超级管理员" value="超级管理员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('accountAddForm')">添加</el-button>
              <el-button @click="resetForm('accountAddForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<style lang="less">
@import "./accountadd";
</style>
<script>
// import { addAccount } from "@/api/account.js";
export default {
  data() {
    // 密码验证
    const checkPassword = (rule, value, callback) => {
      if (this.accountAddForm.checkPass !== "") {
        this.$refs.accountAddForm.validateField("checkPass");
      }
      callback();
    };
    //确认密码验证
    const confirmPassword = (rule, value, callback) => {
      if (value !== this.accountAddForm.password) {
        callback(new Error("两次密码不一致！"));
      }
      callback();
    };
    return {
      //表单数据
      accountAddForm: {
        account: "",
        password: "",
        checkPass: "",
        userType: ""
      },
      //验证规则
      rules: {
        account: [{ required: true, message: "账号不能为空！" }],
        password: [
          { required: true, message: "密码不能为空！" },
          { validator: checkPassword, trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "字段不能为空！" },
          { validator: confirmPassword, trigger: "blur" }
        ],
        userType: [
          { required: true, message: "请选择一个身份", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        //通过
        if (valid) {
          let data = {
            account: this.accountAddForm.account,
            password: this.accountAddForm.password,
            userType: this.accountAddForm.userType
          };
          this.$http.post("account/accountadd", data)
            .then(res => {
              //获取响应数据
              // console.log(res);
              let { code, message } = res.data;
              if (code === 0) {
                // element 的成功消息提示
                this.$message({
                  message,
                  type:'success'
                });
                // 跳转
                this.$router.push('/home/accountmanage');
                // console.log(code);
                // alert(message);
                return;
              }
              // 错误消息提示
              this.$message.error(message);
            })
            .catch(err => {
              console.log(err);
            });
          // 前端验证不通过
        } else {
          console.log("error");
          return;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
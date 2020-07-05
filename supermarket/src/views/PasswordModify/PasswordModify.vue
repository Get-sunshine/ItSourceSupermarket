<template>
  <div class="password-modify">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>密码修改</h3>
      </div>
      <div class="text item">
        <!-- 表单 -->
        <el-form
          :model="passwordModifyForm"
          status-icon
          :rules="rules"
          ref="passwordModifyForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="passwordModifyForm.oldPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="passwordModifyForm.newPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmNewPassword">
            <el-input type="password" v-model="passwordModifyForm.confirmNewPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<style lang="less">
.password-modify {
  .el-card {
    .el-form {
      .el-form-item {
        width: 40%;
      }
    }
  }
}
</style>
<script>
import localStor from '@/utils/localStor.js';
export default {
  data() {
    // 密码字段验证
    const checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
        return;
      }
      let params = {
        password: value
      };
      this.$http
        .post("account/validatepassword", params)
        .then(res => {
          let { code, message } = res.data;
          if (code === 0) {
            callback();
            return;
          }
          if (code === 1) {
            callback(new Error(message));
            return;
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
    // 新密码字段验证
    const checkNewPassword = (rule, value, callback) => {
      if (this.passwordModifyForm.oldPassword === value) {
        callback(new Error("新旧密码不能相同！"));
        return;
      }
      if (this.passwordModifyForm.confirmNewPassword !== "") {
        this.$refs.passwordModifyForm.validateField("confirmNewPassword");
      }
      callback();
    };
    // 确认密码字段验证
    const checkConfirmNewPass = (rule, value, callback) => {
      if (this.passwordModifyForm.newPassword !== value) {
        callback(new Error("两次输入不相同"));
        return;
      }
      callback();
    };
    // 数据
    return {
      // 表单数据
      passwordModifyForm: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      },
      // 验证规则
      rules: {
        oldPassword: [
          { required: true, validator: checkPassword, trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "输入不能为空！", trigger: "blur" },
          { validator: checkNewPassword, trigger: "blur" }
        ],
        confirmNewPassword: [
          { required: true, message: "输入不能为空！", trigger: "blur" },
          { validator: checkConfirmNewPass, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm() {
        this.$refs.passwordModifyForm.validate((valid) => {
            if(valid){
                let params = {
                    oldPassword:this.passwordModifyForm.oldPassword,
                    newPassword:this.passwordModifyForm.newPassword
                }
                this.$http.post('account/passwordmodify',params).then((res) => {
                    let {code,message} = res.data;
                    if(code===0){
                        this.$message({
                            type:'success',
                            message
                        });
                        localStor.remove('zsy_hy');
                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 500);
                        return;
                    }
                    this.$message.error(message);
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }
  }
};
</script>
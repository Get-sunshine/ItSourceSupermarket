<template>
  <div class="personal">
    <el-card class="box-card">
      <!-- header -->
      <div slot="header" class="clearfix">
        <h3>个人信息</h3>
      </div>
      <!-- body -->
      <div class="text item">
        <!-- 头像上传 -->
        <el-row>
          <el-col :span="16">
            <div class="avatar-div">
              <div>上传头像:</div>
              <el-divider></el-divider>
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="upload"
                action="null"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <el-divider></el-divider>
            <div class="info">
              <p>ID：{{accountInfo.id}}</p>
              <el-divider></el-divider>
              <p>用户：{{accountInfo.account}}</p>
              <el-divider></el-divider>
              <p>创建时间：{{accountInfo.createDate | formatDate}}</p>
              <el-divider></el-divider>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<style lang="less" scoped>
.personal {
  .avatar-uploader .el-upload {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      accountInfo: {},
      //   图片地址
      imageUrl: ""
    };
  },
  methods: {
    //   获得用户信息
    getAccountInfo() {
      this.$http
        .get("account/getaccountinfo")
        .then(res => {
          let { code, message, result } = res.data;
          if (code === 0) {
            this.accountInfo = result.accountInfo[0];
            return;
          }
          this.$message.error(message);
          return;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 头像上传成功之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return isJPG && isLt2M;
    },
    // 自定义上传函数
    upload(file) {
      // 创建formdata
      const params = new FormData();
      // 将数据存入Formdata
      params.append("file", file.file);
      // 配置
      const config = {
        headers: { "Content-Type": "multipart/form-data"}
      };
      // axios
      axios
        .post("/account/upload", params, config)
        .then(res => {
          let {code,message,result}=res.data;
          if(code===0){
              this.$message({
                  type:'success',
                  message
              });
              this.imageUrl=`http://127.0.0.1:3001`+result.imgUrl;
              // 调用父组件方法
              this.$emit('refreshImageUrl');
              return;
          }
          this.$message.error(message);
          return;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getAccountInfo();
  },
  filters: {
    formatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

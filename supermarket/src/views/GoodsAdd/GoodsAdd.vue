<template>
  <div class="goods-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>商品添加</h3>
      </div>
      <el-form
        :model="goodsAddForm"
        status-icon
        :rules="rules"
        ref="goodsAddForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodsAddForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="number">
          <el-input v-model="goodsAddForm.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="price">
          <el-input v-model.number="goodsAddForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input type="textarea" v-model="goodsAddForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="less">
.goods-add {
  .el-form-item {
    width: 40%;
  }
}
</style>
<script>
export default {
  data() {
    // 自定义验证
    return {
      goodsAddForm: {
        name: "",
        price: "",
        number: "",
        description: ""
      },
      rules: {
        name: [{ required: true, message: "输入不能为空", trigger: "blur" }],
        price: [{ required: true, message: "输入不能为空", trigger: "blur" }],
        number: [{ required: true, message: "输入不能为空", trigger: "blur" }],
        description: [
          { required: true, message: "输入不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
      
    submitForm() {
      this.$refs.goodsAddForm.validate(valid => {
        if (valid) {
          let params = {
            name: this.goodsAddForm.name,
            price: this.goodsAddForm.price,
            number: this.goodsAddForm.number,
            description: this.goodsAddForm.description
          };
          this.$http
            .post("goods/goodsadd", params)
            .then(res => {
              let { code, message } = res.data;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message
                });
                this.$router.push("/home/goodsmanage");
                return;
              }
              this.$message.error(message);
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    resetForm() {
      this.$refs.goodsAddForm.resetFields();
    }
  }
};
</script>
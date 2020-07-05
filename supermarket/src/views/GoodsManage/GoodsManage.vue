<template>
  <div class="goods-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>商品管理</h3>
      </div>
      <div class="text item">
        <!-- search -->
        <el-form :inline="true" :model="searchForm" size="mini" class="demo-form-inline">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSearch">
              <i class="el-icon-search"></i>搜索
            </el-button>
          </el-form-item>
        </el-form>
        <!-- table -->
        <el-table
          ref="goodsManageTable"
          :data="goodsManageTable"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="number" label="商品编号"></el-table-column>
          <el-table-column prop="price" label="商品售价"></el-table-column>
          <el-table-column prop="description" label="商品描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="goodsUpdate(scope.row.id)">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button size="mini" type="danger" @click="goodsDelete(scope.row.id)">
                <i class="el-icon-delete"></i>
              </el-button>
            </template>>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            layout="total,prev, pager, next"
            :current-page="currentPage"
            :total="total"
            :page-size="pageSize"
          ></el-pagination>
        </div>
        <!-- 按钮 -->
        <div style="margin-top: 20px">
          <el-button type="danger" @click="goodsMultipleDelete">批量删除</el-button>
          <el-button type="success" @click="toggleSelection()">取消选择</el-button>
        </div>
      </div>
    </el-card>
    <!-- dialog -->
    <el-dialog title="商品信息修改" :visible.sync="dialogFormVisible">
      <el-form
        :model="editForm"
        ref="editForm"
        :rules="editFormRules"
        status-icon
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="name" :label-width="editFormLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="number" :label-width="editFormLabelWidth">
          <el-input v-model="editForm.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="price" :label-width="editFormLabelWidth">
          <el-input v-model.number="editForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="description" :label-width="editFormLabelWidth">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmitEditForm">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less">
</style>
<script>
export default {
  data() {
    return {
      // searchForm
      searchForm: {
        name: ""
      },
      // dialog
      dialogFormVisible: false,
      // dialog form
      editFormLabelWidth: "120px",
      editForm: {
        id: "",
        name: "",
        number: "",
        price: "",
        description: ""
      },
      editFormRules: {
        name: [{ required: true, message: "输入不能为空", trigger: "blur" }],
        number: [{ required: true, message: "请输入内容", trigger: "blur" }],
        price: [{ required: true, message: "请输入内容", trigger: "blur" }],
        description: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      },
      // 表格数据
      goodsManageTable: [],
      // 选中数据的id
      idArray: [],
      // 分页
      total: 100,
      currentPage: 1,
      pageSize: 6
    };
  },
  methods: {
    //获得商品列表
    getGoodsList() {
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        name:this.searchForm.name
      };
      this.$http.get("goods/goodslist", params).then(res => {
        let { code, message, result } = res.data;
        // 请求成功
        if (code === 0) {
          this.total = result.total;
          this.goodsManageTable = result.res;
          return;
        }
        // 请求异常
        // 此页没有数据 currentPage > 1
        if (this.currentPage > 1) {
          this.currentPage -= 1;
          this.getGoodsList();
          return;
        }
        // 此页没有数据 currentPage===1
        this.total = null;
        this.goodsManageTable = null;
        this.$message.error(message);
        return;
      });
    },
    // 页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsList();
    },
    // 删除
    goodsDelete(id) {
      this.$confirm("是否删除此商品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id
          };
          this.$http
            .post("goods/goodsdelete", params)
            .then(res => {
              let { code, message } = res.data;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message
                });
                this.getGoodsList();
                return;
              }
              this.$message.error(message);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 批量删除
    goodsMultipleDelete() {
      this.$confirm("将永久删除这些商品, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            idArray: this.idArray
          };
          this.$http
            .post("goods/goodsmultipledelete", params)
            .then(res => {
              let { code, message } = res.data;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message
                });
                this.getGoodsList();
                return;
              }
              this.$message.error(message);
              this.getGoodsList();
              return;
            })
            .catch(err => {
              if (err) throw err;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改
    goodsUpdate(id) {
      this.editForm.id = id;
      this.dialogFormVisible = true;
    },
    // 提交修改
    submitEditForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let params = {
            id: this.editForm.id,
            name: this.editForm.name,
            price: this.editForm.price,
            number: this.editForm.number,
            description: this.editForm.description
          };
          this.$http.post("goods/goodsupdate", params).then(res => {
            let { code, message } = res.data;
            if (code === 0) {
              this.$message({
                type: "success",
                message
              });
              this.dialogFormVisible = false;
              this.getGoodsList();
              return;
            }
            this.$message.error(message);
            this.dialogFormVisible = false;
            return;
          });
        }
      });
    },
    // 取消提交
    cancelSubmitEditForm() {
      this.$refs.editForm.resetFields();
      this.dialogFormVisible = false;
    },
    // 取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.goodsManageTable.toggleRowSelection(row);
        });
        return;
      }
      this.$refs.goodsManageTable.clearSelection();
    },
    // 监听选择数据
    handleSelectionChange(val) {
      // 赋值
      this.idArray = val.map(value => value.id);
      console.log(this.idArray);
    },
    // 搜索
    submitSearch(){
        this.getGoodsList();
    }
  },
  created() {
    this.getGoodsList();
  },
  filters: {}
};
</script>
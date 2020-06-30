<template>
  <div class="account-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>账号管理</h3>
      </div>
      <div class="text item">
        <el-table
          ref="accountManageTable"
          :data="accountManageData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="account" label="账号"></el-table-column>
          <el-table-column prop="userType" label="用户类型"></el-table-column>
          <el-table-column label="创建日期">
            <template slot-scope="scope">{{ scope.row.createDate | formatDate}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="info" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i>编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                <i class="el-icon-delete"></i>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination" style="margin-top:20px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[3, 5, 10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userTotal"
          ></el-pagination>
        </div>
        <!-- 按钮 -->
        <div style="margin-top: 20px">
          <el-button type="primary" @click="multipleDelete">
            <i class="el-icon-delete-solid"></i>批量删除
          </el-button>
          <el-button type="success" @click="toggleSelection">
            <i class="el-icon-close"></i>取消选择
          </el-button>
        </div>
      </div>
    </el-card>
    <!-- 模态框 -->
    <el-dialog size="mini" width="30%" title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm" status-icon>
        <el-form-item prop="account" label="账户" :label-width="formLabelWidth">
          <el-input v-model="editForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="userType" label="用户类型" :label-width="formLabelWidth">
          <el-select v-model="editForm.userType" placeholder="请选择用户类型">
            <el-option label="普通管理员" value="普通管理员"></el-option>
            <el-option label="超级管理员" value="超级管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormSave('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less">
@import "./accountmanage";
</style>
<script>
import moment from "moment";
export default {
  data() {
    return {
      // 表格数据
      accountManageData: [],
      // 选中项的id
      selectedIdArray: [],
      // 分页相关
      currentPage: 1, // 默认第一页
      pageSize: 3, // 默认每页3条
      userTotal: 100, // 默认0
      // editForm相关
      editForm: {
        account: "",
        userType: ""
      },
      // 验证表单数据
      rules: {
        account: [
          { required: true, message: "请输入", trigger: "change" },
          { min: 3, max: 6, message: "长度 3~6 位", trigger: "blur" }
        ],
        userType: [
          { required: true, message: "请选择用户身份", trigger: "change" }
        ]
      },
      // 控制表单可见性
      dialogFormVisible: false,
      // editForm label宽度
      formLabelWidth: "100px"
    };
  },
  methods: {
    // 获取账号列表
    getAccountList() {
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      this.$http
        .get("account/accountlist", params)
        .then(response => {
          // 获取数据
          let { code, message, result } = response.data;
          if (code === 0) {
            // 总条数
            this.userTotal = result.userTotal;
            // user数据
            this.accountManageData = result.data;
            // 不是第一页 且该页用户删除完毕
            // if (result.data.length === 1 && this.currentPage > 1) {
            //   // 回到前一页
            //   this.currentPage -= 1;
            //   // 重拿数据
            //   this.getAccountList();
            // }
            return;
          }
          // 此页没有数据，是第一页
          if (this.currentPage === 1) {
            this.$message({
              type: "info",
              message: "暂时没有数据"
            });
            // 总条数，没有
            this.userTotal = result.userTotal;
            // user数据，没有
            this.accountManageData = result.data;
            return;
          }
          // 此页没有数据，不是第一页，回到上一页
          this.currentPage -= 1;
          // 重拿数据
          this.getAccountList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //编辑
    handleEdit(id) {
      this.$http
        .get("account/accountedit", { id })
        .then(res => {
          this.editForm.account = res.data.res.account;
          this.editForm.userType = res.data.res.userType;
          this.editForm["id"] = id;
          // 显示模态框
          this.dialogFormVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保存编辑
    editFormSave(formName) {
      this.$refs[formName].validate(valid => {
        // 所有验证都通过
        if (valid) {
          // 拿数据
          let params = {
            account: this.editForm.account,
            userType: this.editForm.userType,
            id: this.editForm.id
          };
          // 发送数据
          this.$http
            .post("account/accounteditsave", params)
            .then(res => {
              // 重新请求数据
              this.getAccountList();
              // 隐藏模态框
              this.dialogFormVisible = false;
              // 提示消息
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                return;
              }
              this.$message.error(res.data.message);
              return;
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    //删除
    handleDelete(id) {
      this.$confirm("是否删除此用户?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id
          };
          this.$http
            .get("account/accountdelete", params)
            .then(res => {
              let { code, message } = res.data;
              if (code === 0) {
                // 先刷新页面
                this.getAccountList();
                // 提示信息
                this.$message({
                  type: "success",
                  message
                });
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
            message: "已取消"
          });
        });
    },
    // 执行批量删除
    multipleDelete() {
      // 没有选中任何一个
      if (this.selectedIdArray.length === 0) {
        this.$message({
          type: "info",
          message: "没有选中任何一项",
          offset: 200
        });
        return;
      }
      this.$confirm("删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            idArray: this.selectedIdArray
          };
          this.$http
            .post("account/accountmultipledelete", params)
            .then(res => {
              let { code, message } = res.data;
              if (code === 0) {
                // 提示
                this.$message({
                  type: "success",
                  message
                });
                // 刷新
                this.getAccountList();
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
            message: "取消删除",
            offset: 200
          });
        });
    },
    // 监听选择变化
    handleSelectionChange(val) {
      // 取得选中项id
      this.selectedIdArray = val.map(v => v.id);
    },
    // 清空选择状态
    toggleSelection() {
      this.$refs.accountManageTable.clearSelection();
    },
    // 分页相关
    // 每页条数
    handleSizeChange(size) {
      this.pageSize = size;
      if (this.pageSize * this.currentPage < this.userTotal) {
        // 重新拿数据
        this.getAccountList();
      }
    },
    // 当前页码
    handleCurrentChange(page) {
      this.currentPage = page;
      // 重新拿数据
      this.getAccountList();
    }
  },
  // 钩子函数
  created() {
    this.getAccountList();
  },
  // 过滤器
  filters: {
    formatDate(value) {
      // 格式化时间
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
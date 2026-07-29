<template>
  <div class="customer-page">
    <el-card shadow="never">
      <div class="page-header">
        <h2 class="page-title">客户管理</h2>
        <el-button type="primary" @click="openCreateDialog">新增客户</el-button>
      </div>

      <div class="search-bar">
        <el-form :inline="true" class="search-form">
          <el-form-item label="姓名">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入姓名"
              clearable
            />
          </el-form-item>

          <el-form-item label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="请输入手机号"
              clearable
            />
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="全部"
              clearable
              style="width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option label="潜在客户" value="潜在客户" />
              <el-option label="意向" value="意向" />
              <el-option label="成交" value="成交" />
              <el-option label="流失" value="流失" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="paginatedCustomers" border stripe size="small">
        <el-table-column prop="name" label="客户姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="source" label="来源" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="manager" label="负责人" />
        <el-table-column label="操作" width="100">
          <template #default>
            <el-button type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="filteredCustomers.length"
          layout="prev, pager, next"
          background
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增客户" width="560px">
      <el-form
        :model="customerForm"
        label-width="90px"
        ref="createForm"
        :rules="validate"
      >
        <el-form-item label="客户姓名" prop="customerName" :rules="validate.blur">
          <el-input v-model="customerForm.customerName" placeholder="请输入客户姓名" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone" :rules="validate.phone">
          <el-input v-model="customerForm.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="客户来源" prop="source" :rules="validate.change">
          <el-select
            v-model="customerForm.source"
            placeholder="请选择来源"
            style="width: 100%"
          >
            <el-option label="微信" value="微信" />
            <el-option label="官网" value="官网" />
            <el-option label="抖音" value="抖音" />
            <el-option label="线下" value="线下" />
          </el-select>
        </el-form-item>

        <el-form-item label="客户状态" prop="status" :rules="validate.change">
          <el-select
            v-model="customerForm.status"
            placeholder="请选择状态"
            style="width: 100%"
          >
            <el-option label="潜在客户" value="潜在客户" />
            <el-option label="意向" value="意向" />
            <el-option label="成交" value="成交" />
            <el-option label="流失" value="流失" />
          </el-select>
        </el-form-item>

        <el-form-item label="负责人" prop="manager" :rules="validate.change">
          <el-select
            v-model="customerForm.manager"
            placeholder="请选择负责人"
            style="width: 100%"
          >
            <el-option label="销售A" value="销售A" />
            <el-option label="销售B" value="销售B" />
            <el-option label="销售C" value="销售C" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark" :rules="validate.blur">
          <el-input
            v-model="customerForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import validate from "@/utils/validate";
import customerApi from "@/api/customer";

interface CustomerItem {
  id: number;
  customerName: string;
  phone: string;
  source: string;
  status: string;
  manager: string;
  remark?: string;
}
const rules = reactive({
  name: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  source: [{ required: true, message: "请选择客户来源", trigger: "change" }],
  status: [{ required: true, message: "请选择客户状态", trigger: "change" }],
  manager: [{ required: true, message: "请选择负责人", trigger: "change" }],
  remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
});
const searchForm = reactive({
  name: "",
  phone: "",
  status: "",
});
const createForm = ref<ElFormInstance>();

const dialogVisible = ref(false);
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
});

const customers = ref<CustomerItem[]>([
  {
    id: 1,
    name: "张三",
    phone: "138xxx",
    source: "微信",
    status: "意向",
    manager: "小王",
    remark: "跟进中",
  },
  {
    id: 2,
    name: "李四",
    phone: "139xxx",
    source: "官网",
    status: "成交",
    manager: "小李",
    remark: "已签约",
  },
]);

const customerForm = reactive({
  customerName: "",
  phone: "",
  source: "微信",
  status: "潜在客户",
  manager: "销售A",
  remark: "",
});

const filteredCustomers = computed(() => {
  const name = searchForm.name.trim().toLowerCase();
  const phone = searchForm.phone.trim();
  const status = searchForm.status;

  return customers.value.filter((item) => {
    const matchName = !name || item.name.toLowerCase().includes(name);
    const matchPhone = !phone || item.phone.includes(phone);
    const matchStatus = !status || item.status === status;

    return matchName && matchPhone && matchStatus;
  });
});

const paginatedCustomers = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  return filteredCustomers.value.slice(start, start + pagination.pageSize);
});

function handleSearch() {
  pagination.currentPage = 1;
}

function resetSearch() {
  searchForm.name = "";
  searchForm.phone = "";
  searchForm.status = "";
  pagination.currentPage = 1;
}

function openCreateDialog() {
  dialogVisible.value = true;
}

async function handleSave() {
  let valid = await createForm.value.validate().catch((err)=>false);
  if (!valid) return;
  let res = await customerApi.createCustomer(customerForm);
  console.log('res',res);
  ElMessage.error(res.msg || "新增客户失败");
  //   customers.value.unshift({
  //     id: Date.now(),
  //     name: customerForm.name,
  //     phone: customerForm.phone,
  //     source: customerForm.source,
  //     status: customerForm.status,
  //     manager: customerForm.manager,
  //     remark: customerForm.remark,
  //   });

  //   ElMessage.success("新增客户成功");
  //   dialogVisible.value = false;
  //   customerForm.name = "";
  //   customerForm.phone = "";
  //   customerForm.source = "微信";
  //   customerForm.status = "潜在客户";
  //   customerForm.manager = "销售A";
  //   customerForm.remark = "";
  //   pagination.currentPage = 1;
}
</script>

<style scoped>
.customer-page {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.search-bar {
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

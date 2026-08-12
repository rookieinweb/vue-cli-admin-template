<template>
  <div class="customer-page">
    <el-card class="customer-card" shadow="never" v-loading="loading">
      <div class="page-header">
        <h2 class="page-title">客户管理</h2>
        <el-button type="primary" @click="openCreateDialog">新增客户</el-button>
      </div>

      <div class="search-bar">
        <el-form :inline="true" class="search-form">
          <el-form-item label="姓名">
            <el-input
              v-model="searchForm.customer_name"
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
              v-model="searchForm.customer_status"
              placeholder="全部"
              clearable
              style="width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option v-for="item in customerStauts" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="customers" border stripe size="small">
        <el-table-column prop="customer_name" label="客户姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="customer_source" label="来源" />
        <el-table-column prop="customer_status" label="状态" :formatter="formatCustomerStatus" />
        <el-table-column prop="owner.username" label="负责人" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="text" size="small" @click="goToDetail(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" @click="openUpdateDialog(scope.row)">更新</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          background
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="customerForm.id ? '更新客户' : '新增客户'" width="560px">
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
            <el-option v-for="item in customerStauts" :key="item.value" :label="item.label" :value="item.value" />
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

<script lang="ts">
export default {
  name: "CustomerIndex",
};
</script>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import validate from "@/utils/validate";
import customerApi from "@/api/customer";
import { CUSTOMER_STATUS_MAP } from "@/utils/menu";

interface CustomerItem {
  id: number;
  customer_name?: string;
  phone?: string;
  customer_source?: string;
  customer_status?: string;
  owner?: { username?: string };
  remark?: string;
  create_time?: string;
}

interface CustomerListResult {
  list?: CustomerItem[];
  total?: number;
}

const router = useRouter();

const searchForm = reactive({
  customer_name: "",
  phone: "",
  customer_status: "",

});
const createForm = ref<FormInstance>();

const loading = ref(false);
const dialogVisible = ref(false);
const pagination = reactive({
  page: 1,
  size: 10,
  currentPage: 1,
  pageSize: 10,
  total: 0,
});
const customerStauts = ref(Object.keys(CUSTOMER_STATUS_MAP).map(key => ({
  label: CUSTOMER_STATUS_MAP[key],
  value: key,
})));
const customers = ref<CustomerItem[]>([]);

onMounted(async () => {
  listCustomer();
});
const orginalForm = reactive({
  id: null,
  customerName: "",
  phone: "",
  source: "微信",
  status: "potential",
  manager: "销售A",
  remark: "",
});
const customerForm = reactive({...orginalForm});

function formatCustomerStatus(row: CustomerItem) {
  return CUSTOMER_STATUS_MAP[row.customer_status || 'potential'] || '未知';
}
/**获取客户列表 */
async function listCustomer() {
  loading.value = true;

  try {
    const res = (await customerApi.getCustomers({
      page: pagination.page,
      size: pagination.size,
      ...searchForm,
    })) as CustomerListResult;

    customers.value = res.list || [];
    pagination.total = res.total || 0;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.page = 1;
  pagination.currentPage = 1;
  listCustomer();
}

function resetSearch() {
  searchForm.customer_name = "";
  searchForm.phone = "";
  searchForm.customer_status = "";
  pagination.page = 1;
  pagination.currentPage = 1;
  listCustomer();
}
/** 打开更新客户弹窗 */
function openUpdateDialog(row: CustomerItem) {
  customerForm.id = row.id;
  customerForm.customerName = row.customer_name || "";
  customerForm.phone = row.phone || "";
  customerForm.source = row.customer_source || "微信";
  customerForm.status = row.customer_status || "potential";
  customerForm.manager = row.owner?.username || "销售A";
  customerForm.remark = row.remark || "";
  dialogVisible.value = true;
}

function openCreateDialog() {
  Object.assign(customerForm, orginalForm);
  dialogVisible.value = true;
}

function goToDetail(id: number) {
  router.push({ name: "customer-detail", params: { id } });
  // router.push(`customer/detail/${id}`);
}

function handleCurrentChange(val: number) {
  pagination.page = val;
  pagination.currentPage = val;
  listCustomer();
}
const closeCreateDialog = () => {
  dialogVisible.value = false;
  createForm.value?.resetFields();
};
async function handleSave() {
  const valid = await createForm.value?.validate().catch(() => false);
  if (!valid) return;
  if (customerForm.id) {
    await customerApi.updateCustomer(customerForm);
    ElMessage.success("更新成功！");
  } else {
    await customerApi.createCustomer(customerForm);
    ElMessage.success("新增成功！");
  }
  closeCreateDialog();
  listCustomer();
}
</script>

<style scoped lang="scss">
.customer-page {
  min-height: 100%;
}

.customer-card {
  border: 1px solid var(--app-border);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--app-heading);
}

.search-bar {
  margin-bottom: 18px;
  padding: 16px 16px 4px;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  background: var(--app-soft-surface);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  column-gap: 12px;

  :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 12px;
  }
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

@media (max-width: 720px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .search-form {
    display: block;
  }
}
</style>

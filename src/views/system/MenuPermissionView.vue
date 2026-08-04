<template>
  <div class="menu-permission-page">
    <el-card class="menu-permission-page__search-card" shadow="never">
      <template #header>
        <div class="menu-permission-page__header">
          <span>菜单权限管理</span>
          <el-button type="primary" @click="handleAdd">新增权限</el-button>
        </div>
      </template>

      <el-form :model="searchForm" inline>
        <el-form-item label="权限名称">
          <el-input v-model="searchForm.name" placeholder="请输入权限名称" clearable />
        </el-form-item>

        <el-form-item label="权限类型">
          <el-select v-model="searchForm.type" placeholder="全部" clearable>
            <el-option label="全部" value="" />
            <el-option label="dir" value="dir" />
            <el-option label="menu" value="menu" />
            <el-option label="button" value="button" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="menu-permission-page__table-card" shadow="never">
      <el-table
        :data="treelist"
        stripe
        :tree-props="treeProps"
        row-key="id"
        style="width: 100%"
      >

        <el-table-column label="权限名称" prop="name" />
        <el-table-column label="类型" prop="type" />
        <el-table-column label="权限编码" prop="code" />
        <el-table-column label="路由地址" prop="path">
          <template #default="{ row }">
            {{ row.path || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="组件地址" prop="component">
          <template #default="{ row }">
            {{ row.component || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort">
          <template #default="{ row }">
            {{ row.sort ?? "-" }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updated_at" />
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="680px"
      destroy-on-close
    >
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="120px">
        <el-form-item  label="所属菜单" prop="parent_id">
          <el-tree-select
            node-key="id"
            v-model="form.parent_id"
            :data="treelist"
            clearable
            :props="{
              label: 'name',
  children: 'children',
              
            }"
            check-strictly
            placeholder="请选择所属菜单"
          />
        </el-form-item>

        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入权限名称" />
        </el-form-item>

        <el-form-item label="权限类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="dir" value="dir" />
            <el-option label="menu" value="menu" />
            <el-option label="button" value="button" />
          </el-select>
        </el-form-item>

        <el-form-item label="权限编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入唯一权限标识" />
        </el-form-item>

        <el-form-item v-if="form.type === 'menu'" label="路由地址" prop="path">
          <el-input v-model="form.path" placeholder="请输入菜单访问路径" />
        </el-form-item>

        <el-form-item v-if="form.type === 'menu'" label="组件地址" prop="component">
          <el-input v-model="form.component" placeholder="请输入Vue组件路径" />
        </el-form-item>

        <el-form-item v-if="form.type === 'menu'" label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getPerssionList, createPermission, updatePermission } from "@/api/permission";

type PermissionType = "menu" | "button";

type PermissionItem = {
  id: string;
  name: string;
  type: PermissionType;
  code: string;
  path?: string;
  component?: string;
  sort?: number;
  updatedAt: string;
  parent_id?: string;
  children?: PermissionItem[];
};

type FormState = {
  id?: string;
  name: string;
  type: PermissionType;
  code: string;
  parent_id?: string;
  path?: string;
  component?: string;
  sort?: number;
};

const initialRows: PermissionItem[] = [
  {
    id: "customer",
    name: "客户管理",
    type: "menu",
    code: "customer:list",
    path: "/customer",
    component: "customer/index.vue",
    sort: 1,
    updatedAt: "2026-08-04 09:12:00",
    children: [
      {
        id: "customer:add",
        name: "新增客户",
        type: "button",
        code: "customer:add",
        parent_id: "customer",
        updatedAt: "2026-08-04 09:13:00",
      },
      {
        id: "customer:update",
        name: "编辑客户",
        type: "button",
        code: "customer:update",
        parent_id: "customer",
        updatedAt: "2026-08-04 09:14:00",
      },
    ],
  },
  {
    id: "system",
    name: "系统管理",
    type: "menu",
    code: "system:list",
    path: "/system",
    component: "system/index.vue",
    sort: 2,
    updatedAt: "2026-08-04 09:16:00",
    children: [
      {
        id: "user:list",
        name: "用户管理",
        type: "menu",
        code: "user:list",
        path: "/system/user",
        component: "system/user/index.vue",
        sort: 1,
        parent_id: "system",
        updatedAt: "2026-08-04 09:17:00",
      },
    ],
  },
];

const searchForm = ref<{ name: string; type: "" | PermissionType }>({
  name: "",
  type: "",
});


const rows = ref<PermissionItem[]>(JSON.parse(JSON.stringify(initialRows)));
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

const form = ref<FormState>({
  name: "",
  type: "menu",
  code: "",
  path: "",
  component: "",
  sort: 1,
  parent_id: "",
});

const treeProps = {
  label: "name",
  children: "children",
  value: "id",
};
const treelist = ref([])
const menuTreeData = computed((): PermissionItem[] =>
  rows.value.filter((item: PermissionItem) => item.type === "menu"),
);

const tableData = computed(() => rows.value);

const dialogTitle = computed(() => (isEdit.value ? "编辑权限" : "新增权限"));

const formRules = computed(() => ({
  name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择权限类型", trigger: "change" }],
  code: [{ required: true, message: "请输入权限编码", trigger: "blur" }],
  parent_id: [
    {
      required: form.value.type === "button",
      message: "请选择所属菜单",
      trigger: "change",
    },
  ],
  path: [
    {
      required: form.value.type === "menu",
      message: "请输入路由地址",
      trigger: "blur",
    },
  ],
  component: [
    {
      required: form.value.type === "menu",
      message: "请输入组件地址",
      trigger: "blur",
    },
  ],
  sort: [
    {
      required: form.value.type === "menu",
      message: "请输入排序",
      trigger: "blur",
    },
  ],
}));
onMounted(async () => {
  await getPerssionListHandler();
});
async function getPerssionListHandler() {
  const res: any = await getPerssionList({});
  console.log('res====================',res)
  treelist.value = res;
}
function resetForm() {
  form.value = {
    name: "",
    type: "menu",
    code: "",
    path: "",
    component: "",
    sort: 1,
    parent_id: "",
  };
}

function handleQuery() {
  const filtered = JSON.parse(JSON.stringify(initialRows));

  const walk = (list: PermissionItem[]) => {
    const nextList: PermissionItem[] = [];

    list.forEach((item) => {
      const matchName = !searchForm.value.name || item.name.includes(searchForm.value.name);
      const matchType = !searchForm.value.type || item.type === searchForm.value.type;
      const childList = item.children ? walk(item.children) : [];
      const keep = matchName && matchType;

      if (keep || childList.length) {
        const newItem = { ...item, children: childList };
        nextList.push(newItem);
      }
    });

    return nextList;
  };

  rows.value = walk(filtered);
}

function handleReset() {
  searchForm.value = { name: "", type: "" };
  rows.value = JSON.parse(JSON.stringify(initialRows));
  getPerssionListHandler();
}

function handleAdd() {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
}

function handleEdit(item: PermissionItem) {
  isEdit.value = true;
  form.value = {
    id: item.id,
    name: item.name,
    type: item.type,
    code: item.code,
    path: item.path,
    component: item.component,
    sort: item.sort,
    parent_id: item.parent_id,
  };
  dialogVisible.value = true;
}

function findNode(list: PermissionItem[], id: string): PermissionItem | null {
  for (const item of list) {
    if (item.id === id) {
      return item;
    }

    if (item.children?.length) {
      const target = findNode(item.children, id);
      if (target) {
        return target;
      }
    }
  }

  return null;
}

async function handleSubmit() {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) {
      return;
    }

    const payload: any = {
      name: form.value.name,
      type: form.value.type,
      code: form.value.code,
      // updatedAt: "2026-08-04 10:20:00",
      parent_id: form.value.parent_id || 0,
      path: form.value.path,
      component: form.value.component,
      sort: form.value.sort,
    };

    if (isEdit.value && form.value.id) {
      const target = findNode(rows.value, form.value.id);

      if (target) {
        Object.assign(target, payload);
      }
    } else if (form.value.type === "button" && form.value.parent_id) {
      const parent = findNode(rows.value, form.value.parent_id);
      if (!parent) {
        ElMessage.warning("请选择有效的父级菜单");
        return;
      }

      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push(payload);
    } else {
      rows.value.push(payload);
    }

    if (isEdit.value) {
      await updatePermission({
        id: form.value.id,
        ...payload,
      });
    } else {
      await createPermission(payload);
    }

    dialogVisible.value = false;
    ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
    handleReset();
  });
}

function handleDelete(item: PermissionItem) {
  ElMessageBox.confirm(`确认删除权限“${item.name}”吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    const removeNode = (list: PermissionItem[]): PermissionItem[] => {
      return list.filter((node) => {
        if (node.id === item.id) {
          return false;
        }

        if (node.children?.length) {
          node.children = removeNode(node.children);
        }

        return true;
      });
    };

    rows.value = removeNode(rows.value);
    ElMessage.success("删除成功");
  });
}
</script>

<style scoped lang="scss">
.menu-permission-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__search-card,
  &__table-card {
    border: 1px solid #dbe3ef;
    border-radius: 8px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: #111827;
    font-weight: 700;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

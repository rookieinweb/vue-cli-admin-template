<template>
  <div class="permission-page">
    <el-row v-loading="permissionStore.loading" :gutter="16">
      <el-col :xs="24" :lg="8">
        <el-card class="permission-page__panel" shadow="never">
          <template #header>
            <div class="permission-page__panel-header">
              <span>角色列表</span>
              <el-tag type="info">{{ permissionStore.roles.length }} 个角色</el-tag>
            </div>
          </template>
          <!-- {{ permissionStore.roles }} -->
          <el-empty
            v-if="!permissionStore.roles.length"
            description="暂无角色数据"
          />
          <div v-else class="permission-page__role-list">
            <button
              v-for="role in permissionStore.roles"
              :key="role.id"
              class="permission-page__role-card"
              :class="{ 'is-active': role.id === permissionStore.activeRoleId }"
              type="button"
              @click="permissionStore.selectRole(role.id)"
            >
              <div>
                <h3>{{ role.role_name }}</h3>
                <p>{{ role.remark }}</p>
              </div>
              <div class="permission-page__role-meta">
                <span>{{ role.permissions.length }} 项权限</span>
                <small>更新于 {{ role.update_time }}</small>
              </div>
            </button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="16">
        <el-card class="permission-page__panel" shadow="never">
          <template #header>
            <div class="permission-page__panel-header">
              <span>权限树</span>
              <div class="permission-page__actions">
                <el-tag type="success">
                  {{ activeRole?.role_name || "未选择角色" }}
                </el-tag>
                <el-button type="primary" :loading="saving" @click="handleSave">
                  保存权限
                </el-button>
              </div>
            </div>
          </template>

          <div class="permission-page__summary">
            <el-statistic title="已勾选权限" :value="checkedKeys.length" />
            <el-statistic title="目录节点" :value="topLevelCount" />
            <el-statistic title="角色总数" :value="permissionStore.roles.length" />
          </div>

          <el-tree
            ref="treeRef"
            :data="permissionStore.permissionTree"
            node-key="id"
            show-checkbox
            default-expand-all
            :check-strictly="false"
            :props="treeProps"
            @check="handleCheck"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { usePermissionStore } from "@/stores/permission";

type TreeRef = {
  getCheckedKeys: (leafOnly?: boolean) => Array<string | number>;
  setCheckedKeys: (keys: Array<string | number>) => void;
};

const permissionStore = usePermissionStore();
const treeRef = ref<TreeRef | null>(null);
const checkedKeys = ref<string[]>([]);
const saving = ref(false);

const treeProps = {
  label: "name",
  children: "children",
};

const activeRole = computed(() => permissionStore.activeRole);
const topLevelCount = computed(() => permissionStore.permissionTree.length);

function syncCheckedKeys() {
  const nextKeys = activeRole.value?.permissions ?? [];
  checkedKeys.value = [...nextKeys];
  console.log('nextKeys=========================>',nextKeys)
  nextTick(() => {
    treeRef.value?.setCheckedKeys(nextKeys);
  });
}

onMounted(async () => {
  await permissionStore.loadCatalog();
  syncCheckedKeys();
});

watch(
  () => permissionStore.activeRoleId,
  () => {
    syncCheckedKeys();
  },
);

function handleCheck() {
  checkedKeys.value =
    treeRef.value?.getCheckedKeys(false).map((key) => String(key)) ?? [];
}

async function handleSave() {
  if (!activeRole.value) {
    ElMessage.warning("请先选择一个角色");
    return;
  }

  saving.value = true;

  try {
    await permissionStore.savePermissions(checkedKeys.value);
    syncCheckedKeys();
    ElMessage.success("权限保存成功");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped lang="scss">
.permission-page {
  &__panel {
    min-height: 100%;
    border: 1px solid #dbe3ef;
    border-radius: 8px;
  }

  &__panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: #111827;
    font-weight: 700;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  }

  &__role-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__role-card {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 14px;
    padding: 16px;
    border: 1px solid #dbe3ef;
    border-radius: 8px;
    background: #ffffff;
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;

    &:hover,
    &.is-active {
      border-color: #2563eb;
      background: #eff6ff;
      box-shadow: 0 8px 22px rgba(37, 99, 235, 0.12);
    }

    h3 {
      margin: 0 0 8px;
      color: #111827;
      font-size: 16px;
    }

    p {
      margin: 0;
      color: #64748b;
      line-height: 1.7;
    }
  }

  &__role-meta {
    display: flex;
    min-width: 118px;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;

    span {
      color: #2563eb;
      font-weight: 700;
      white-space: nowrap;
    }

    small {
      color: #64748b;
      text-align: right;
    }
  }
}

@media (max-width: 960px) {
  .permission-page {
    &__summary {
      grid-template-columns: 1fr;
    }

    &__panel-header,
    &__actions,
    &__role-card {
      align-items: flex-start;
      flex-direction: column;
    }

    &__role-meta {
      align-items: flex-start;
    }
  }
}
</style>

<template>
  <div class="permission-page">
    <el-row :gutter="20">
      <el-col :xs="24" :lg="8">
        <el-card class="permission-page__panel" shadow="never">
          <template #header>
            <div class="permission-page__panel-header">
              <span>角色列表</span>
              <el-tag type="info">{{ permissionStore.roles.length }} 个角色</el-tag>
            </div>
          </template>

          <div class="permission-page__role-list">
            <button
              v-for="role in permissionStore.roles"
              :key="role.id"
              class="permission-page__role-card"
              :class="{ 'is-active': role.id === permissionStore.activeRoleId }"
              @click="permissionStore.selectRole(role.id)"
            >
              <div>
                <h3>{{ role.name }}</h3>
                <p>{{ role.description }}</p>
              </div>
              <div class="permission-page__role-meta">
                <span>{{ role.permissionIds.length }} 项权限</span>
                <small>更新于 {{ role.updatedAt }}</small>
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
                <el-tag type="success">{{ activeRole?.name || '未选择角色' }}</el-tag>
                <el-button type="primary" :loading="saving" @click="handleSave">保存权限</el-button>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '@/stores/permission'

type TreeRef = {
  getCheckedKeys: (leafOnly?: boolean) => Array<string | number>
  setCheckedKeys: (keys: Array<string | number>) => void
}

const permissionStore = usePermissionStore()
const treeRef = ref<TreeRef | null>(null)
const checkedKeys = ref<string[]>([])
const saving = ref(false)

const treeProps = {
  label: 'label',
  children: 'children',
}

const activeRole = computed(() => permissionStore.activeRole)
const topLevelCount = computed(() => permissionStore.permissionTree.length)

function syncCheckedKeys() {
  const nextKeys = activeRole.value?.permissionIds ?? []
  checkedKeys.value = [...nextKeys]
  nextTick(() => {
    treeRef.value?.setCheckedKeys(nextKeys)
  })
}

onMounted(async () => {
  await permissionStore.loadCatalog()
  syncCheckedKeys()
})

watch(
  () => permissionStore.activeRoleId,
  () => {
    syncCheckedKeys()
  },
)

function handleCheck() {
  checkedKeys.value = treeRef.value?.getCheckedKeys(false).map((key) => String(key)) ?? []
}

async function handleSave() {
  if (!activeRole.value) {
    ElMessage.warning('请先选择一个角色')
    return
  }

  saving.value = true
  try {
    await permissionStore.savePermissions(checkedKeys.value)
    await permissionStore.loadCatalog()
    permissionStore.selectRole(activeRole.value.id)
    syncCheckedKeys()
    ElMessage.success('权限保存成功')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.permission-page {
  &__panel {
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 24px;
    background: rgba(15, 23, 42, 0.82);
    color: #e2e8f0;
  }

  &__panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: #fff;
    font-weight: 700;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }

  &__role-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__role-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 18px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 18px;
    background: rgba(30, 41, 59, 0.76);
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;

    &:hover,
    &.is-active {
      transform: translateY(-1px);
      border-color: rgba(103, 232, 249, 0.5);
      background: rgba(15, 118, 110, 0.2);
    }

    h3 {
      margin: 0 0 8px;
      color: #fff;
      font-size: 16px;
    }

    p {
      margin: 0;
      color: #cbd5e1;
      line-height: 1.7;
    }
  }

  &__role-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
    min-width: 120px;

    span {
      color: #67e8f9;
      font-weight: 700;
    }

    small {
      color: #94a3b8;
      text-align: right;
    }
  }
}

:deep(.el-tree) {
  color: #e2e8f0;
  background: transparent;
}

:deep(.el-tree-node__content:hover),
:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: rgba(103, 232, 249, 0.12);
}

:deep(.el-statistic__head),
:deep(.el-statistic__content) {
  color: #fff;
}

@media (max-width: 960px) {
  .permission-page__summary {
    grid-template-columns: 1fr;
  }
}
</style>
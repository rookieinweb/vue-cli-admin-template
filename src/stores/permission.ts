import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  fetchPermissionTreeApi,
  fetchRolesApi,
  saveRolePermissionsApi,
} from "@/api/permission";
import type { PermissionNode, RoleItem } from "@/types/permission";

export const usePermissionStore = defineStore("permission", () => {
  const permissionTree = ref<PermissionNode[]>([]);
  const roles = ref<RoleItem[]>([]);
  const activeRoleId = ref<number>(0);
  const loading = ref(false);

  const activeRole = computed(
    () => roles.value.find((role) => role.id === activeRoleId.value) ?? null,
  );

  async function loadCatalog() {
    loading.value = true;

    try {
      const [treeResult, rolesResult] = await Promise.all([
        fetchPermissionTreeApi(),
        fetchRolesApi(),
      ]);

      permissionTree.value = treeResult;
      roles.value = rolesResult;

      if (!activeRoleId.value && roles.value.length > 0) {
        activeRoleId.value = roles.value[0].id;
      }
    } finally {
      loading.value = false;
    }
  }

  function selectRole(roleId: number) {
    activeRoleId.value = roleId;
  }

  async function savePermissions(permissionIds: string[]) {
    if (!activeRole.value) {
      return;
    }

    const currentRoleId = activeRole.value.id;

    await saveRolePermissionsApi({
      roleId: currentRoleId,
      permissionIds,
    });
    await loadCatalog();
    activeRoleId.value = currentRoleId;
  }

  return {
    permissionTree,
    roles,
    activeRoleId,
    activeRole,
    loading,
    loadCatalog,
    selectRole,
    savePermissions,
  };
});

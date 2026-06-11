import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  fetchPermissionTreeApi,
  fetchRolesApi,
  saveRolePermissionsApi,
} from "@/api/permission";
import type { PermissionNode, RoleItem } from "@/types/permission";

export const usePermissionStore = defineStore("permission", () => {
  const permissionTree = ref<any>([]);
  const roles = ref<any>([]);
  const activeRoleId = ref<number>(0);

  const activeRole = computed(
    () =>
      roles.value.find((role: any) => role.id === activeRoleId.value) ?? null,
  );

  async function loadCatalog() {
    const [treeResult, rolesResult] = await Promise.all([
      fetchPermissionTreeApi(),
      fetchRolesApi(),
    ]);
    permissionTree.value = treeResult;
    roles.value = rolesResult;
    if (!activeRoleId.value && roles.value.length > 0) {
      activeRoleId.value = roles.value[0].id;
    }
  }

  function selectRole(roleId: number) {
    activeRoleId.value = roleId;
  }

  async function savePermissions(permissionIds: string[]) {
    if (!activeRole.value) {
      return;
    }

    await saveRolePermissionsApi({
      roleId: activeRole.value.id,
      permissionIds,
    });
    await loadCatalog();
    activeRoleId.value = activeRole.value.id;
  }

  return {
    permissionTree,
    roles,
    activeRoleId,
    activeRole,
    loadCatalog,
    selectRole,
    savePermissions,
  };
});

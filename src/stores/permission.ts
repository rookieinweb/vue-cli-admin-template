import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  fetchPermissionTreeApi,
  fetchRolesApi,
  permissionMenu as fetchPermissionMenuApi,
  saveRolePermissionsApi,
} from "@/api/permission";
import type {
  PermissionMenuNode,
  PermissionNode,
  RoleItem,
} from "@/types/permission";

type PermissionMenuResult =
  | PermissionMenuNode[]
  | { list?: PermissionMenuNode[]; data?: PermissionMenuNode[] };

function normalizePermissionMenu(result: PermissionMenuResult) {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result.list)) {
    return result.list;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  return [];
}

export const usePermissionStore = defineStore("permission", () => {
  const permissionTree = ref<PermissionNode[]>([]);
  const permissionMenu = ref<PermissionMenuNode[]>([]);
  const roles = ref<RoleItem[]>([]);
  const activeRoleId = ref<number>(0);
  const loading = ref(false);
  const menuLoading = ref(false);
  const menuFetched = ref(false);

  const activeRole = computed(
    () => roles.value.find((role) => role.id === activeRoleId.value) ?? null,
  );
  const permissionMenuLoaded = computed(() => permissionMenu.value.length > 0);

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

  async function loadUserMenu(force = false) {
    if (menuLoading.value) {
      return;
    }

    if (!force && menuFetched.value) {
      return;
    }

    menuLoading.value = true;

    try {
      const result = await fetchPermissionMenuApi({});
      permissionMenu.value = normalizePermissionMenu(result);
    } catch (err) {
      permissionMenu.value = [];
    } finally {
      menuFetched.value = true;
      menuLoading.value = false;
    }
  }

  function resetUserMenu() {
    permissionMenu.value = [];
    menuFetched.value = false;
    menuLoading.value = false;
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
    permissionMenu,
    roles,
    activeRoleId,
    activeRole,
    loading,
    menuLoading,
    permissionMenuLoaded,
    menuFetched,
    loadCatalog,
    loadUserMenu,
    resetUserMenu,
    selectRole,
    savePermissions,
  };
});

import request from "@/utils/request";
import {
  defaultRoles,
  permissionTree as defaultPermissionTree,
} from "@/data/permissions";
import type {
  PermissionMenuNode,
  PermissionNode,
  RoleItem,
} from "@/types/permission";
import { readJson, writeJson } from "@/utils/storage";

const ROLE_STORAGE_KEY = "vue-admin-permission-roles";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readLocalRoles() {
  return clone(readJson<RoleItem[]>(ROLE_STORAGE_KEY, defaultRoles));
}

function getUpdatedAt() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join("-") +
    ` ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  );
}

export async function fetchPermissionTreeApi() {
  try {
    return await request.get<PermissionNode[]>("/permission/list", {
      showError: false,
    });
  } catch {
    return clone(defaultPermissionTree);
  }
}

export async function fetchRolesApi() {
  return await request.get<RoleItem[]>("/role/list", {
    showError: false,
  });
}

export async function saveRolePermissionsApi(payload: {
  roleId: number;
  permissionIds: string[];
}) {
  try {
    return await request.put<RoleItem>(`/role/${payload.roleId}/permissions`, payload, {
      showError: false,
    });
  } catch {
    const nextRoles = readLocalRoles().map((role) =>
      role.id === payload.roleId
        ? {
            ...role,
            permissionIds: payload.permissionIds,
            updatedAt: getUpdatedAt(),
          }
        : role,
    );

    writeJson(ROLE_STORAGE_KEY, nextRoles);
    return nextRoles;
  }
}
type PermissionQuery = Record<string, unknown>;
type PermissionPayload = Record<string, unknown>;

/**获取菜单列表 */
export async function getPerssionList(params: PermissionQuery) {
  return await request.get<PermissionMenuNode[]>("/permission/list", params);
}
/**创建菜单 */
export async function createPermission(data: PermissionPayload) {
  return await request.post<unknown>("/permission/create", data);
}
/**修改菜单 */
export async function updatePermission(data: PermissionPayload) {
  return await request.put<unknown>("/permission/update", data);
}
/**获取菜单 */
export async function permissionMenu(params: PermissionQuery) {
  return await request.get<
    PermissionMenuNode[] | { list?: PermissionMenuNode[]; data?: PermissionMenuNode[] }
  >("/user/menu", params);
}

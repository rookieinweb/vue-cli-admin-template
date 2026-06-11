import request from "@/utils/request";
import type { PermissionNode, RoleItem } from "@/types/permission";

interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
}

function unwrap<T>(response: ApiResult<T>) {
  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function fetchPermissionTreeApi() {
  const { data } = await request.get<ApiResult<PermissionNode[]>>(
    "/permissions/tree",
  );
  return unwrap(data);
}

export async function fetchRolesApi() {
  const { data } = await request.get<ApiResult<RoleItem[]>>(
    "/permissions/roles",
  );
  return unwrap(data);
}

export async function saveRolePermissionsApi(payload: {
  roleId: number;
  permissionIds: string[];
}) {
  const { data } = await request.post<ApiResult<RoleItem[]>>(
    "/permissions/roles/save",
    payload,
  );
  return unwrap(data);
}

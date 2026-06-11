export interface PermissionNode {
  id: string;
  label: string;
  children?: PermissionNode[];
}

export interface RoleItem {
  id: number;
  name: string;
  code: string;
  description: string;
  permissionIds: string[];
  updatedAt: string;
}
export interface PermissionNode {
  id: string;
  label: string;
  children?: PermissionNode[];
}

export interface RoleItem {
  id: number;
  name: string;
  code: string;
  description: string;
  permissionIds: string[];
  updatedAt: string;
}

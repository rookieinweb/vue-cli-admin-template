export interface PermissionNode {
  id: string;
  label: string;
  children?: PermissionNode[];
}

export interface PermissionMenuNode {
  id?: string;
  name?: string;
  title?: string;
  path?: string;
  component?: string;
  icon?: string;
  children?: PermissionMenuNode[];
}

export interface RoleItem {
  id: number;
  name: string;
  code: string;
  description: string;
  permissionIds: string[];
  updatedAt: string;
}

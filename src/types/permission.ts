export interface PermissionNode {
  id: string;
  label: string;
  children?: PermissionNode[];
}

export interface PermissionMenuNode {
  id?: string;
  code?: string;
  name?: string;
  title?: string;
  type?: "dir" | "menu" | "button" | string;
  path?: string;
  component?: string;
  icon?: string;
  hide?: boolean;
  is_hidden?: boolean;
  keep_alive?: boolean;
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

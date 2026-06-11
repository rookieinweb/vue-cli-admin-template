import type { PermissionNode, RoleItem } from "@/types/permission";

export const permissionTree: PermissionNode[] = [
  { id: "dashboard", label: "控制台" },
  {
    id: "user",
    label: "用户管理",
    children: [
      { id: "user:list", label: "用户列表" },
      { id: "user:add", label: "新增用户" },
      { id: "user:edit", label: "编辑用户" },
      { id: "user:delete", label: "删除用户" },
    ],
  },
  {
    id: "permission",
    label: "权限管理",
    children: [
      { id: "permission:role", label: "角色管理" },
      { id: "permission:assign", label: "权限分配" },
    ],
  },
  {
    id: "system",
    label: "系统设置",
    children: [
      { id: "system:config", label: "基础配置" },
      { id: "system:log", label: "操作日志" },
    ],
  },
];

export const defaultRoles: RoleItem[] = [
  {
    id: 1,
    name: "超级管理员",
    code: "super-admin",
    description: "拥有全部权限，可维护系统配置和角色权限。",
    permissionIds: [
      "dashboard",
      "user:list",
      "user:add",
      "user:edit",
      "user:delete",
      "permission:role",
      "permission:assign",
      "system:config",
      "system:log",
    ],
    updatedAt: "2026-06-11 09:00:00",
  },
  {
    id: 2,
    name: "运营管理员",
    code: "operator",
    description: "负责日常运营和用户管理。",
    permissionIds: [
      "dashboard",
      "user:list",
      "user:add",
      "user:edit",
      "permission:role",
    ],
    updatedAt: "2026-06-11 09:00:00",
  },
  {
    id: 3,
    name: "审核员",
    code: "auditor",
    description: "以查看和审核为主，限制敏感写操作。",
    permissionIds: ["dashboard", "user:list", "permission:role"],
    updatedAt: "2026-06-11 09:00:00",
  },
];

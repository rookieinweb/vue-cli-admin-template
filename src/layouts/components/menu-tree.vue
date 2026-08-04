<template>
  <template v-for="item in items" :key="item.path">
    <el-sub-menu
      v-if="item.children?.length"
      :index="item.path"
      class="menu-group"
      :class="{ 'menu-group--active': activeGroupPath === item.path }"
    >
      <template #title>
        <div class="menu-node">
          <el-icon v-if="item.iconComponent">
            <component :is="item.iconComponent" />
          </el-icon>
          <span>{{ item.title }}</span>
        </div>
      </template>

      <MenuTree
        :items="item.children"
        :active-group-path="activeGroupPath"
        :current-path="currentPath"
      />
    </el-sub-menu>

    <el-menu-item
      v-else
      :index="item.path"
      class="menu-item"
      :class="{ 'menu-item--active': currentPath === item.path }"
    >
      <el-icon v-if="item.iconComponent">
        <component :is="item.iconComponent" />
      </el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { Component } from "vue";

interface MenuNode {
  path: string;
  title: string;
  iconComponent?: Component;
  children?: MenuNode[];
}

withDefaults(
  defineProps<{
    items: MenuNode[];
    activeGroupPath?: string;
    currentPath?: string;
  }>(),
  {
    items: () => [],
    activeGroupPath: "",
    currentPath: "",
  },
);
</script>

<style lang="scss" scoped>
.menu-node,
.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.menu-item {
  height: 44px;
  margin: 3px 0;
  border-radius: 8px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #f1f5f9;
    transform: translateX(2px);
  }
}

.menu-item--active {
  font-weight: 700;
}
</style>

<template>
  <template v-for="item in items" :key="item.path">
    <el-sub-menu
      v-if="item.children?.length"
      :index="item.path"
      class="menu-group"
      :class="{ 'menu-group--active': activePath === item.path }"
    >
      <template #title>
        <div class="menu-group__title" @click.stop="handleToggle(item.path)">
          <el-icon v-if="item.iconComponent">
            <component :is="item.iconComponent" />
          </el-icon>
          <span>{{ item.title }}</span>
        </div>
      </template>

      <MenuTree :items="item.children" :active-path="activePath" @toggle-group="handleToggle" />
    </el-sub-menu>

    <el-menu-item v-else :index="item.path" class="menu-item" :class="{ 'menu-item--active': activePath === item.path }">
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

const props = withDefaults(
  defineProps<{
    items: MenuNode[];
    activePath?: string;
  }>(),
  {
    items: () => [],
    activePath: "",
  },
);

const emit = defineEmits<{
  (event: "toggle-group", path: string): void;
}>();

function handleToggle(path: string) {
  emit("toggle-group", path);
}
</script>

<style lang="scss" scoped>
.menu-group {
  :deep(.el-sub-menu__title) {
    height: 44px;
    margin: 4px 0;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  :deep(.el-sub-menu__title:hover) {
    background: #f8fafc;
    transform: translateX(2px);
  }
}

.menu-item {
  height: 44px;
  margin: 4px 0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f8fafc;
  transform: translateX(2px);
}

.menu-group__title {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
</style>

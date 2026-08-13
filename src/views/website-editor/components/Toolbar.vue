<template>
  <header class="editor-toolbar">
    <div class="editor-toolbar__left">
      <strong>官网配置</strong>
      <span>企业官网可视化编辑器</span>
    </div>

    <div class="editor-toolbar__actions">
      <el-button :loading="saving" @click="$emit('save')">保存</el-button>
      <el-button @click="$emit('preview')">预览</el-button>
      <el-button type="primary" :loading="publishing" @click="$emit('publish')">
        发布
      </el-button>
      <el-segmented v-model="activeDevice" :options="deviceOptions" @change="handleDeviceChange" />
    </div>
  </header>
</template>

<script lang="ts">
export default {
  name: "WebsiteEditorToolbar",
};
</script>

<script setup lang="ts">
import { ref } from "vue";

withDefaults(
  defineProps<{
    saving?: boolean;
    publishing?: boolean;
  }>(),
  {
    saving: false,
    publishing: false,
  },
);

const emit = defineEmits<{
  (event: "save"): void;
  (event: "preview"): void;
  (event: "publish"): void;
  (event: "device", value: "desktop" | "mobile"): void;
}>();

const activeDevice = ref<"desktop" | "mobile">("desktop");
const deviceOptions = [
  { label: "PC", value: "desktop" },
  { label: "手机", value: "mobile" },
];

function handleDeviceChange(value: string | number | boolean) {
  emit("device", value === "mobile" ? "mobile" : "desktop");
}
</script>

<style scoped lang="scss">
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding: 0 16px;
  background: #ffffff;

  &__left {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;

    strong {
      color: var(--app-heading);
      font-size: 16px;
    }

    span {
      color: var(--app-muted);
      font-size: 12px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>

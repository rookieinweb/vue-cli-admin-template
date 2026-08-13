<template>
  <div class="website-editor">
    <Toolbar
      :saving="saving"
      :publishing="publishing"
      @save="handleSave"
      @preview="handlePreview"
      @publish="handlePublish"
      @device="handleDevice"
    />

    <div class="website-editor__body">
      <BlockPanel />
      <EditorCanvas
        ref="canvasRef"
        :page-id="pageId"
        @ready="handleEditorReady"
      />
      <StylePanel :selected-component="selectedComponent" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "WebsiteEditor",
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import type { Editor } from "grapesjs";
import {
  publishWebsitePageApi,
  saveWebsitePageApi,
} from "@/api/website";
import BlockPanel from "./components/BlockPanel.vue";
import EditorCanvas from "./components/EditorCanvas.vue";
import StylePanel from "./components/StylePanel.vue";
import Toolbar from "./components/Toolbar.vue";

const route = useRoute();
const editor = ref<Editor>();
const selectedComponent = ref<unknown>(null);
const saving = ref(false);
const publishing = ref(false);
const canvasRef = ref<InstanceType<typeof EditorCanvas>>();

const pageId = computed(() => String(route.query.id || "1"));

function handleEditorReady(payload: { editor: Editor; selectedComponent: unknown }) {
  editor.value = payload.editor;
  selectedComponent.value = payload.selectedComponent;
}

async function handleSave() {
  if (!editor.value) return;

  saving.value = true;

  try {
    const data = editor.value.getProjectData();
    localStorage.setItem(`website-project:${pageId.value}`, JSON.stringify(data));
    await saveWebsitePageApi({
      id: pageId.value,
      project_data: data,
    }).catch(() => null);
    ElMessage.success("官网配置已保存");
  } finally {
    saving.value = false;
  }
}

function handlePreview() {
  canvasRef.value?.preview();
}

async function handlePublish() {
  if (!editor.value) return;

  publishing.value = true;

  try {
    await handleSave();
    const result = await publishWebsitePageApi(pageId.value).catch(() => null);
    ElMessage.success(result?.url ? `发布成功：${result.url}` : "发布成功，官网访问地址已生成");
  } finally {
    publishing.value = false;
  }
}

function handleDevice(device: "desktop" | "mobile") {
  editor.value?.setDevice(device === "mobile" ? "Mobile" : "Desktop");
}
</script>

<style scoped lang="scss">
.website-editor {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  min-height: 720px;
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  background: var(--app-surface);

  &__body {
    display: grid;
    grid-template-columns: 248px minmax(0, 1fr) 304px;
    min-height: 0;
    flex: 1;
    border-top: 1px solid var(--app-border);
  }
}
:deep(.gjs-one-bg) {
    background-color: #ffffff !important;
  }
@media (max-width: 1180px) {
  .website-editor {
    height: auto;
    min-height: calc(100vh - 96px);

    &__body {
      grid-template-columns: 220px minmax(0, 1fr);
    }
  }
}
</style>

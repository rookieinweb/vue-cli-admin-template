<template>
  <main class="editor-canvas">
    <div id="gjs" class="editor-canvas__stage"></div>
  </main>
</template>

<script lang="ts">
export default {
  name: "WebsiteEditorCanvas",
};
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from "vue";
import type { Editor } from "grapesjs";
import { getWebsitePageDetailApi } from "@/api/website";
import { initWebsiteEditor } from "../grapes/init";

const props = defineProps<{
  pageId: string;
}>();

const emit = defineEmits<{
  (event: "ready", payload: { editor: Editor; selectedComponent: unknown }): void;
}>();

const editor = shallowRef<Editor>();
const selectedComponent = shallowRef<unknown>(null);

function getStorageKey() {
  return `website-project:${props.pageId}`;
}

async function loadProjectData(instance: Editor) {
  const detail = await getWebsitePageDetailApi(props.pageId).catch(() => null);

  if (detail?.project_data) {
    instance.loadProjectData(detail.project_data);
    return;
  }

  const cached = localStorage.getItem(getStorageKey());

  if (cached) {
    try {
      instance.loadProjectData(JSON.parse(cached));
      return;
    } catch {
      localStorage.removeItem(getStorageKey());
    }
  }

  instance.addComponents({ type: "website-header" });
  instance.addComponents({ type: "website-banner" });
  instance.addComponents({ type: "website-products" });
  instance.addComponents({ type: "website-contact" });
  instance.addComponents({ type: "website-footer" });
}

onMounted(async () => {
  const instance = initWebsiteEditor({
    container: "#gjs",
    blocksContainer: "#blocks",
    styleContainer: "#style-manager",
  }) as Editor;

  editor.value = instance;
  await loadProjectData(instance);

  instance.on("component:selected", (component) => {
    selectedComponent.value = component;
    emit("ready", { editor: instance, selectedComponent: component });
  });

  instance.on("component:deselected", () => {
    selectedComponent.value = null;
    emit("ready", { editor: instance, selectedComponent: null });
  });

  emit("ready", { editor: instance, selectedComponent: null });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

function preview() {
  editor.value?.runCommand("preview");
}

defineExpose({
  preview,
});
</script>

<style scoped lang="scss">
.editor-canvas {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #e5eaf2;

  &__stage {
    height: 100%;
    min-height: 0;
  }

  :deep(.gjs-one-bg) {
    background-color: #ffffff !important;
  }

  :deep(.gjs-two-color) {
    color: var(--app-muted);
  }

  :deep(.gjs-cv-canvas) {
    width: 100%;
    height: 100%;
    top: 0;
  }

  :deep(.gjs-frame-wrapper) {
    border-radius: 8px;
  }
}
</style>

<template>
  <aside class="block-panel">
    <div class="block-panel__header">
      <strong>组件库</strong>
      <span>拖入画布使用</span>
    </div>
    <div id="blocks" class="block-panel__body"></div>
  </aside>
</template>

<script lang="ts">
export default {
  name: "WebsiteBlockPanel",
};
</script>

<script setup lang="ts"></script>

<style scoped lang="scss">
.block-panel {
  min-width: 0;
  overflow: hidden;
  border-right: 1px solid var(--app-border);
  background: #f8fafc;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    border-bottom: 1px solid var(--app-border);

    strong {
      color: var(--app-heading);
    }

    span {
      color: var(--app-muted);
      font-size: 12px;
    }
  }

  &__body {
    height: calc(100% - 69px);
    overflow: auto;
    padding: 12px;
  }

  :deep(.gjs-block-category) {
    border: 0;
    background: transparent;
  }

  :deep(.gjs-title) {
    padding: 10px 4px;
    color: var(--app-heading);
    font-weight: 700;
    background: transparent;
  }

  :deep(.gjs-blocks-c) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  :deep(.gjs-block) {
    width: auto;
    min-height: 76px;
    margin: 0;
    padding: 12px 8px;
    border: 1px solid var(--app-border);
    border-radius: 8px;
    background: #ffffff;
    color: var(--app-text);
    box-shadow: none;
  }

  :deep(.gjs-block:hover) {
    border-color: var(--app-primary);
    color: var(--app-primary);
  }

  :deep(.gjs-block-label) {
    font-size: 12px;
  }
}
</style>

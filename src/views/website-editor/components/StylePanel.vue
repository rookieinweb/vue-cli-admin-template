<template>
  <aside class="style-panel">
    <div class="style-panel__header">
      <strong>属性配置</strong>
      <span>{{ selectedTypeLabel }}</span>
    </div>

    <div class="style-panel__body">
      <el-empty v-if="!selectedComponent" description="请选择画布中的模块" :image-size="88" />

      <template v-else>
        <el-form label-position="top" size="small">
          <el-form-item label="标题" v-if="hasField('title')">
            <el-input v-model="form.title" @input="updateSelected" />
          </el-form-item>

          <el-form-item label="副标题" v-if="hasField('subtitle')">
            <el-input v-model="form.subtitle" type="textarea" :rows="2" @input="updateSelected" />
          </el-form-item>

          <el-form-item label="按钮文字" v-if="hasField('buttonText')">
            <el-input v-model="form.buttonText" @input="updateSelected" />
          </el-form-item>

          <el-form-item label="图片地址" v-if="hasField('image')">
            <el-input v-model="form.image" @input="updateSelected" />
          </el-form-item>

          <el-form-item label="背景颜色">
            <el-color-picker v-model="form.background" @change="updateSelected" />
          </el-form-item>

          <el-form-item label="模块高度">
            <el-input v-model="form.height" placeholder="例如 520px" @input="updateSelected" />
          </el-form-item>
        </el-form>

        <el-divider>样式</el-divider>
      </template>
      
        <div v-show="selectedComponent" id="style-manager" class="style-panel__manager"></div>
    </div>
  </aside>
</template>

<script lang="ts">
export default {
  name: "WebsiteStylePanel",
};
</script>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";

type EditableComponent = {
  get: (key: string) => unknown;
  set: (value: Record<string, unknown>) => void;
  addStyle: (value: Record<string, string>) => void;
  components: () => { at: (index: number) => EditableComponent | undefined };
  find: (selector: string) => EditableComponent[];
};

const props = defineProps<{
  selectedComponent?: unknown;
}>();

const form = reactive({
  title: "",
  subtitle: "",
  buttonText: "",
  image: "",
  background: "#ffffff",
  height: "",
});

const component = computed(() => props.selectedComponent as EditableComponent | undefined);
const selectedType = computed(() => String(component.value?.get("type") || ""));
const selectedTypeLabel = computed(() => component.value ? `当前：${selectedType.value || "模块"}` : "未选择模块");

const fieldMap: Record<string, string[]> = {
  "website-header": ["title", "buttonText"],
  "website-banner": ["title", "subtitle", "buttonText", "image"],
  "website-about": ["title", "subtitle", "image"],
  "website-products": ["title", "subtitle"],
  "website-services": ["title", "subtitle"],
  "website-cases": ["title", "subtitle"],
  "website-news": ["title", "subtitle"],
  "website-testimonials": ["title", "subtitle"],
  "website-contact": ["title", "subtitle"],
  "website-footer": ["title", "subtitle"],
};

function hasField(field: string) {
  console.log(222222222222222222)
  return fieldMap[selectedType.value]?.includes(field) ?? true;
}

function getText(field: string) {
  const selector = `[data-field="${field}"]`;
  const matched = component.value?.find(selector);
  return String(matched?.[0]?.get("content") || "");
}

function setText(field: string, value: string) {
  const selector = `[data-field="${field}"]`;
  const matched = component.value?.find(selector);
  matched?.[0]?.set({ content: value });
}

function syncForm() {
  if (!component.value) return;
  console.log('componentcomponentcomponentcomponent')
  form.title = getText("js-title");
  form.subtitle = getText("js-subtitle");
  form.buttonText = getText("js-button");
  form.image = String(component.value.get("image") || "");
  form.background = String(component.value.get("background") || "#ffffff");
  form.height = String(component.value.get("height") || "");
}

function updateSelected() {
  if (!component.value) return;
  console.log('component.value========================',component.value.find('.js-title')[0]?.set({ text: form.title }),form.title)
  component.value.set({
    image: form.image,
    background: form.background,
    height: form.height,
  });

  component.value.addStyle({
    background: form.background,
    ...(form.height ? {'min-height': form.height } : {}),
  });

  setText("js-title", form.title);
  setText("js-subtitle", form.subtitle);
  setText("js-button", form.buttonText);
}

watch(
  () => props.selectedComponent,
  () => syncForm(),
  { immediate: true },
);
</script>

<style scoped lang="scss">
.style-panel {
  min-width: 0;
  overflow: hidden;
  border-left: 1px solid var(--app-border);
  background: #ffffff;

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
    padding: 16px;
  }

  &__manager {
    :deep(.gjs-sm-sector) {
      border: 1px solid var(--app-border);
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    :deep(.gjs-sm-sector-title) {
      background: #f8fafc;
      color: var(--app-heading);
    }
  }
}

@media (max-width: 1180px) {
  .style-panel {
    display: none;
  }
}
</style>

<template>
  <div class="hello-world">
    <h2>{{ msg }}</h2>
    <p>这是 Vue3 管理后台模板的占位组件，已替换旧的脚手架示例内容。</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
})
</script>

<style scoped lang="scss">
.hello-world {
  padding: 24px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);

  h2 {
    margin: 0 0 8px;
    color: #0f172a;
  }

  p {
    margin: 0;
    color: #64748b;
    line-height: 1.7;
  }
}
</style>

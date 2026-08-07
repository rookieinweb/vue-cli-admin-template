import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import { pinia } from "./stores";
import ElementPlus, { ElMessage } from "element-plus";
import "element-plus/dist/index.css";
import "./styles/global.scss";

const app = createApp(App);

app.config.errorHandler = (err, _instance, info) => {
  console.error(err);
  console.error(info);
  ElMessage.error((err as Error).message || "页面运行出错");
};

app.use(pinia).use(router).use(ElementPlus).mount("#app");

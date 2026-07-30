<template>
  <div class="customer-detail-page">
    <el-card shadow="never">
      <div class="page-header">
        <div>
          <h2 class="page-title">客户详情</h2>
          <div class="page-subtitle">查看客户的基础信息、标签和跟进记录</div>
        </div>
        <div class="page-actions">
          <el-button type="primary" @click="drawerVisible = true">新增跟进</el-button>
          <el-button>编辑客户</el-button>
          <el-button>转移负责人</el-button>
        </div>
      </div>

      <div class="section-block">
        <h3 class="section-title">基础资料</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">姓名</span>
            <span class="value">{{ customerDetail.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">手机号</span>
            <span class="value">{{ customerDetail.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">来源</span>
            <span class="value">{{ customerDetail.source }}</span>
          </div>
          <div class="info-item">
            <span class="label">状态</span>
            <span class="value">{{ customerDetail.status }}</span>
          </div>
        </div>
      </div>

      <div class="section-block">
        <h3 class="section-title">客户标签</h3>
        <div class="tag-list">
          <el-tag v-for="tag in customerDetail.tags" :key="tag" type="success" effect="plain">
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <div class="section-block">
        <h3 class="section-title">跟进记录</h3>
        <div class="timeline-list">
          <div v-for="item in customerDetail.followUps" :key="item.date + item.content" class="timeline-item">
            <div class="timeline-date">{{ item.date }}</div>
            <div class="timeline-content">
              <div class="timeline-method">{{ item.method }}</div>
              <div class="timeline-text">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-drawer v-model="drawerVisible" title="新建跟进记录" direction="rtl" size="420px">
      <div class="drawer-form">
        <div class="form-item">
          <div class="form-label">跟进方式</div>
          <el-radio-group v-model="followForm.method">
            <el-radio label="电话">电话</el-radio>
            <el-radio label="微信">微信</el-radio>
            <el-radio label="拜访">拜访</el-radio>
          </el-radio-group>
        </div>

        <div class="form-item">
          <div class="form-label">跟进时间</div>
          <el-date-picker
            v-model="followForm.followTime"
            type="datetime"
            placeholder="请选择时间"
            style="width: 100%"
          />
        </div>

        <div class="form-item">
          <div class="form-label">跟进主题</div>
          <el-input v-model="followForm.title" placeholder="请输入跟进主题" />
        </div>

        <div class="form-item">
          <div class="form-label">跟进内容</div>
          <el-input v-model="followForm.content" type="textarea" :rows="4" placeholder="请输入跟进内容" />
        </div>

        <div class="form-item">
          <div class="form-label">跟进结果</div>
          <el-input v-model="followForm.result" type="textarea" :rows="3" placeholder="请输入跟进结果" />
        </div>

        <div class="form-item">
          <div class="form-label">下次跟进时间</div>
          <el-date-picker
            v-model="followForm.nextFollowTime"
            type="datetime"
            placeholder="请选择时间"
            style="width: 100%"
          />
        </div>

        <div class="drawer-actions">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveFollow">保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import customerApi from "@/api/customer";

const route = useRoute();
const drawerVisible = ref(false);

const followForm = reactive({
  method: "电话",
  followTime: new Date(),
  title: "",
  content: "",
  result: "",
  nextFollowTime: "",
});

onMounted(async () => {
  getCustomerDetail()
});

async function getCustomerDetail() {
  const id = Number(route.params.id);
  const res = await customerApi.getCustomerDetail(id);
  if (res.code === 200) {
    customerDetail.value = res.data;
  }
}

async function handleSaveFollow() {
  ElMessage.success("跟进记录已保存");
  drawerVisible.value = false;
  
}

const customerDetail = computed(() => {
  const id = Number(route.params.id);

  if (id === 2) {
    return {
      name: "李四",
      phone: "13988888888",
      source: "官网",
      status: "成交",
      tags: ["高价值", "教育行业"],
      followUps: [
        { date: "2026-07-25", method: "电话沟通", content: "客户已确认签约" },
        { date: "2026-07-26", method: "微信沟通", content: "发送合同" },
      ],
    };
  }

  return {
    name: "张三",
    phone: "13888888888",
    source: "微信",
    status: "意向客户",
    tags: ["高价值", "教育行业"],
    followUps: [
      { date: "2026-07-28", method: "电话沟通", content: "客户考虑报名" },
      { date: "2026-07-30", method: "微信沟通", content: "发送方案" },
    ],
  };
});
</script>

<style scoped>
.customer-detail-page {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.page-subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.page-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.section-block {
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
}

.section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 12px 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: #6b7280;
}

.value {
  font-size: 14px;
  color: #111827;
}

.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}

.timeline-date {
  min-width: 90px;
  font-weight: 600;
  color: #374151;
}

.timeline-method {
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 4px;
}

.timeline-text {
  color: #4b5563;
}

.drawer-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>

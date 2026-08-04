<template>
  <div class="crm-dashboard">
    <header class="crm-header">
      <div class="crm-header__left">
        <div class="crm-logo">S</div>
        <span class="crm-title">Smart CRM</span>
      </div>
      <div class="crm-header__right">
        <el-avatar :size="36" class="crm-avatar">U</el-avatar>
        <span class="crm-user">运营主管</span>
      </div>
    </header>

    <section class="stats-grid">
      <el-card v-for="item in stats" :key="item.label" class="stat-card" shadow="never">
        <div class="stat-card__label">{{ item.label }}</div>
        <div class="stat-card__value">{{ item.value }}</div>
        <div class="stat-card__tip">{{ item.tip }}</div>
      </el-card>
    </section>

    <section class="panel panel--full">
      <div class="panel__title">客户增长趋势折线图</div>
      <div class="chart-box chart-box--line">
        <div ref="lineChartRef" class="chart-canvas" />
      </div>
    </section>

    <section class="bottom-grid">
      <el-card class="panel panel--chart" shadow="never">
        <div class="panel__title">客户来源统计</div>
        <div class="chart-box chart-box--pie">
          <div ref="pieChartRef" class="chart-canvas chart-canvas--small" />
        </div>
      </el-card>

      <el-card class="panel panel--chart" shadow="never">
        <div class="panel__title">销售转化漏斗</div>
        <div class="chart-box chart-box--funnel">
          <div ref="funnelChartRef" class="chart-canvas chart-canvas--small" />
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const stats = [
  {
    label: '客户总数',
    value: '1280',
    tip: '累计有效客户',
  },
  {
    label: '今日新增',
    value: '56',
    tip: '比昨天增长 8%',
  },
  {
    label: '待跟进',
    value: '132',
    tip: '需今日回访',
  },
  {
    label: '成交客户',
    value: '245',
    tip: '本月已成交',
  },
];

const lineChartRef = ref<HTMLElement | null>(null);
const pieChartRef = ref<HTMLElement | null>(null);
const funnelChartRef = ref<HTMLElement | null>(null);

let lineChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;
let funnelChart: echarts.ECharts | null = null;

const renderCharts = () => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value);
    lineChart.setOption({
      grid: { left: 24, right: 12, top: 20, bottom: 32 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#64748b' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#64748b' },
      },
      tooltip: { trigger: 'axis' },
      series: [{
        name: '客户增长',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [120, 160, 190, 230, 210, 260, 320, 360],
        lineStyle: { width: 3, color: '#4f46e5' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(79, 70, 229, 0.32)' },
            { offset: 1, color: 'rgba(79, 70, 229, 0.04)' },
          ]),
        },
      }],
    });
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value);
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: {
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: '#475569' },
      },
      series: [{
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '42%'],
        data: [
          { value: 35, name: '线上渠道', itemStyle: { color: '#4f46e5' } },
          { value: 25, name: '门店转介绍', itemStyle: { color: '#22c55e' } },
          { value: 18, name: '活动引流', itemStyle: { color: '#f59e0b' } },
          { value: 12, name: '其他', itemStyle: { color: '#ef4444' } },
        ],
        label: { color: '#64748b' },
      }],
    });
  }

  if (funnelChartRef.value) {
    funnelChart = echarts.init(funnelChartRef.value);
    funnelChart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'funnel',
        width: '90%',
        height: '80%',
        top: '10%',
        left: 'center',
        gap: 6,
        sort: 'descending',
        data: [
          { value: 1000, name: '线索量' },
          { value: 780, name: '邀约量' },
          { value: 580, name: '到店量' },
          { value: 400, name: '成交量' },
          { value: 250, name: '复购量' },
        ],
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: { color: '#111827', fontWeight: 700 },
        emphasis: { itemStyle: { opacity: 0.9 } },
      }],
    });
  }
};

const resizeCharts = () => {
  lineChart?.resize();
  pieChart?.resize();
  funnelChart?.resize();
};

onMounted(() => {
  renderCharts();
  window.addEventListener('resize', resizeCharts);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts);
  lineChart?.dispose();
  pieChart?.dispose();
  funnelChart?.dispose();
});
</script>

<style scoped lang="scss">
.crm-dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.crm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
}

.crm-header__left,
.crm-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.crm-logo {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #2563eb, #22c55e);
  color: #fff;
  border-radius: 10px;
  font-weight: 700;
}

.crm-title,
.crm-user {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  min-height: 120px;
}

.stat-card__label {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 12px;
}

.stat-card__value {
  color: #111827;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-card__tip {
  color: #64748b;
  font-size: 13px;
}

.panel {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #fff;
}

.panel--full {
  padding: 20px;
}

.panel__title {
  margin-bottom: 12px;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.chart-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.chart-box--line {
  padding: 12px;
}

.chart-canvas {
  width: 100%;
  height: 320px;
}

.chart-canvas--small {
  height: 280px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.panel--chart {
  padding: 16px;
}


@media (max-width: 960px) {
  .stats-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .crm-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>

<script setup>
import { ref } from 'vue'

const series = ref([
  {
    name: '營業額',
    data: [12000, 19000, 30000, 25000, 42000],
  },
])

// ======== 營收趨勢 ========
const chartOptions = ref({
  chart: {
    toolbar: {
      show: false,
    },
    foreColor: '#E0E0E0',
  },

  grid: {
    borderColor: '#424242',
  },

  xaxis: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

    labels: {
      style: {
        colors: '#E0E0E0',
        fontSize: '12px',
      },
    },

    axisBorder: {
      color: '#616161',
    },

    axisTicks: {
      color: '#616161',
    },
  },

  yaxis: {
    labels: {
      style: {
        colors: '#E0E0E0',
        fontSize: '12px',
      },
    },
  },

  tooltip: {
    theme: 'dark',
  },
})

// ======== 營收趨勢 止 ========

// ======== 訂單來源 ========
const pieSeries = ref([44, 55, 13])

const pieOptions = ref({
  labels: ['網站', 'APP', '門市'],
  legend: {
    labels: {
      colors: '#fff',
    },
  },
})

const productSeries = ref([
  {
    name: '銷售量',
    data: [120, 98, 76, 55, 32],
  },
])

// ======== 訂單來源 止 ========

// ======== 熱銷商品 ========
const productOptions = ref({
  chart: {
    toolbar: {
      show: false,
    },
    foreColor: '#E0E0E0',
  },
  grid: {
    borderColor: '#424242',
  },
  xaxis: {
    categories: ['iPhone', 'AirPods', 'iPad', 'MacBook', 'Watch'],
    labels: {
      style: {
        colors: '#E0E0E0',
        fontSize: '12px',
      },
    },

    axisBorder: {
      color: '#616161',
    },

    axisTicks: {
      color: '#616161',
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#E0E0E0',
        fontSize: '12px',
      },
    },
  },
  tooltip: {
    theme: 'dark',
  },
})
// ======== 熱銷商品 止 ========
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" md="3" class="d-flex">
        <v-card class="flex-grow-1 d-flex flex-column pa-4 ga-3">
          <div class="d-flex justify-space-between align-center">
            <v-card-title class="pa-0"> 今日營收 </v-card-title>
          </div>

          <v-card-text class="font-weight-bold d-flex justify-end align-end flex-grow-1 pa-0 dashboard-number">
            NT$ 58,000
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" md="3" class="d-flex">
        <v-card class="flex-grow-1 d-flex flex-column pa-4">
          <div class="d-flex justify-space-between align-center">
            <v-card-title class="pa-0"> 本月訂單 </v-card-title>
          </div>

          <v-card-text class="font-weight-bold d-flex justify-end align-end flex-grow-1 pa-0 dashboard-number">
            1,240 筆
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" md="3" class="d-flex">
        <v-card class="flex-grow-1 d-flex flex-column pa-4">
          <v-card-title class="pa-0"> 今日訪客 </v-card-title>

          <v-card-text class="font-weight-bold d-flex justify-end align-end flex-grow-1 pa-0 dashboard-number">
            3,420
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" md="3" class="d-flex">
        <v-card class="flex-grow-1 d-flex flex-column pa-4">
          <v-card-title class="pa-0"> 新增會員 </v-card-title>

          <v-card-text class="font-weight-bold d-flex justify-end align-end flex-grow-1 pa-0 dashboard-number">
            89 人
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 圖表 -->
    <v-row>
      <v-col cols="12">
        <v-card class="flex-grow-1 d-flex flex-column pa-4">
          <div class="d-flex justify-space-between align-center">
            <v-card-title class="pa-0"> 營收趨勢 </v-card-title>
          </div>

          <apexchart type="line" height="350" :options="chartOptions" :series="series" />
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- 訂單來源 -->
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title> 訂單來源 </v-card-title>

          <apexchart type="pie" height="320" :options="pieOptions" :series="pieSeries" />
        </v-card>
      </v-col>

      <!-- 商品排行 -->
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title> 熱銷商品排行 </v-card-title>

          <apexchart type="bar" height="320" :options="productOptions" :series="productSeries" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.dashboard-number {
  font-size: 20px;
}
</style>

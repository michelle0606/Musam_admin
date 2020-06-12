<template>
  <div class="small">
    <div class="chart-title">年度訂單數/營業額折線圖</div>
    <canvas id="myChart2" width="400px" height="300px"></canvas>
  </div>
</template>
<script>
import Chart from "chart.js";

export default {
  props: {
    initialData: {
      type: Array,
      required: true
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      orders: []
    };
  },
  watch: {
    initialData(orders) {
      this.orders = [...this.orders, ...this.initialData];
    }
  },
  created() {
    this.orders = [...this.orders, ...this.initialData];
  },
  mounted() {
    var ctx2 = document.getElementById("myChart2");

    var myChart2 = new Chart(ctx2, {
      type: "line",
      data: {
        labels: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月"
        ],
        datasets: [
          {
            label: "訂單數",
            backgroundColor: "#151515",
            borderWidth: 1,
            borderColor: "#151515",
            pointStyle: "crossRot",
            data: [65, 59, 30, 81, 56, 29, 40, 22, 32, 54, 42, 30],
            fill: "false"
          },
          {
            label: "營業額",
            backgroundColor: "#04730b",
            borderWidth: 1,
            borderColor: "#04730b",
            pointStyle: "crossRot",
            data: [40, 22, 32, 54, 48, 30, 81, 56, 62, 40, 22, 70],
            fill: "false"
          }
        ]
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.small {
  width: 100%;
  background: #fff;
  padding: 0px 10px;
  margin: 20px 0px;
  .chart-title {
    text-align: center;
    padding-top: 7px;
    font-size: 14px;
    color: grey;
  }
}
</style>

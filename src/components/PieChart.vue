<template>
  <div class="small">
    <div class="chart-title">本月銷售量前三名商品</div>
    <canvas id="myChart1" width="400px" height="300px"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'

export default {
  components: {},
  data() {
    return {}
  },
  mounted() {
    var ctx2 = document.getElementById('myChart1')

    var myChart1 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [10, 20, 30],
            backgroundColor: ['#EEAE96', '#9C95C6', '#77C3A7'],
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ['四月小塔組合', '焦糖可可生乳酪', '香草烤布蕾'],
      },

      // {
      //   datasets: [
      //     {
      //       label: 'January',
      //       backgroundColor: 'green',
      //       data: 22,
      //     },
      //     {
      //       label: 'February',
      //       backgroundColor: 'blue',
      //       data: 33,
      //     },
      //     {
      //       label: 'March',
      //       backgroundColor: 'red',
      //       data: 44,
      //     },
      //   ],
      // },
      options: {},
    })
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.small {
  width: 100%;
  background: #fff;
  padding: 10px 0px;
  margin: 20px 0px;
  .chart-title {
    text-align: center;
    padding-top: 7px;
    font-size: 14px;
    color: grey;
  }
}
</style>

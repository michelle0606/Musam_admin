<template>
  <div class="small">
    <div class="chart-title">本月銷售量前五名商品</div>
    <canvas id="myChart1" width="400px" height="300px"></canvas>
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
    let productLabels = calculator(this.orders)[0];
    let orderData = calculator(this.orders)[1];
    let ctx2 = document.getElementById("myChart1");

    let myChart1 = new Chart(ctx2, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: orderData || [1, 1, 1, 1, 1],
            backgroundColor: [
              "#EEAE96",
              "#9C95C6",
              "#77C3A7",
              "#EAEB84",
              "#80BDE1"
            ]
          }
        ],
        labels: productLabels || ["", "", "", "", ""]
      }
    });
  }
};

function calculator(orders) {
  const items = orders.map(order => {
    return order.items;
  });
  const onlyProduct = [].concat(...items);
  const spreadArray = onlyProduct.map(item => {
    return {
      ProductSizeId: item.OrderItem.ProductSizeId,
      quantity: item.OrderItem.quantity,
      ProductName: item.Product.name,
      Size: item.Size.size
    };
  });
  console.log("spreadArray", spreadArray);
  const hash = {};
  let result = [];
  spreadArray.forEach(function(item) {
    var id = item["ProductSizeId"];
    if (hash[id]) {
      hash[id].quantity = hash[id].quantity + item.quantity;
    } else {
      result.push(
        (hash[id] = {
          ...item
        })
      );
    }
  });

  result = result.sort(function(a, b) {
    return a.quantity > b.quantity ? -1 : 1;
  });
  result = result.slice(0, 5);
  const NameAndSize = result.map(item => {
    return `${item.ProductName}(${item.Size})`;
  });

  const quantity = result.map(item => {
    return item.quantity;
  });

  return [NameAndSize, quantity];
}
</script>
<style lang="scss" scoped>
.small {
  width: 100%;
  background: #fff;
  padding: 10px 0px 20px 0px;
  margin: 20px 0px;
  .chart-title {
    text-align: center;
    padding-top: 7px;
    font-size: 14px;
    color: grey;
  }
}
</style>

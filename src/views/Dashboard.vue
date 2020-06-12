<template>
  <div class="product-page">
    <TopBar :page-title="title" :button-type="buttonType" />
    <Spinner v-if="isLoading" />
    <div v-else class="dashboard">
      <div class="total-box">
        <div class="title">累積總營業額</div>
        <div class="number">{{ total }}</div>
      </div>
      <div class="box-wrapper">
        <div class="day-month-box" style="margin-right:20px">
          <div class="title">本日營業額</div>
          <div class="number">{{ today }}</div>
        </div>
        <div class="day-month-box">
          <div class="title">本月營業額</div>
          <div class="number">{{ month }}</div>
        </div>
      </div>

      <PieChart :initial-data="orders" :is-processing="isLoading" />
      <LineChart :initial-data="orders" :is-processing="isLoading" />
    </div>
    <BottomBar :page-name="name" />
  </div>
</template>

<script>
import dashboardAPI from "../apis/dashboard";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";

export default {
  components: { LineChart, PieChart },
  data() {
    return {
      name: "dashboard",
      title: "營收報表",
      isLoading: true,
      buttonType: "",
      orders: [],
      total: 0,
      month: 0,
      today: 0,
      averageOrderAmount: 0
    };
  },
  created() {
    this.fetchProfit();
  },
  methods: {
    async fetchProfit() {
      try {
        const { data, statusText } = await dashboardAPI.getProfit();

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.orders = data;
        this.total = this.calcuTotal(this.orders);
        this.month = this.calcuThisMonth(this.orders);
        this.today = this.calcuToday(this.orders);

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log("error", err);
      }
    },
    calcuTotal(orders) {
      const result = orders
        .map(order => {
          return order.amount;
        })
        .reduce((a, b) => {
          return a + b;
        }, 0);
      return result;
    },
    calcuThisMonth(orders) {
      const result = orders
        .map(order => {
          if (new Date(order.pickup_date).getMonth() === new Date().getMonth())
            return order.amount;
        })
        .reduce((a, b) => {
          return a + b;
        }, 0);
      return result;
    },
    calcuToday(orders) {
      const result = orders
        .map(order => {
          if (new Date(order.pickup_date).getDate() === new Date().getDate())
            return order.amount;
          else return 0;
        })
        .reduce((a, b) => {
          return a + b;
        }, 0);
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");
.dashboard {
  padding: 80px 0px;
  max-width: 700px;
  margin: auto;
  .total-box {
    background-color: #5fd399;
    color: #fff;
    margin: 0px 30px 15px 30px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    .number {
      text-align: end;
      font-size: 32px;
      font-family: "Raleway", sans-serif;
    }
    .title {
      font-weight: 200;
    }
  }
  .box-wrapper {
    display: flex;
    margin: 20px 30px 15px 30px;
    .day-month-box {
      background-color: #fff;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
      width: 100%;
      .number {
        text-align: end;
        font-size: 28px;
        font-family: "Raleway", sans-serif;
      }
      .title {
        font-size: 16px;
        color: grey;
        font-weight: 200;
      }
    }
  }
}
</style>

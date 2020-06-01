<template>
  <div class="customer-orders">
    <TopBar :page-title="title" :button-type="buttonType" />
    <div class="customer-info">
      <div>電話號碼</div>
      <div>{{customer.phone}}</div>
    </div>
    <div>未完成訂單</div>
    <div v-for="order in unfinishOrders" :key="order.id" class="unfinish-order">
      <div class="payment-method">{{order.payment_method}}</div>
      <div>
        <div class="order-time">
          {{ formatDate(order.pickup_date) }}
          {{ formatTime(order.pickup_time) }}
        </div>
        <div class="order-address">{{ order.address}}</div>
      </div>
    </div>
    <div>已完成訂單</div>
    <div class="finish-order">
      <div>訂單編號</div>
      <div>訂單日期</div>
      <div>訂單金額</div>
    </div>
    <div v-for="order in finishOrders" :key="order.id" class="finish-order">
      <div>{{order.id}}</div>
      <div class="order-date">{{ formatDate(order.pickup_date) }}</div>
      <div class="order-address">$ {{ order.amount+order.shipping_fee}}</div>
    </div>
    <BottomBar :page-name="name" />
  </div>
</template>

<script>
import BottomBar from "./../components/BottomBar";
import TopBar from "./../components/TopBar";
import CustomerAPI from "../apis/customers";

export default {
  components: {
    TopBar,
    BottomBar
  },
  data() {
    return {
      name: "customers",
      title: "",
      buttonType: "back",
      customer: "",
      unfinishOrders: [],
      finishOrders: [],
      cancelOrders: []
    };
  },
  created() {
    const { id: customerId } = this.$route.params;
    this.fetchCustomer(customerId);
  },
  beforeRouteUpdate(to, from, next) {
    const { id: customerId } = to.params;
    this.fetchProduct(customerId);
    next();
  },
  methods: {
    async fetchCustomer(customerId) {
      try {
        const { data, statusText } = await CustomerAPI.getCustomer({
          customerId
        });

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.customer = data;
        this.title = data.name;

        data.Orders.forEach(order => {
          if (order.order_status === "unfinish") {
            this.unfinishOrders.push(order);
          } else if (order.order_status === "finish") {
            this.finishOrders.push(order);
          }
        });
        // console.log(this.finishOrders);
        // console.log(this.customer);
      } catch (err) {
        console.log(err);
      }
    },
    formatDate(date) {
      const day = new Date(date);
      const formatYear = day.getFullYear();
      const formatMonth =
        day.getMonth() > 10 ? day.getMonth() : day.getMonth() + 1;
      const formatDate = day.getDate() > 10 ? day.getDate() : day.getDate() + 1;
      return `${formatYear}/${formatMonth}/${formatDate}`;
    },
    formatTime(time) {
      if (time) return time.slice(0, 5);
    }
  }
};
</script>

<style lang="scss" scoped>
$green: #34a94e;
$red: #e23737;
$blue: #17205b;
$black: #252b3c;
$grey: #919191;
$white: #e5e5e5;

.customer-orders {
  height: 100vh;
}

.customer-info {
  background-color: #ffffff;
  margin: 5%;
  padding: 10px;
  display: grid;
  grid-template-columns: 40% 60%;
}

.payment-method {
  color: #34a94e;
  display: grid;
  justify-content: center;
  align-items: center;
}

.order-time {
  color: rgba(0, 0, 0, 0.6);
}
.customer-orders {
  text-align: center;
}

.unfinish-order {
  padding: 15px;
  margin: 2% 0;
  background-color: #ffffff;
  display: grid;
  grid-template-columns: 20% 80%;
}

.finish-order {
  padding: 25px;
  margin-top: 2%;
  background-color: #ffffff;
  display: grid;
  grid-template-columns: 33% 33% 33%;
}
</style>
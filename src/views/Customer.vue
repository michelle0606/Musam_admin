<template>
  <div>
    <TopBar :page-title="title" :button-type="buttonType" />
    <div class="customer-orders">
      <div class="customer-info">
        <div class="ptitle">電話號碼</div>
        <div>{{customer.phone}}</div>
      </div>
      <div class="subtitle">未完成訂單</div>
      <div v-if="unfinishOrders.length===0" class="empty-tip">尚未完成的訂單會出現在這裡。</div>
      <Spinner v-if="isLoading" />
      <div
        v-for="order in unfinishOrders"
        :key="order.id"
        class="unfinish-order"
        @click.stop.prevent="checkoutOrder(order.id)"
      >
        <div class="payment-method">
          <div v-if="order.product_delivery ==='home'">宅配</div>
          <div v-if="order.product_delivery ==='self'">自取</div>
        </div>
        <div>
          <div class="order-time">
            {{ formatDate(order.pickup_date) }}
            {{ formatTime(order.pickup_time) }}
          </div>
          <div class="order-address">{{ order.address}}</div>
        </div>
      </div>
      <div class="subtitle">已完成訂單</div>
      <div v-if="finishOrders.length===0" class="empty-tip">已經完成的訂單會出現在這裡。</div>
      <div v-if="finishOrders.length>0" class="finish-order table-title">
        <div>訂單編號</div>
        <div>訂單日期</div>
        <div>訂單金額</div>
      </div>
      <div
        v-for="order in finishOrders"
        :key="order.id"
        class="finish-order"
        @click.stop.prevent="checkoutOrder(order.id)"
      >
        <div v-if="order.sn">{{order.sn.slice(6, 14)}}</div>
        <div v-else>#{{order.id}}</div>
        <div class="order-date">{{ formatDate(order.pickup_date) }}</div>
        <div>$ {{ order.amount}}</div>
      </div>
      <div class="subtitle">已取消訂單</div>
      <div v-if="cancelOrders.length===0" class="empty-tip">已經取消的訂單會出現在這裡。</div>
      <div v-if="cancelOrders.length>0" class="finish-order table-title">
        <div>訂單編號</div>
        <div>訂單日期</div>
        <div>訂單金額</div>
      </div>
      <div
        v-for="order in cancelOrders"
        :key="order.id"
        class="finish-order"
        @click.stop.prevent="checkoutOrder(order.id)"
      >
        <div v-if="order.sn">{{order.sn.slice(6, 14)}}</div>
        <div v-else>#{{order.id}}</div>
        <div class="order-date">{{ formatDate(order.pickup_date) }}</div>
        <div>$ {{ order.amount}}</div>
      </div>
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
      buttonType: "",
      customer: "",
      unfinishOrders: [],
      finishOrders: [],
      cancelOrders: [],
      isLoading: true
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
          } else if (order.order_status === "cancelled") {
            this.cancelOrders.push(order);
          }
        });
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log(err);
      }
    },
    checkoutOrder(orderId) {
      this.$router.push({ name: "order", params: { id: orderId } });
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
  padding: 80px 0px;
}

.customer-info {
  background-color: #ffffff;
  padding: 7px 10px;
  width: 90%;
  margin: auto;
  border-radius: 5px;
  display: flex;
  .ptitle {
    color: rgba(0, 0, 0, 0.6);
    margin-right: 10px;
  }
}

.payment-method {
  color: #34a94e;
  display: grid;
  justify-content: center;
  align-items: center;
}

.order-time {
  color: rgba(0, 0, 0, 0.6);
  text-align: left;
  padding-left: 10px;
}

.order-address {
  text-align: left;
  padding-left: 10px;
}

.subtitle {
  color: rgba(0, 0, 0, 0.6);
  text-align: left;
  padding-left: 15px;
  margin-top: 20px;
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
  height: 50px;
  align-items: center;
  margin-top: 2%;
  background-color: #ffffff;
  display: grid;
  grid-template-columns: 33% 33% 33%;
}

.empty-tip {
  height: 50px;
  margin-top: 2%;
  background-color: #ffffff;
  padding-left: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.table-title {
  color: rgba(0, 0, 0, 0.6);
}
</style>
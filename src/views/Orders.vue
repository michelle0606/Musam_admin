<template>
  <div class="orders">
    <TopBar :page-title="title" :button-type="buttonType" />
    <div class="datepicker">
      從
      <input type="date" name="start" id="start" :min="start" :value="start" />
      到
      <input type="date" name="end" id="end" :max="end" :value="end" />
    </div>
    <div class="orderOrCount">
      <router-link :to="{ name: 'total-order' }" v-if="state === 'order'"
        >產品數量統計</router-link
      >
      <router-link :to="{ name: 'orders' }" v-if="state === 'count'"
        >瀏覽未完成訂單</router-link
      >
    </div>
    <div class="orders_box" v-if="state === 'order'">
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :initial-order="order"
      />
    </div>
    <div class="total-products" v-if="state === 'count'"></div>

    <BottomBar />
  </div>
</template>

<script>
import BottomBar from './../components/BottomBar'
import TopBar from './../components/TopBar'
import OrderCard from './../components/OrderCard'

const dummyDate = [
  {
    id: '1',
    name: '王小明',
    phone: '0912345678',
    pickup_date: '4/22',
    pickup_time: '11:00',
    product_delivery: 'home'
  },
  {
    id: '2',
    name: '陳小華',
    phone: '0912345678',
    pickup_date: '4/22',
    pickup_time: '14:00',
    product_delivery: 'home'
  },
  {
    id: '3',
    name: '孫小美',
    phone: '0912345678',
    pickup_date: '4/22',
    pickup_time: '17:00',
    product_delivery: 'self'
  }
]

//////// date setting ////////
const today = new Date()
const year = today.getFullYear()
const month =
  today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1
const startDay = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
const endDay =
  today.getDate() + 2 < 10 ? `0${today.getDate() + 2}` : today.getDate() + 2

const formatStartDate = `${year}-${month}-${startDay}`
const formatEndDate = `${year}-${month}-${endDay}`
//////////////////////////////

export default {
  name: 'Orders',
  components: { BottomBar, TopBar, OrderCard },
  data() {
    return {
      title: '未完成訂單',
      buttonType: 'add',
      start: formatStartDate,
      end: formatEndDate,
      state: 'order',
      orders: []
    }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    fetchOrders() {
      this.orders = dummyDate
    }
  }
}
</script>

<style lang="scss" scoped>
$green: #34a94e;
$red: #e23737;
$blue: #17205b;
$black: #252b3c;
$grey: #919191;
$white: #e5e5e5;

.orders {
  position: relative;
  height: 100vh;

  .datepicker {
    background-color: #fff;
    border-radius: 5px;
    padding: 5px;
    font-size: 12px;
    margin: 20px 20px 10px 20px;
  }
  .orderOrCount {
    text-align: right;
    margin: 0px 20px 10px 20px;
    font-size: 16px;
    a {
      color: $blue;
    }
  }
}
</style>

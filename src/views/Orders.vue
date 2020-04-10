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

    <BottomBar :page-name="name" />
  </div>
</template>

<script>
import BottomBar from './../components/BottomBar'
import TopBar from './../components/TopBar'
import OrderCard from './../components/OrderCard'
import orderAPI from '../apis/orders'

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
  name: 'orders',
  components: { BottomBar, TopBar, OrderCard },
  data() {
    return {
      name: this.$options.name,
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
    async fetchOrders() {
      try {
        const response = await orderAPI.getOrders()
        const { data, statusText } = response
        if (statusText !== 'OK') throw new Error(statusText)
        this.orders = data
      } catch (error) {
        console.log('err', error)
      }
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
  .orders_box {
    height: 415px;
    overflow: scroll;
  }
}
</style>

<template>
  <div class="order">
    <div class="top-bar">
      <div>
        <router-link :to="{ name: 'orders' }">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </router-link>
      </div>
      <div class="title">{{ order_info.recipient_name }}</div>
      <div></div>
      <div class="booking_info">
        <button @click.prevent.stop="toggle">訂購人資訊</button>
        <ul v-show="showBooking === true">
          <li>{{ order_info.Customer.name }}</li>
          <li>{{ order_info.Customer.phone }}</li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div class="base-info">
        <div v-if="order_info.product_delivery === 'self'" class="delivery red">
          自取
        </div>
        <div v-else class="delivery green">宅配</div>
        <div class="pickup_date">
          {{ formatDate(order_info.pickup_date) }}
          {{ formatTime(order_info.pickup_time) }}
        </div>
        <div class="phone">{{ order_info.recipient_phone }}</div>
      </div>
      <div v-if="order_info.product_delivery === 'home'" class="address">
        {{ order_info.address }}
      </div>
      <div class="order-status">
        <div
          v-if="order_info.order_status === 'cancelled'"
          class="order_status"
        >
          訂單已取消
        </div>
        <div
          v-if="order_info.order_status === 'unfinish'"
          class="order_status red"
          id="order_status"
          @click.prevent.stop="showWarning"
        >
          訂單未完成
        </div>
        <div
          v-if="order_info.order_status === 'finish'"
          class="order_status green"
        >
          訂單已完成
        </div>
        <div
          v-if="order_info.payment_status === 'unpaid'"
          class="payment_status red"
          id="payment_status"
          @click.prevent.stop="showWarning"
        >
          訂單未付款
        </div>
        <div
          v-if="order_info.payment_status === 'paid'"
          class="payment_status green"
        >
          訂單已付款
        </div>
      </div>
    </div>
    <div class="order-items">
      <table class="order-table">
        <tbody>
          <tr v-for="item in order_info.items" :key="item.OrderItem.id">
            <td>{{ item.OrderItem.quantity }} x</td>
            <td>{{ item.SizeId }} {{ item.Product.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="order_info.order_status === 'cancelled'">
      <div class="note">
        <label for="cancel">訂單取消原因</label>
        <input type="text" :value="order_info.note" disabled />
      </div>
    </div>
    <div v-else>
      <div class="note">
        <label for="cancel">訂單備註</label>
        <input type="text" :value="order_info.note" />
      </div>
      <div class="cancel-order">
        <div>
          <label for="cancel">取消訂單</label>
          <input
            v-model="reason"
            type="text"
            id="cancel"
            placeholder="請輸入原因"
            @input="changeColor"
          />
        </div>
        <div
          class="trash"
          disabled="disabled"
          @click.prevent.stop="cancelOrder(orderId)"
        >
          <font-awesome-icon
            :class="{ red: active === true }"
            :icon="['far', 'trash-alt']"
          />
        </div>
      </div>
    </div>

    <BottomBar :page-name="name" />
    <div class="warning" v-if="warning === true">
      <div class="type-one" v-if="type === 'one'">
        <div>
          請確定這筆訂單的所有品項皆已完成，並且寄出/交貨了，再按下確認鍵，確認後將無法修改。
        </div>
        <div>
          <button @click.prevent.stop="showWarning">返回</button>
          <button @click.prevent.stop="updateOrderStatus(orderId)">確認</button>
        </div>
      </div>
      <div class="type-two" v-if="type === 'two'">
        <div>
          請確定已經收到這筆訂單的款項後，再按下確認鍵，確認後將無法修改。
        </div>
        <div>
          <button @click.prevent.stop="showWarning">返回</button>
          <button @click.prevent.stop="updatePaymentStatus(orderId)">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TopBar from './../components/TopBar'
import BottomBar from './../components/BottomBar'
import orderAPI from '../apis/orders'

export default {
  name: 'order',
  components: { TopBar, BottomBar },
  data() {
    return {
      orderId: -1,
      name: this.$options.name,
      order_info: [],
      showBooking: false,
      warning: false,
      type: '',
      reason: '',
      active: false
    }
  },
  created() {
    this.orderId = this.$route.params.id
    this.fetchOrder()
  },
  methods: {
    async fetchOrder() {
      try {
        const id = this.orderId
        const response = await orderAPI.getOrder(id)
        const { data, statusText } = response
        if (statusText !== 'OK') throw new Error(statusText)
        this.order_info = data.order
      } catch (error) {
        console.log('fetchOrder error', error)
      }
    },
    formatDate(date) {
      const day = new Date(date)
      const formatMonth =
        day.getMonth() > 10 ? day.getMonth() : day.getMonth() + 1
      const formatDate = day.getDate() > 10 ? day.getDate() : day.getDate() + 1
      return `${formatMonth}/${formatDate}`
    },
    formatTime(time) {
      if (time) return time.slice(0, 5)
    },
    toggle() {
      this.showBooking = !this.showBooking
    },
    showWarning() {
      switch (event.target.id) {
        case 'order_status':
          if (this.order_info.payment_status !== 'paid') {
            window.alert('此訂單尚未付款！')
          } else {
            this.warning = !this.warning
            this.type = 'one'
          }

          break
        case 'payment_status':
          this.warning = !this.warning
          this.type = 'two'
          break
      }
    },
    async updateOrderStatus(id) {
      try {
        const formData = {
          id: id,
          order_status: 'finish'
        }
        const response = await orderAPI.updateOrder({ formData })
        const { data, statusText } = response
        if (statusText !== 'OK' || data.status !== 'success')
          throw new Error(statusText)
        this.order_info.order_status = 'finish'
        this.warning = !this.warning
      } catch (error) {
        console.log('updateOrderStatus error', error)
      }
    },
    async updatePaymentStatus(id) {
      try {
        const formData = {
          id: id,
          payment_status: 'paid'
        }
        const response = await orderAPI.updateOrder({ formData })
        const { data, statusText } = response
        if (statusText !== 'OK' || data.status !== 'success')
          throw new Error(statusText)
        this.order_info.order_status = 'paid'
        this.warning = !this.warning
      } catch (error) {
        console.log('updatePaymentStatus error', error)
      }
    },
    async cancelOrder(id) {
      try {
        if (this.reason === '') return
        const formData = {
          id: id,
          note: this.reason,
          order_status: 'cancelled'
        }
        const response = await orderAPI.updateOrder({ id, formData })
        const { data, statusText } = response
        if (statusText !== 'OK' || data.status !== 'success')
          throw new Error(statusText)
      } catch (error) {
        console.log('cancelOrder error', error)
      }
    },
    changeColor() {
      this.active = this.reason === '' ? false : true
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

.order {
  height: 100vh;
  position: relative;
  .top-bar {
    background-color: $black;
    font-weight: 100;
    height: 60px;
    padding: 0px 20px;
    color: $white;
    display: grid;
    grid-template-columns: 40px 70px 1fr 118px;
    .booking_info {
      position: relative;
      button {
        background-color: $black;
        color: #e5e5e5;
        padding: 5px 18px;
        font-size: 16px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
      }
      ul {
        z-index: 100;
        position: absolute;
        background-color: #ffffff;
        color: #000;
        width: 118px;
        top: 48px;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        padding: 7px;
        text-align: center;
      }
    }
    div {
      display: flex;
      align-items: center;
      height: 100%;
      a {
        color: $white;
        margin-right: 10px;
      }
    }
  }
  .container {
    margin: 10px;
    .base-info {
      display: grid;
      grid-template-columns: 65px 100px 1fr;
      grid-template-rows: 40px;
      grid-gap: 8px;
      grid-template-areas: 'delivery pickup_date phone';
      align-items: center;
      .pickup_date {
        color: $grey;
      }
    }
    .address {
      background-color: #fff;
      height: 40px;
      border-radius: 5px;
      font-size: 15px;
      align-items: center;
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }
  }
  .red {
    color: $red;
  }
  .green {
    color: $green;
  }
  .order-status,
  .base-info {
    div {
      background-color: #fff;
      height: 100%;
      align-items: center;
      display: flex;
      justify-content: center;
      border-radius: 5px;
      font-size: 15px;
    }
  }
  .order-status {
    display: flex;
    margin-top: 8px;
    div {
      width: 115px;
      height: 40px;
      margin-right: 8px;
    }
  }
  .order-items {
    background-color: #fff;
    padding: 10px 0px;
    .order-table {
      margin: auto;
      font-size: 16px;
      tbody {
        tr {
          display: block;
          width: 245px;
          overflow: scroll;
          white-space: nowrap;
        }
      }
    }
  }
  .note {
    margin: 10px 0px;
    padding: 7px 15px;
    background-color: #fff;
    justify-content: space-between;
    div {
      input {
        width: 205px;
      }
    }
  }
  .note {
    font-size: 15px;
    color: $grey;
    font-weight: 200;
    label {
      margin-right: 5px;
    }
    input {
      font-size: 14px !important;
      width: 225px;
    }
  }
  .cancel-order {
    display: flex;
    align-items: center;
    padding: 7px 15px;
    background-color: #fff;
    justify-content: space-between;
    div {
      font-size: 15px;
      color: $grey;
      font-weight: 200;
      label {
        margin-right: 5px;
      }
      input {
        font-size: 14px !important;
        width: 205px;
      }
    }
  }
  .warning {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    .type-one,
    .type-two {
      background-color: #fff;
      color: $black;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      width: 250px;
      height: 200px;
      margin: 100px auto;
      padding: 20px;
      font-size: 16px;
      border-radius: 5px;
      div {
        display: flex;
        justify-content: space-between;
        button {
          background-color: $black;
          color: $white;
          border-radius: 5px;
          font-size: 15px;
          width: 70px;
          height: 35px;
        }
      }
    }
  }
}
</style>

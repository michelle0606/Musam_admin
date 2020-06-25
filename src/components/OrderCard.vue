<template>
  <router-link :to="{ name: 'order', params: { id: order.id } }">
    <div class="order">
      <div class="product-delivery">
        <span class="green" v-if="order.product_delivery === 'home'">宅配</span>
        <span class="" v-if="order.product_delivery === 'self'">自取</span>
      </div>
      <div class="order-info">
        <div class="date-and-time">
          <span>{{ formatDate(order.pickup_date) }}</span>
          <span>{{ formatTime(order.pickup_time) }}</span>
        </div>
        <div class="name-and-phone">
          <span>{{ order.recipient_name }}</span>
          <span>{{ order.recipient_phone }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    initialOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      order: this.initialOrder,
    }
  },
  methods: {
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
  },
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
  background-color: #fff;
  display: grid;
  grid-template-columns: 70px 1fr;
  grid-template-rows: 70px;
  margin-bottom: 10px;
  font-size: 16px;

  .product-delivery {
    margin: auto;
  }
  .order-info {
    margin: auto 0px;
    letter-spacing: 1px;
    .date-and-time {
      color: $grey;
    }
    .name-and-phone {
      color: #000000;
      font-weight: 200;
      width: 224px;
      white-space: nowrap;
      overflow: scroll;
    }
    div {
      span {
        &:nth-child(1) {
          margin-right: 10px;
        }
      }
    }
  }
}

.green {
  color: $green;
}
.red {
  color: $red;
}
</style>

<template>
  <router-link :to="{ name: 'order', params: { id: order.id } }">
    <div class="order">
      <div class="product-delivery">
        <span class="green" v-if="order.product_delivery === 'home'">宅配</span>
        <span class="red" v-if="order.product_delivery === 'self'">自取</span>
      </div>
      <div class="order-info">
        <div class="date-and-time">
          <span>{{ order.pickup_date }}</span>
          <span>{{ order.pickup_time }}</span>
        </div>
        <div class="name-and-phone">
          <span>{{ order.name }}</span>
          <span>{{ order.phone }}</span>
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
      required: true
    }
  },
  data() {
    return {
      order: this.initialOrder
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

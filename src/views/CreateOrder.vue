<template>
  <div class="create-order">
    <TopBar :page-title="title" :button-type="buttonType" />
    <form @submit.prevent.stop="handleSubmit">
      <div class="wrapper">
        <div v-show="step === 'one'">
          <div class="customer-info">
            <div class="form-title">訂購人</div>
            <div>
              <input
                v-model="booking_name"
                type="text"
                name="booking_name"
                placeholder="輸入姓名"
              />
            </div>
            <div>
              <input
                v-model="booking_phone"
                type="text"
                name="booking_phone"
                placeholder="輸入電話號碼"
              />
            </div>
          </div>
          <div class="recipient-info">
            <div class="form-title">收件人</div>
            <div>
              <input
                v-model="recipient_name"
                type="text"
                name="recipient_name"
                placeholder="輸入姓名"
              />
            </div>
            <div>
              <input
                v-model="recipient_phone"
                type="text"
                name="recipient_phone"
                placeholder="輸入電話號碼"
              />
            </div>
            <div class="form-title">選擇取貨日期與時間</div>
            <div class="calender-wrapper">
              <font-awesome-icon
                :icon="['fas', 'calendar-alt']"
                class="calender"
              />
              <input
                v-model="pickup_date"
                type="date"
                name="pickup_date"
                id="date"
                class="date"
                value=""
              />
            </div>
            <div class="calender-wrapper">
              <font-awesome-icon :icon="['fas', 'clock']" class="calender" />
              <input
                v-model="pickup_time"
                type="time"
                name="pickup_time"
                id="time"
                class="time"
                value="14:00"
              />
            </div>
          </div>
          <div class="product-delivery">
            <div
              v-if="product_delivery === 'self'"
              class="self deliver-type"
              @click.stop.prevent="changeProductDelivery"
            >
              自取
            </div>
            <div
              v-if="product_delivery === 'home'"
              class="home deliver-type"
              @click.stop.prevent="changeProductDelivery"
            >
              宅配
            </div>
            <div v-show="product_delivery === 'home'">
              <input
                v-model="address"
                type="text"
                name="address"
                class="address"
                placeholder="輸入地址"
              />
            </div>
          </div>
          <div class="next">
            <div @click.stop.prevent="goToNextStep">下一步</div>
          </div>
        </div>
      </div>
      <div v-show="step === 'two'">
        <div class="keyin-area">
          <input
            @input="findMatch"
            :value="inputValue"
            type="text"
            placeholder="輸入商品名稱"
          />
          <ul v-if="matchProducts.length > 0 && inputValue !== ''">
            <li
              v-for="product in matchProducts"
              :key="product.id"
              @click="addProduct(product.id)"
            >
              {{ product.name }}
            </li>
          </ul>
        </div>
        <div class="showup-area">
          <table class="order-table">
            <thead>
              <th class="container"><div>名稱</div></th>
              <th class="container"><div>尺寸</div></th>
              <th class="container"><div>數量</div></th>
              <th class="container"><div>單價</div></th>
            </thead>
            <tbody>
              <tr v-for="orderProduct in orderProducts" :key="orderProduct.id">
                <td class="product-name">{{ orderProduct[0].name }}</td>
                <td class="product-size">
                  <select
                    @change="handleSizeChange($event, orderProduct.orderId)"
                    v-model="orderProduct.chosenSize"
                  >
                    <option
                      v-for="size in orderProduct[0].sizes"
                      :value="size.id"
                      :key="size.ProductSize.id"
                      >{{ size.size }}</option
                    >
                  </select>
                </td>
                <td class="product-quantity">
                  <input
                    type="number"
                    :value="orderProduct.quantity"
                    min="1"
                    @input="handleQuantityChange($event, orderProduct.orderId)"
                  />
                </td>
                <td class="product-price">
                  {{
                    orderProduct[0].sizes[orderProduct.chosenSize - 1]
                      .ProductSize.price
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="note-area">
          <input
            type="text"
            name="note"
            v-model="note"
            placeholder="訂單備註"
          />
        </div>
        <div class="btn-group">
          <div class="last">
            <div @click.stop.prevent="goToNextStep">上一步</div>
          </div>
          <div class="create-button">
            <button :disabled="isProcessing" type="submit">
              成立訂單
            </button>
          </div>
        </div>
      </div>
    </form>
    <BottomBar :page-name="name" />
  </div>
</template>
<script>
import TopBar from './../components/TopBar'
import BottomBar from './../components/BottomBar'
import productAPI from '../apis/products'
import orderAPI from '../apis/orders'
import { Toast } from './../utils/helpers'

const today = new Date()
const year = today.getFullYear()
const month =
  today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1
const defaultDay =
  today.getDate() + 1 < 10 ? `0${today.getDate() + 1}` : today.getDate() + 1
const formatDate = `${year}-${month}-${defaultDay}`

export default {
  name: 'create-order',
  components: { TopBar, BottomBar },
  data() {
    return {
      name: this.$options.name,
      title: '新增訂單',
      buttonType: 'back',
      step: 'one',
      products: [],
      inputValue: '',
      matchProducts: [],
      ///// order info /////
      booking_name: '',
      booking_phone: '',
      recipient_name: '',
      recipient_phone: '',
      address: '',
      note: '',
      pickup_date: formatDate,
      pickup_time: '14:00',
      product_delivery: 'self',
      orderProducts: [],
      amount: 0,
      shipping_fee: 160,
      //////////////////////
      isProcessing: false
    }
  },
  created() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await productAPI.getProducts()
        const { data, statusText } = response
        if (statusText !== 'OK') throw new Error(statusText)
        this.products = data
      } catch (error) {
        console.log('err', error)
      }
    },
    goToNextStep() {
      this.step === 'two' ? (this.step = 'one') : (this.step = 'two')
    },
    changeProductDelivery() {
      this.product_delivery === 'home'
        ? (this.product_delivery = 'self')
        : (this.product_delivery = 'home')
    },
    findMatch() {
      this.inputValue = event.target.value
      this.matchProducts = this.products.filter(product => {
        return product.name.match(this.inputValue)
      })
    },
    addProduct(productId) {
      this.inputValue = ''
      this.matchProducts = []
      let orderProduct = this.products.filter(product => {
        return product.id == productId
      })

      this.orderProducts.push({
        ...orderProduct,
        orderId: this.orderProducts.length,
        quantity: 1,
        chosenSize: '1'
      })
    },
    handleSizeChange(event, target_id) {
      this.orderProducts.filter(item => {
        if (item.orderId == target_id) {
          return (item.chosenSize = event.target.value)
        }
      })
    },
    handleQuantityChange(event, target_id) {
      this.orderProducts.filter(item => {
        if (item.orderId == target_id) {
          return (item.quantity = event.target.value)
        }
      })
    },
    async handleSubmit(e) {
      try {
        const perOrderItemTotal = this.orderProducts.map(
          product =>
            product[0].sizes[product.chosenSize - 1].ProductSize.price *
            Number(product.quantity)
        )
        this.amount = perOrderItemTotal.reduce((a, b) => a + b)

        if (this.amount <= 1500) {
          this.shipping_fee = 160
        } else if (this.amount > 1500 && this.amount < 3000) {
          this.shipping_fee = 225
        } else {
          this.shipping_fee = 0
        }

        const orderItems = this.orderProducts.map(item => {
          const sizeIndex = item[0].sizes.filter(s => {
            return s.id == item.chosenSize
          })
          return {
            ProductSizeId: sizeIndex[0].ProductSize.id,
            quantity: item.quantity
          }
        })
        if (
          !this.recipient_name ||
          !this.recipient_phone ||
          !this.pickup_date ||
          !this.pickup_time ||
          !this.booking_name ||
          !this.booking_phone ||
          (this.product_delivery === 'home' && !this.address) ||
          this.orderProducts.length < 1
        ) {
          Toast.fire({
            type: 'warning',
            title: '訂單的所有資訊皆是必填。'
          })
          return
        }
        this.isProcessing = true
        const formData = {
          booking_name: this.booking_name,
          booking_phone: this.booking_phone,
          recipient_name: this.recipient_name,
          recipient_phone: this.recipient_phone,
          pickup_date: this.pickup_date,
          pickup_time: this.pickup_time,
          product_delivery: this.product_delivery,
          order_items: orderItems,
          shipping_fee: this.shipping_fee,
          amount: this.amount,
          address: this.address,
          note: this.note
        }
        const response = await orderAPI.postOrder({ formData })
        const { data, statusText } = response
        if (statusText !== 'OK' || data.status !== 'success')
          throw new Error(statusText)
        this.$router.push({ name: 'order', params: { id: data.orderId } })
      } catch (error) {
        console.log('error', error)
        this.isProcessing = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$bgColor: #ebf3f5;
$green: #5fd399;
$red: #e23737;
$blue: #17205b;
$black: #252b3c;
$grey: #5e6162;
$white: #e5e5e5;

button:disabled,
button[disabled] {
  background-color: rgba(23, 27, 38, 0.82);
  color: #666666;
}

th.container > div {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
th.container {
  height: 32px;
}

td {
  select {
    font-size: 16px;
    background: none;
  }
  input {
    font-size: 16px;
    width: 30px;
    text-align: right;
  }
}

.product-name {
  width: 80px;
  white-space: nowrap;
  display: block;
  overflow: scroll;
}

.create-order {
  position: relative;
  height: 100vh;
  .wrapper {
    padding: 10px 50px;
    .customer-info,
    .recipient-info {
      .form-title {
        font-size: 16px;
        color: $grey;
        margin-top: 10px;
      }
      div {
        margin-bottom: 10px;
      }
    }
    input {
      width: 100%;
      border-radius: 5px;
      padding: 5px 15px;
      font-size: 16px;
    }
  }
  .keyin-area,
  .note-area {
    input {
      width: 100%;
      padding: 8px 15px;
      font-size: 14px;
    }
    ul {
      position: absolute;
      width: 100%;
      z-index: 100;
      background-color: $black;
      color: $white;
      padding: 5px;
      li {
        font-weight: 100;
        padding: 2px 10px;
      }
    }
  }
  .showup-area {
    .order-table {
      width: 100%;
      font-weight: 200;
      padding: 10px 15px;
      thead {
        th {
          font-weight: 200;
          color: $grey;
          text-align: inherit;
        }
      }
      td:nth(3) {
        text-align: right;
      }
    }
  }
}
.showup-area {
  height: 300px;
  background-color: #ffffff;
  margin: 10px 0px;
}
.calender-wrapper {
  position: relative;
  svg {
    position: absolute;
    z-index: 10;
    top: 8px;
    left: 15px;
    color: $grey;
  }
  input {
    padding: 5px 38px !important;
    color: $grey;
  }
}

.deliver-type {
  width: 65px;
  height: 34px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.self {
  color: $red;
}

.home {
  color: $green;
}

.next {
  display: flex;
  justify-content: flex-end;
}

.next > div,
.last > div {
  width: 80px;
  height: 35px;
  background-color: #5fd399;
  color: #ffffff;
  border-radius: 5px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-group {
  display: flex;
  padding: 0px 15px;
  justify-content: space-between;
  margin-top: 20px;
  .create-button {
    button {
      background-color: $black;
      color: $white;
      border-radius: 5px;
      font-size: 15px;
      width: 90px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.address {
  margin-bottom: 10px;
}
</style>

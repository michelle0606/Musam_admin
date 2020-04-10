<template>
  <div class="create-order">
    <TopBar :page-title="title" :button-type="buttonType" />
    <form action="" method="post">
      <div class="wrapper">
        <div v-show="step === 'one'">
          <div class="customer-info">
            <div class="form-title">訂購人</div>
            <div>
              <input type="text" placeholder="輸入姓名" />
            </div>
            <div>
              <input type="text" placeholder="輸入電話號碼" />
            </div>
          </div>
          <div class="recipient-info">
            <div class="form-title">收件人</div>
            <div>
              <input type="text" placeholder="輸入姓名" />
            </div>
            <div>
              <input type="text" placeholder="輸入電話號碼" />
            </div>
            <div class="form-title">選擇取貨日期與時間</div>
            <div class="calender-wrapper">
              <font-awesome-icon
                :icon="['fas', 'calendar-alt']"
                class="calender"
              />
              <input type="date" name="date" id="date" class="date" />
            </div>
            <div class="calender-wrapper">
              <font-awesome-icon :icon="['fas', 'clock']" class="calender" />
              <input type="time" name="time" id="time" class="time" />
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
                <td class="product-name">{{ orderProduct.name }}</td>
                <td class="product-size">
                  <select name="" :id="orderProduct.id">
                    <option
                      v-for="size in orderProduct.sizes"
                      value="7cm"
                      :key="size.ProductSize.id"
                      >{{ size.size }}</option
                    >
                  </select>
                </td>
                <td class="product-quantity">
                  <input type="number" name="" id="" min="1" value="1" />
                </td>
                <td class="product-price">80</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="note-area">
          <input type="text" placeholder="訂單備註" />
        </div>
        <div class="btn-group">
          <div class="last">
            <div @click.stop.prevent="goToNextStep">上一步</div>
          </div>
          <div class="create-button">
            <div @click.stop.prevent="goToNextStep">成立訂單</div>
          </div>
        </div>
      </div>
    </form>
    <BottomBar />
  </div>
</template>
<script>
import TopBar from './../components/TopBar'
import BottomBar from './../components/BottomBar'
import productsAPI from '../apis/products'

export default {
  name: 'create-order',
  components: { TopBar, BottomBar },
  data() {
    return {
      title: '新增訂單',
      buttonType: 'back',
      step: 'one',
      products: [],
      inputValue: '',
      matchProducts: [],
      customer_name: '',
      customer_phone: '',
      recipient_name: '',
      recipient_phone: '',
      address: '',
      note: '',
      pickup_time: '',
      product_delivery: 'self',
      orderProducts: []
    }
  },
  created() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await productsAPI.getProducts()
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
      this.orderProducts.push(...orderProduct)
    }
  }
}
</script>
<style lang="scss" scoped>
$bgColor: #ebf3f5;
$green: #34a94e;
$red: #e23737;
$blue: #17205b;
$black: #252b3c;
$grey: #5e6162;
$white: #e5e5e5;

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
    div {
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

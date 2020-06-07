<template>
  <div class="orders">
    <TopBar :page-title="title" :button-type="buttonType" />
    <form class="datepicker">
      從
      <input
        type="date"
        name="startDate"
        id="start"
        :min="start"
        :value="start"
        @input="handleDateChange"
      />
      到
      <input
        type="date"
        name="endDate"
        id="end"
        :max="end"
        :value="end"
        @input="handleDateChange"
      />
    </form>
    <Spinner v-if="isLoading" />
    <div class="orderOrCount" v-else>
      <div v-if="state === 'order'" @click.stop.prevent="state = 'count'">產品數量統計</div>
      <div v-if="state === 'count'" @click.stop.prevent="state = 'order'">瀏覽未完成訂單</div>
    </div>
    <div class="orders_box" v-if="state === 'order'">
      <OrderCard v-for="order in orders" :key="order.id" :initial-order="order" />
      <div class="feedback" v-if="orders.length < 1">此區間目前無任何未完成訂單。</div>
    </div>
    <div class="total-products" v-if="state === 'count'">
      <div class="order-items">
        <table class="order-table">
          <tbody>
            <tr v-for="item in result" :key="item.ProductSizeId">
              <td>{{ item.quantity }} x</td>
              <td>{{ item.size }} {{ item.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <BottomBar :page-name="name" />
  </div>
</template>

<script>
import OrderCard from "./../components/OrderCard";
import orderAPI from "../apis/orders";
import { Toast } from "./../utils/helpers";

//////// date setting ////////
const today = new Date();
const year = today.getFullYear();
const month =
  today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
const startDay = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
const endDay =
  today.getDate() + 2 < 10 ? `0${today.getDate() + 2}` : today.getDate() + 2;

const formatStartDate = `${year}-${month}-${startDay}`;
const formatEndDate = `${year}-${month}-${endDay}`;
//////////////////////////////

export default {
  name: "orders",
  components: { OrderCard },
  data() {
    return {
      name: this.$options.name,
      title: "未完成訂單",
      buttonType: "add",
      start: formatStartDate,
      end: formatEndDate,
      state: "order",
      orders: [],
      isLoading: true,
      result: []
    };
  },
  created() {
    this.handleDateChange();
  },
  methods: {
    async handleDateChange(e) {
      try {
        if (e) {
          this.isLoading = true;
          const targetName = e.target.name;
          const targetValue = e.target.value;
          switch (targetName) {
            case "startDate":
              this.start = targetValue;
              break;
            case "endDate":
              this.end = targetValue;
              break;
          }
        }

        const ordersDate = {
          startDate: this.start,
          endDate: this.end
        };
        const response = await orderAPI.getOrders({ ordersDate });
        const { data, statusText } = response;
        if (statusText !== "OK") throw new Error(statusText);
        this.orders = data;
        this.isLoading = false;
        this.calculator();
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          type: "error",
          title: "無法取得訂單資訊，請稍後再試"
        });
      }
    },
    calculator() {
      const newArr = [];

      const targetData = this.orders.forEach(order => {
        newArr.push(order.items);
      });
      const concatArr = newArr.reduce(function(a, b) {
        return a.concat(b);
      }, []);

      const mapArr = concatArr.map(item => {
        return {
          ProductSizeId: item.OrderItem.ProductSizeId,
          name: item.Product.name,
          size: item.Size.size,
          quantity: item.OrderItem.quantity
        };
      });

      const hash = {};
      const result = [];
      mapArr.forEach(function(item) {
        var id = item["ProductSizeId"];
        if (hash[id]) {
          hash[id].quantity = hash[id].quantity + item.quantity;
        } else {
          result.push(
            (hash[id] = {
              ...item
            })
          );
        }
      });
      this.result = result;
    }
  }
};
</script>

<style lang="scss" scoped>
$green: #5fd399;
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
    .feedback {
      padding: 10px;
      text-align: center;
      font-weight: 200;
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
}
</style>

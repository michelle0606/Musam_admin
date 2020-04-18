<template>
  <div class="product-create">
    <TopBar :page-title="title" :button-type="buttonType" />
    <div class="product">
      <div class="product-image">
        <label for="pic">
          <font-awesome-icon :icon="['fa', 'image']" class="icon" />
          <div>
            <span>上傳圖片</span>
          </div>
          <input type="file" id="pic" class="file" />
        </label>
      </div>
      <div class="product-name">
        <input type="text" placeholder="商品名稱" class="name" />
      </div>
      <div class="product-price">
        <div class="sale-price">
          <span>商品售價</span>
        </div>

        <div class="size">
          <div class="form-input">
            <label for="s" class="label">7cm</label> |
            <input type="text" id="s" placeholder="請輸入" class="input" />
          </div>
          <div class="form-input">
            <label for="m" class="label">6吋</label> |
            <input type="text" id="m" placeholder="請輸入" class="input" />
          </div>
          <div class="form-input">
            <label for="l" class="label">8吋</label> |
            <input type="text" id="l" placeholder="請輸入" class="input" />
          </div>
        </div>
      </div>
      <div>
        <textarea placeholder="請在100字內描述商品特色" class="product-description" rows="5" />
      </div>
      <div class="create-button">
        <div @click.stop.prevent="goToNextStep">上架商品</div>
      </div>
    </div>
    <BottomBar :page-name="name" />
  </div>
</template>

<script>
import BottomBar from "./../components/BottomBar";
import TopBar from "./../components/TopBar";
import ProductAPI from "../apis/products";

export default {
  components: { BottomBar, TopBar },

  data() {
    return {
      name: "products",
      title: "新增商品",
      buttonType: "add"
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProduct(req, res) {
      try {
        const { data, statusText } = await ProductAPI.createProduct();

        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        this.products = data;
      } catch (error) {
        console.log("err", error);
      }
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

.product-create {
  height: 100vh;
  text-align: center;
  color: $grey;

  .product-image {
    padding: 10px;
    margin: 5% auto;
    background-color: #ffffff;
    width: 150px;
    height: 150px;
    .icon {
      font-size: 100px;
    }

    .file {
      display: none;
    }
  }

  .product {
    width: 100%;
    margin: 0 auto;
  }
  .product-name {
    .name {
      text-align: center;
      padding: 5%;
      height: 10%;
      width: 100%;
      font-size: 100%;
    }
  }

  .product-price {
    margin: 5% 10%;
    background-color: #ffffff;

    .sale-price {
      padding: 3%;
      font-size: 19px;
    }

    .form-input {
      padding: 3%;
      display: grid;
      grid-template-columns: 49% 2% 49%;

      .label {
        font-size: 20px;
        padding-right: 3%;
        text-align: right;
      }
      .input {
        padding-left: 3%;
        font-size: 20px;
      }
    }
  }

  .product-description {
    resize: none;
    text-align: center;
    padding: 3%;
    font-size: 100%;
    width: 100%;
  }
  .create-button {
    div {
      background-color: #5fd399;
      color: $white;
      border-radius: 5px;
      font-size: 16px;
      width: 100px;
      height: 40px;
      margin: 15px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }
  }
}
</style>

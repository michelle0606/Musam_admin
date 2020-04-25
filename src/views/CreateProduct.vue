<template>
  <div class="product-create">
    <TopBar :page-title="title" :button-type="buttonType" />
    <div class="product">
      <div class="product-image">
        <label for="pic">
          <div v-if="image" class="image">
            <img :src="image" width="100%" />
          </div>
          <div v-else>
            <font-awesome-icon :icon="['fa', 'image']" class="icon" />
            <div>
              <span>上傳圖片</span>
            </div>
          </div>
          <input type="file" id="pic" class="file" @change="fileSelected" />
        </label>
      </div>
      <div class="product-name">
        <input type="text" v-model="name" placeholder="商品名稱" class="name" />
      </div>
      <div class="product-price">
        <div class="sale-price">
          <span>商品售價</span>
        </div>

        <div class="size">
          <!-- <div class="form-input">
            <div class="select">
              <select name="select-list" @change="selectSize($event)" class="select-list">
                <option value disabled selected>選擇大小</option>
                <option v-for="size in sizes" :key="size.id" :value="size.id">{{size.size}}</option>
              </select>
            </div>|
            <input type="text" id="s" placeholder="請輸入金額" class="input" />
          </div>-->
          <div v-for="data in sizeInputArray" :key="data.index">
            <div class="form-input">
              <div class="select">
                <select
                  name="select-list"
                  @change="selectSize($event)"
                  class="select-list"
                  :data-index="data.index"
                >
                  <option value disabled selected>選擇大小</option>
                  <option v-for="size in data.sizes" :key="size.id" :value="size.id">{{size.size}}</option>
                </select>
              </div>|
              <input type="text" placeholder="請輸入金額" class="input" />
            </div>
          </div>
          <div>
            <font-awesome-icon :icon="['fa', 'plus-circle']" class="icon" @click="addSize" />
          </div>
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
    <!-- <BottomBar :page-name="name" /> -->
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
      sizeRawData: [],
      sizes: [],
      selectArray: [],
      sizeInputCount: 0,
      sizeInputArray: [],
      key: "請選擇",
      name: "",
      title: "新增商品",
      buttonType: "add",
      image: ""
    };
  },
  created() {
    this.fetchSizes();
  },
  methods: {
    async fetchSizes(req, res) {
      try {
        const { data, statusText } = await ProductAPI.getSizes();

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.sizes = data;
        this.sizeRawData = data;
      } catch (error) {
        console.log("err", error);
      }
    },
    fileSelected(event) {
      const file = event.target.files.item(0);
      const reader = new FileReader();
      reader.addEventListener("load", e => {
        this.image = e.target.result;
      });
      reader.readAsDataURL(file);
    },
    selectSize(event) {
      const selectId = Number(event.currentTarget.dataset.index);
      const selectValue = Number(event.currentTarget.value);
      let beChangeValue = 0;

      //record every select zone's option value
      this.selectArray = this.selectArray.map(select => {
        const singleSelectId = Number(select.selectId);
        if (singleSelectId !== selectId) {
          return (select = {
            ...select
          });
        } else {
          this.sizes = this.sizes.filter(size => {
            if (size.id !== selectValue) {
              return size;
            }
          });
          //original value must be record and return to every select zone's options
          beChangeValue = select.selectSizeId;

          if (beChangeValue !== 0) {
            this.sizes.push(
              ...this.sizeRawData.filter(size =>
                Number(size.id) === Number(beChangeValue) ? size : false
              )
            );
          }
          return (select = {
            ...select,
            selectId: selectId,
            selectSizeId: Number(selectValue)
          });
        }
      });

      //Size array filter
      this.sizeInputArray = this.sizeInputArray.map(input => {
        //change other select zone's size options
        if (Number(input.index) !== selectId) {
          const filter = input.sizes.filter(size => {
            if (size.id !== selectValue) {
              return size;
            }
          });

          if (beChangeValue !== 0) {
            filter.push(
              ...this.sizeRawData.filter(size =>
                Number(size.id) === Number(beChangeValue) ? size : false
              )
            );
          }

          return (input = {
            ...input,
            sizes: filter
          });
        }

        return (input = {
          ...input
        });
      });
    },
    addSize() {
      this.sizeInputCount = this.sizeInputCount + 1;

      //original version
      this.sizeInputArray.push({
        index: this.sizeInputCount,
        sizes: this.sizes
      });

      this.selectArray.push({
        selectId: this.sizeInputCount,
        selectSizeId: 0
      });
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

    .image {
      height: 100%;
      display: flex;
      align-items: center;
    }

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

    .icon {
      font-size: 35px;
    }

    .sale-price {
      padding: 3%;
      font-size: 19px;
    }

    .form-input {
      padding: 3%;
      display: grid;
      grid-template-columns: 49% 2% 49%;

      .select {
        text-align: right;
        width: 100%;
        padding-right: 10px;
        font-size: 20px;
      }

      .select-list {
        font-size: 18px;
        color: $grey;
      }

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

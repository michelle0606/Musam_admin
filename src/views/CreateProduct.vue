<template>
  <div class="product-create">
    <TopBar :page-title="title" :button-type="buttonType" />

    <div class="product">
      <div class="product-image">
        <div class="image-square">
          <label for="pic">
            <div class="image">
              <div>
                <font-awesome-icon :icon="['fa', 'plus-circle']" class="icon" />
                <div>
                  <span>新增圖片</span>
                </div>
              </div>
            </div>
            <div>
              <input
                type="file"
                name="image"
                id="pic"
                class="file"
                @change="fileSelected"
                multiple="multiple"
              />
            </div>
          </label>
        </div>
        <div v-for="(image,index) in images" :key="index">
          <div v-if="index === mainPicIndex" class="image-square select-main-pic">
            <p
              :icon="['fa', 'times-circle']"
              class="x-icon"
              @click="deleteImage"
              :data-index="index"
            >☒</p>

            <div class="image" @click="setMainPic">
              <img :src="image" width="100%" :data-index="index" />
            </div>
          </div>
          <div v-else class="image-square">
            <p
              :icon="['fa', 'times-circle']"
              class="x-icon"
              @click="deleteImage"
              :data-index="index"
            >☒</p>

            <div class="image" @click="setMainPic">
              <img :src="image" width="100%" :data-index="index" />
            </div>

          </div>
        </div>
      </div>
      <div class="product-name">
        <input type="text" name="name" v-model="name" placeholder="商品名稱" class="name" />
      </div>
      <div class="product-price">
        <div class="sale-price">
          <span>商品售價</span>
        </div>

        <div class="size">
          <div v-for="(data,index) in sizeInputArray" :key="index">
            <div class="form-input">
              <div class="select">
                <select
                  name="select-list"
                  @change="selectSize($event)"
                  class="select-list"
                  :data-index="data.index"
                  :value="selectArray[index].selectSizeId"
                >
                  <option value="0" disabled selected>選擇大小</option>
                  <option v-for="size in data.sizes" :key="size.id" :value="size.id">{{size.size}}</option>
                </select>
              </div>|
              <input
                type="number"
                name="price"
                placeholder="請輸入金額"
                class="input"
                @input="input($event)"
                :data-index="data.index"
                :value="sizeInputArray[index].price"
              />
              <span>元</span>

            </div>
          </div>
          <div>
            <font-awesome-icon :icon="['fa', 'plus-circle']" class="icon" @click="addSize" />
          </div>
        </div>
      </div>
      <div>
        <textarea
          placeholder="請在100字內描述商品特色"
          name="description"
          class="product-description"
          rows="5"
          v-model="description"
        />
      </div>
      <div>
        <div v-if="productId" class="product-bottom-bar">
          <div class="create-button" @click="edit">確定編輯</div>

          <div
            v-if="status === 'on'"
            class="status-change-button"
            @click="statusChange(productId)"
          >下架商品</div>
          <div v-else @click="statusChange(productId)" class="status-change-button">上架商品</div>
        </div>

        <div v-else @click="submit" class="create-button">上架商品</div>
      </div>
      <BottomBar :page-name="PageName" />
    </div>
  </div>
</template>

<script>
import BottomBar from "./../components/BottomBar";
import TopBar from "./../components/TopBar";
import ProductAPI from "../apis/products";
import { Toast } from "./../utils/helpers";


export default {
  data() {
    return {
      PageName: "新增商品",
      sizeRawData: [],
      sizes: [],
      selectArray: [],
      sizeInputCount: 0,
      sizeInputArray: [],
      key: "請選擇",
      name: "",
      title: "新增商品",
      buttonType: "back",
      image: "",
      description: "",
      formData: new FormData(),
      images: [],
      fileArray: [],
      mainPicIndex: 0,
      delete: []
    };
  },
  created() {
    this.fetchSizes()
    if (Number(this.$route.params.id) > 0) {
      const { id: productId } = this.$route.params
      this.fetchProduct(productId)
    }
  },
  beforeRouteUpdate(to, from, next) {
    const { id: productId } = to.params
    this.fetchProduct(productId)
    next()
  },
  methods: {
    async fetchSizes() {
      try {
        const { data, statusText } = await ProductAPI.getSizes()

        if (statusText !== 'OK') {
          throw new Error(statusText)
        }
        this.sizes = data
        this.sizeRawData = data
      } catch (error) {
        console.log('err', error)
      }
    },
    fileSelected(event) {

      //immediately show image
      for (let i = 0; i < event.target.files.length; i++) {
        this.fileArray.push(event.target.files[i]);
        const file = event.target.files.item(i);
        const reader = new FileReader();
        reader.addEventListener("load", e => {
          this.images.push(e.target.result);
        });
        reader.readAsDataURL(file);
      }
    },
    selectSize(event) {
      const selectId = Number(event.currentTarget.dataset.index)
      const selectValue = Number(event.currentTarget.value)
      let beChangeValue = 0

      //record every select zone's option value
      this.selectArray = this.selectArray.map((select) => {
        const singleSelectId = Number(select.selectId)
        if (singleSelectId !== selectId) {
          return (select = {
            ...select,
          })
        } else {
          this.sizes = this.sizes.filter((size) => {
            if (size.id !== selectValue) {
              return size
            }
          })
          //original value must be record and return to every select zone's options
          beChangeValue = select.selectSizeId

          if (beChangeValue !== 0) {
            this.sizes.push(
              ...this.sizeRawData.filter((size) =>
                Number(size.id) === Number(beChangeValue) ? size : false
              )
            )
          }
          return (select = {
            ...select,
            selectId: selectId,
            selectSizeId: Number(selectValue),
          })
        }
      })

      //Size array filter
      this.sizeInputArray = this.sizeInputArray.map((input) => {
        //change other select zone's size options
        if (Number(input.index) !== selectId) {
          const filter = input.sizes.filter((size) => {
            if (size.id !== selectValue) {
              return size
            }
          })

          if (beChangeValue !== 0) {
            filter.push(
              ...this.sizeRawData.filter((size) =>
                Number(size.id) === Number(beChangeValue) ? size : false
              )
            )
          }

          return (input = {
            ...input,
            sizes: filter,
          })
        }

        return (input = {
          ...input,
        })
      })
    },
    addSize() {
      this.sizeInputCount = this.sizeInputCount + 1

      //original version
      this.sizeInputArray.push({
        index: this.sizeInputCount,
        sizes: this.sizes,
        price: '',
      })

      this.selectArray.push({
        selectId: this.sizeInputCount,
        selectSizeId: 0,

        price: ""
      });

      })

    },
    input(event) {
      const selectIndexInArray = event.currentTarget.dataset.index - 1

      this.selectArray[selectIndexInArray].price = event.currentTarget.value;
      this.sizeInputArray[selectIndexInArray].price = event.currentTarget.value;
    },
    deleteImage(e) {
      const deleteIndex = Number(e.target.dataset.index);
      this.mainPicIndex = 0;
      this.delete.push(this.images[deleteIndex]);
      this.fileArray.splice(deleteIndex, 1);
      this.images.splice(deleteIndex, 1);
    },
    setMainPic(e) {
      this.mainPicIndex = Number(e.target.dataset.index);
    },
    async submit(e) {
      try {
        if (this.fileArray.length === 0) {
          Toast.fire({
            type: "warning",
            title: "請新增至少一張圖片"
          });
          return;
        }
        if (!this.name) {
          Toast.fire({
            type: "warning",
            title: "請輸入商品名稱"
          });
          return;
        }
        if (this.selectArray.length === 0) {
          Toast.fire({
            type: "warning",
            title: "請新增至少一個商品售價"
          });
          return;
        }

        this.selectArray.forEach(a => {
          if (a.selectSizeId === 0) {
            Toast.fire({
              type: "warning",
              title: "請選擇大小"
            });
            return;
          }
          if (!a.price) {
            Toast.fire({
              type: "warning",
              title: "請輸入金額"
            });
            return;
          }

          const json = JSON.stringify(a);
          this.formData.append("sizeArray", json);
        });

        this.fileArray.forEach(file => {
          this.formData.append("image", file);
        });

        this.formData.append("name", this.name);
        this.formData.append("description", this.description);
        this.formData.append("status", "on");
        this.formData.append("mainPicIndex", this.mainPicIndex);

        const { data, statusText } = await ProductAPI.createProduct(
          this.formData
        );

    

        if (data.status !== 'success' || statusText !== 'OK') {
          throw new Error(statusText)
        }

        this.$router.push({ name: 'products' })
      } catch (error) {
        console.log('err', error)
      }
    },
    async fetchProduct(productId) {
      try {
        const { data, statusText } = await ProductAPI.getProduct({ productId })

        if (statusText !== 'OK') {
          throw new Error()
        }


        const { name, description, status } = data;

        this.name = name;
        this.description = description;
        this.status = status;

        for (let i = 0; i < data.Images.length; i++) {
          this.images.push(data.Images[i].image);
          if (data.Images[i].main) {
            this.mainPicIndex = i;
          }
        }


        const sizesArray = data.sizes

        for (let i = 0; i < sizesArray.length; i++) {
          this.sizeInputCount = i + 1

          this.sizeInputArray.push({
            index: this.sizeInputCount,
            sizes: this.sizes,
            price: sizesArray[i].ProductSize.price,
          })

          this.selectArray.push({
            selectId: this.sizeInputCount,
            selectSizeId: sizesArray[i].id,
            price: sizesArray[i].ProductSize.price
          });

          })

          this.selectArray.forEach((select) => {
            this.sizeInputArray = this.sizeInputArray.map((input) => {
              if (Number(input.index) !== Number(select.selectId)) {
                const filter = input.sizes.filter((a) => {
                  if (Number(a.id) !== Number(select.selectSizeId)) {
                    return a
                  }
                })
                return (input = {
                  ...input,
                  sizes: filter,
                })
              } else {
                return (input = {
                  ...input,
                })
              }
            })
          })
        }

        this.selectArray.forEach((select) => {
          this.sizes = this.sizes.filter((size) => {
            if (Number(select.selectSizeId) !== Number(size.id)) {
              return size
            }
          });
        });

        this.productId = data.id;
      } catch (err) {
        console.log(err);
      }
    },

    async edit() {
      try {
        if (this.images.length === 0) {
          Toast.fire({
            type: "warning",
            title: "請新增至少一張圖片"
          });
          return;
        }
        if (!this.name) {
          Toast.fire({
            type: "warning",
            title: "請輸入商品名稱"
          });
          return;
        }
        if (this.selectArray.length === 0) {
          Toast.fire({
            type: "warning",
            title: "請新增至少一個商品售價"
          });
          return;
        }

        this.selectArray.forEach(a => {
          if (a.selectSizeId === 0) {
            Toast.fire({
              type: "warning",
              title: "請選擇大小"
            });
            return;
          }
          if (!a.price) {
            Toast.fire({
              type: "warning",
              title: "請輸入金額"
            });
            return;
          }

          const json = JSON.stringify(a);
          this.formData.append("sizeArray", json);
        });

        for (let i = 0; i < this.images.length - this.fileArray.length; i++) {
          this.formData.append("oldImage", this.images[i]);
        }

        for (let i = 0; i < this.delete.length; i++) {
          this.formData.append("deleteImage", this.delete[i]);
        }

        this.fileArray.forEach(file => {
          this.formData.append("image", file);
        });

        this.formData.append("name", this.name);
        this.formData.append("description", this.description);
        this.formData.append("status", "on");
        this.formData.append("mainPicIndex", this.mainPicIndex);

        const { data, statusText } = await ProductAPI.putProduct({
          productId: this.productId,
          formData: this.formData
        });

        if (data.status !== "success" || statusText !== "OK") {
          throw new Error(statusText);
        }

        this.$router.push({ name: "products" });
      } catch (err) {
        console.log(err);
      }
    },
    async statusChange(productId) {
      try {
        const { data, statusText } = await ProductAPI.changeProductStatus({
          productId
        });

        if (data.status !== "success" || statusText !== "OK") {
          throw new Error(statusText);
        }

        this.$router.push({ name: "products" });

      } catch (err) {
        console.log(err)
      }
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.product-create {
  width: 100%;
  height: 100vh;
  text-align: center;
  color: $grey;

  .product-image {
    width: 100%;
    overflow-x: auto;
    display: flex;
    padding: 10px;
    margin: 5% auto;
    justify-content: space-around;

    .image-square {
      background-color: #ffffff;
      width: 150px;
      height: 150px;
      padding: 2px;
    }

    .image {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .x-icon {
      position: absolute;
      right: -20px;
      top: -25px;
      font-size: 40px;
      cursor: pointer;
    }

    .icon {
      font-size: 75px;
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

    .size {
      padding-bottom: 20px;
    }

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
      grid-template-columns: 49% 2% 25% 24%;

      span {
        text-align: left;
      }

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
}

.product-bottom-bar {
  display: grid;
  grid-template-columns: 50% 50%;
}
.create-button {
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

.status-change-button {
  background-color: $red;
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

.select-main-pic {
  border-width: 2px;
  border-color: $blue;
  border-style: solid;
}
</style>

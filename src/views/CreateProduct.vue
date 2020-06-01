<template>
  <div class="product-create">
    <TopBar :page-title="title" :button-type="buttonType" />
    <form @submit.stop.prevent="submit">
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
            <input
              type="file"
              name="image"
              id="pic"
              class="file"
              @change="fileSelected"
            />
          </label>
        </div>
        <div class="product-name">
          <input
            type="text"
            name="name"
            v-model="name"
            placeholder="商品名稱"
            class="name"
          />
        </div>
        <div class="product-price">
          <div class="sale-price">
            <span>商品售價</span>
          </div>

          <div class="size">
            <div v-for="(data, index) in sizeInputArray" :key="index">
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
                    <option
                      v-for="size in data.sizes"
                      :key="size.id"
                      :value="size.id"
                      >{{ size.size }}</option
                    >
                  </select>
                </div>
                |
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
              <font-awesome-icon
                :icon="['fa', 'plus-circle']"
                class="icon"
                @click="addSize"
              />
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
        <div class="create-button">
          <button type="submit">上架商品</button>
        </div>
      </div>
    </form>
    <!-- <BottomBar :page-name="name" /> -->
  </div>
</template>

<script>
import ProductAPI from '../apis/products'

export default {
  data() {
    return {
      sizeRawData: [],
      sizes: [],
      selectArray: [],
      sizeInputCount: 0,
      sizeInputArray: [],
      key: '請選擇',
      name: '',
      title: '新增商品',
      buttonType: 'add',
      image: '',
      description: '',
      formData: new FormData(),
    }
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
      console.log(event.target.files[0])

      this.formData.append('file', event.target.files[0])

      console.log(this.formData)

      //immediately show image
      const file = event.target.files.item(0)
      const reader = new FileReader()
      reader.addEventListener('load', (e) => {
        this.image = e.target.result
      })
      reader.readAsDataURL(file)
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
      })
    },
    input(event) {
      const selectIndexInArray = event.currentTarget.dataset.index - 1

      this.selectArray[selectIndexInArray].price = event.currentTarget.value
    },
    async submit(e) {
      try {
        const form = new FormData(e.target)

        this.selectArray.forEach((a) => {
          const json = JSON.stringify(a)
          form.append('sizeArray', json)
        })

        const { data, statusText } = await ProductAPI.createProduct(form)

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

        const { name, description, image } = data

        this.name = name
        this.description = description
        this.image = image

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
          })
        })
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

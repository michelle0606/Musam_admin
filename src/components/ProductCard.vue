<template>
  <div class="products">
    <div v-for="product in products" :key="product.id">
      <router-link :to="{ name: 'product', params: { id: product.id } }">
        <div class="product">
          <div v-if="product.status === 'on'" class="circle-row">
            <div class="circle-green"></div>
            <div class="circle-grey"></div>
          </div>
          <div v-else class="circle-row">
            <div class="circle-grey"></div>
            <div class="circle-red"></div>
          </div>
          <div class="product-image">
            <img
              v-if="product.Images[0]"
              class="image"
              :src="product.Images[0].image"
            />
            <img v-else class="image" src="http://lorempixel.com/640/480" />
          </div>
          <div class="product-name">
            <span class="name">{{ product.name }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true,
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

.products {
  overflow-y: auto;
  display: grid;
  grid-template-columns: 140px 140px;
  grid-template-rows: 140px;
  grid-gap: 20px;
  padding: 80px 0px;
  margin: 0 auto;
  justify-content: center;

  .product {
    background-color: #fff;
    display: grid;
    grid-template-rows: 35px 70px 35px;
    width: 140px;
    height: 140px;
    font-size: 18px;

    .circle-row {
      display: inline-flex;
      margin: 0 auto;

      .circle-grey {
        margin: 10px;
        background-color: $grey;
        width: 15px;
        height: 15px;
        border-radius: 999em;
      }

      .circle-green {
        margin: 10px;
        background-color: $green;
        width: 15px;
        height: 15px;
        border-radius: 999em;
      }

      .circle-red {
        margin: 10px;
        background-color: $red;
        width: 15px;
        height: 15px;
        border-radius: 999em;
      }
    }

    .product-image {
      margin: 0 auto;

      .image {
        width: 70px;
        height: 70px;
      }
    }

    .product-name {
      margin: 0 auto;
      padding: 5px 15px;
      width: inherit;
      overflow: scroll;
      .name {
        color: $grey;
        font-family: Roboto;
        font-style: normal;
        font-weight: 200;
        font-size: 16px;
        white-space: nowrap;
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

<template>
  <div class="product-page">
    <TopBar :page-title="title" :button-type="buttonType" />
    <ProductCard :products="products" />
    <BottomBar :page-name="name" />
  </div>
</template>

<script>
import ProductAPI from '../apis/products'
import ProductCard from '../components/ProductCard'

export default {
  components: { ProductCard },

  data() {
    return {
      name: 'products',
      title: '商品管理',
      products: [],
      buttonType: 'add',
    }
  },
  created() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts(req, res) {
      try {
        const { data, statusText } = await ProductAPI.getProducts()

        if (statusText !== 'OK') {
          throw new Error(statusText)
        }

        this.products = data.map(product => {
          let mainPic = "";

          for (let i = 0; i < product.Images.length; i++) {
            if (product.Images[i].main) {
              mainPic = product.Images[i].image;
            }
          }

          return (product = {
            ...product,
            mainPic
          });
        });

      } catch (error) {
        console.log('err', error)
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

.product-page {
  height: 100vh;
}
</style>

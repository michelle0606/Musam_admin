<template>
  <div class="top-bar">
    <div v-if="button === 'back'" class="type-one">
      <div v-if="title === '新增訂單'">
        <router-link :to="{ name: 'orders' }">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </router-link>
        <div class="title">{{ title }}</div>
      </div>

      <div v-else-if="title === '新增商品'">
        <router-link :to="{ name: 'products' }">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </router-link>
        <div class="title">{{ title }}</div>
      </div>

      <div v-else>
        <router-link :to="{ name: 'customers' }">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </router-link>
        <div class="title">{{ title }}</div>
      </div>
    </div>
    <div v-else-if="button === ''" class="type-one">
      <div v-if="title === '客戶管理' || title === '營收報表'">
        <div class="title">{{ title }}</div>
      </div>
    </div>
    <div v-else-if="button === 'add'" class="type-two">
      <div v-if="title === '未完成訂單'" class="add">
        <div class="title">{{ title }}</div>
        <router-link :to="{ name: 'create-order' }">＋</router-link>
      </div>
      <div v-else-if="title === '商品管理'" class="add">
        <div class="title">{{ title }}</div>
        <router-link :to="{ name: 'product-create' }">＋</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageTitle: {
      type: String,
      required: true
    },
    buttonType: {
      type: String,
      required: true
    }
  },
  watch: {
    pageTitle(newValue) {
      this.title = newValue;
    }
  },
  data() {
    return {
      title: this.pageTitle,
      button: this.buttonType
    };
  }
};
</script>

<style lang="scss">
$bgColor: #ebf3f5;
$green: #34a94e;
$red: #e23737;
$blue: #17205b;
$black: #252b3c;
$grey: #919191;
$white: #e5e5e5;

.top-bar {
  background-color: $black;
  font-weight: 100;
  height: 60px;
  padding: 0px 20px;
  color: $white;
  display: grid;
  position: fixed;
  width: 100%;
  z-index: 10;
  .type-one > div {
    display: flex;
    align-items: center;
    height: 100%;
    a {
      color: $white;
      margin-right: 10px;
    }
  }
  .type-two > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  .add {
    a {
      color: $white;
      font-size: 26px;
    }
  }
}
</style>

<template>
  <div class="bottom-bar">
    <ul>
      <li v-for="page in pages" :key="page.id">
        <router-link :to="{ name: page.name }" :class="{ 'pg-active': page.active }">
          <font-awesome-icon :icon="page.icon" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    pageName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pages: [
        {
          id: 1,
          name: "dashboard",
          icon: ["fas", "chart-line"],
          active: false
        },
        { id: 2, name: "products", icon: ["fas", "candy-cane"], active: false },
        {
          id: 3,
          name: "customers",
          icon: ["far", "address-book"],
          active: false
        },
        { id: 4, name: "orders", icon: ["fas", "th-list"], active: false }
      ]
    };
  },
  created() {
    this.pages.forEach(p => {
      if (this.pageName.match(p.name)) {
        p.active = true;
      }
    });
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

.bottom-bar {
  position: fixed;
  width: 100%;
  bottom: 0px;
  background-color: #ffffff;
  ul {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 50px;
    li {
      margin: auto;
      font-size: 22px;
      a {
        color: $grey;
      }
    }
  }
}

.pg-active {
  color: $green !important;
}
</style>

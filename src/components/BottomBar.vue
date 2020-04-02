<template>
  <div class="bottom-bar">
    <ul>
      <li>
        <router-link :to="{ name: 'dashboard' }">
          <font-awesome-icon :icon="['fas', 'chart-line']" />
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'products' }">
          <font-awesome-icon :icon="['fas', 'candy-cane']" />
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'customers' }">
          <font-awesome-icon :icon="['far', 'address-book']" />
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'orders' }">
          <font-awesome-icon :icon="['fas', 'th-list']" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
$green: #a0b058;
$red: #e23737;
$blue: #17205b;
$black: #252b3c;
$grey: #919191;
$white: #e5e5e5;

.bottom-bar {
  position: absolute;
  width: 100%;
  bottom: 0;
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
</style>

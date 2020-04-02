<template>
  <div class="top-bar">
    <div class="title">未完成訂單</div>
    <div class="add">
      <router-link :to="{ name: 'create-order' }">
        ＋
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
$bgColor: #ebf3f5;
$green: #a0b058;
$red: #e23737;
$blue: #17205b;
$black: #252b3c;
$grey: #919191;
$white: #e5e5e5;

.top-bar {
  background-color: $black;
  font-weight: 100;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  .title {
    color: $white;
  }
  .add {
    a {
      color: $white;
      font-size: 26px;
    }
  }
}
</style>

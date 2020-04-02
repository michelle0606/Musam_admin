<template>
  <div id="app">
    <router-view />
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

body,
html {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  font-family: 'cwTeXYen', sans-serif;
  font-size: 18px;
  background-color: $bgColor;
}
* {
  position: relative;
  box-sizing: border-box;
}
h1,
h2,
h3,
h4,
h5,
h6,
p,
span,
ul,
li {
  padding: 0;
  margin: 0;
}
input,
select {
  appearance: none;
  border-radius: 0px;
  outline: none;
  border: none;
  font-family: 'cwTeXYen', sans-serif;
}
a {
  text-decoration: none;
}
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>

<template>
  <div>
    <div>
      <h1>請登入</h1>
      <div>
        <span>E-mail:</span>
        <input type="email" name="email" placeholder="請輸入E-mail" v-model="email" />
      </div>
      <div>
        <span>Password</span>
        <input type="password" name="password" placeholder="請輸入密碼" v-model="password" />
      </div>
      <div class="create-button" @click="submit">登入</div>
    </div>
  </div>
</template>

<script>
import UserAPI from "../apis/user";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async submit() {
      try {
        const info = {
          email: this.email,
          password: this.password
        };

        const { data, statusText } = await UserAPI.signIn({ info });

        if (data.status !== "success" || statusText !== "OK") {
          throw new Error(statusText);
        }

        localStorage.setItem("token", data.token);

        this.$store.commit("setCurrentUser", data.user);

        this.$router.push({ path: "orders" });
      } catch (err) {
        console.log(err);
      }
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
</style>
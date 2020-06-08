<template>
  <div class="form">
    <img width="100px" src="../assets/cover.png" alt />
    <div class="title">後台管理系統</div>
    <div>
      <input class="form-input" type="email" name="email" placeholder="請輸入Email" v-model="email" />
    </div>
    <div>
      <input
        class="form-input"
        type="password"
        name="password"
        placeholder="請輸入密碼"
        v-model="password"
      />
    </div>
    <div>
      <button class="create-button" @click="submit">登入</button>
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
$white: #e5e5e5;

.form {
  text-align: center;
  margin-top: 50px;
}

.title {
  font-size: 22px;
  margin-bottom: 10px;
  font-weight: 200;
}

.form-input {
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 18px;
  letter-spacing: 1px;
  margin: 10px 0px;
  width: 270px;
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
  border: none;
}
</style>
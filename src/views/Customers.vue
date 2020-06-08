<template>
  <div>
    <TopBar :page-title="title" :button-type="buttonType" />
    <div class="customers-page">
      <div class="filter">
        <input type="text" @keyup="autoCamplete" placeholder="電話搜尋" />
        <ul class="autocomplete-results">
          <li v-for="p in people" :key="p.id">
            <router-link :to="{name: 'customer', params: { id: p.id }}">{{p.phone}} - {{p.name}}</router-link>
          </li>
        </ul>
      </div>
      <Spinner v-if="isLoading" />
      <div v-for="(customer,index) in customers" :key="index">
        <router-link v-if="index%2 === 0" :to="{ name: 'customer', params: { id: customer.id } }">
          <div class="column white">{{customer.name}} - {{customer.phone}}</div>
        </router-link>
        <router-link
          v-else-if="index%2 === 1"
          :to="{ name: 'customer', params: { id: customer.id } }"
        >
          <div class="column grey">{{customer.name}} - {{customer.phone}}</div>
        </router-link>
      </div>
    </div>
    <BottomBar :page-name="name" />
  </div>
</template>

<script>
import BottomBar from "./../components/BottomBar";
import TopBar from "./../components/TopBar";
import CustomerAPI from "../apis/customers";

export default {
  components: {
    TopBar,
    BottomBar
  },
  data() {
    return {
      title: "客戶管理",
      name: "customers",
      buttonType: "",
      customers: [],
      people: [],
      isLoading: true
    };
  },
  created() {
    this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      try {
        const { data, statusText } = await CustomerAPI.getCustomers();

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.customers = data;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log(err);
      }
    },
    autoCamplete(e) {
      this.people = [];
      const input_val = e.target.value; // updates the variable on each ocurrence
      if (input_val.length > 0) {
        var people_to_show = [];

        people_to_show = this.peopleFilter(input_val);

        for (let i = 0; i < people_to_show.length; i++) {
          this.people.push(people_to_show[i]);
        }
      }
    },
    peopleFilter(value) {
      const val = value;
      let people_return = [];
      for (let i = 0; i < this.customers.length; i++) {
        if (val === this.customers[i].phone.slice(0, val.length)) {
          people_return.push(this.customers[i]);
        }
      }
      return people_return;
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
$border-color: 2px solid rgba(255, 255, 255, 0.6);

.customers-page {
  height: 100vh;
  padding: 70px 0px;
}

.filter {
  text-align: center;

  input {
    font-size: 18px;
    padding: 2%;
    width: 100%;
  }

  .autocomplete-results {
    width: 100%;
    text-align: center;
    margin-top: -2px;
    color: $black;
    position: absolute;

    a {
      color: $black;
    }

    li {
      z-index: 20;
      background-color: rgba(255, 255, 255, 0.95);
      font-size: 16px;
      width: 100%;
      padding: 20px 15px;

      &:hover {
        background: #34a94e;
        a {
          color: #ffffff;
        }
      }
    }
  }
}

.column {
  text-align: center;
  padding: 10px;
  margin-top: 2%;
  width: 100%;
  height: 10%;
}

.white {
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.6);
}

.grey {
  background-color: rgba(0, 0, 0, 0.26);
  color: #ffffff;
}
</style>
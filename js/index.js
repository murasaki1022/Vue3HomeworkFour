import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
createApp({
  data() {
    return {
      user: { username: "", password: "" },
    };
  },
  methods: {
    login() {
      const apiUrl = `https://vue3-course-api.hexschool.io/v2/admin/signin`;
      axios
        .post(apiUrl, this.user)
        .then((response) => {
          alert(response.data.message);
          const { token, expired } = response.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
          window.location = "products.html";
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
}).mount("#app");

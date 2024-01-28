import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;

import pagination from "../components/pagination.js";
import deleteProduct from "../components/deleteProduct.js";

createApp({
  data() {
    return {
      apiUrl: `https://vue3-course-api.hexschool.io`,
      apiPath: `murasaki1022`,
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      pages: {},
    };
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/v2/api/user/check`;
      axios
        .post(url)
        .then((response) => {
          this.getProductList();
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.message);
          window.location = "index.html";
        });
    },
    getProductList(page = 1) {
      let url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/products?page=${page}`;
      axios
        .get(url)
        .then((response) => {
          this.products = response.data.products;
          this.pages = response.data.pagination;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openModal(status, item) {
      if (status === "new") {
        this.tempProduct = {};
        this.isNew = true;
        productModal.show();
      } else if (status === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (status === "delete") {
        this.tempProduct = { ...item };
        // delProductModal.show();
        this.$refs.removeModel.openModel();
      }
    },
    updateProduct() {
      let url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      let http = "put";

      if (this.isNew) {
        url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/product`;
        http = "post";
      }

      axios[http](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          productModal.hide();
          this.getProductList();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    deleteProduct() {
      let url = `${this.apiUrl}/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);

          this.getProductList();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    addImage() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkAdmin();

    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      {
        keyboard: false,
        backdrop: "static",
      }
    );
  },
  components: { pagination, deleteProduct },
}).mount("#app");

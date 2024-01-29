import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

import pagination from "../components/pagination.js";
import deleteProduct from "../components/deleteProduct.js";
import productModal from "../components/productModal.js";

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
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        // productModal.show();
        this.$refs.pModal.openModal();
      } else if (status === "edit") {
        this.tempProduct = { ...item };
        if (!Array.isArray(this.tempProduct.imagesUrl)) {
          this.tempProduct.imagesUrl = [];
        }
        this.isNew = false;
        // productModal.show();
        this.$refs.pModal.openModal();
      } else if (status === "delete") {
        this.tempProduct = { ...item };
        // delProductModal.show();
        this.$refs.removeModal.openModal();
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
          // productModal.hide();
          this.$refs.pModal.hideModal();
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
          this.$refs.removeModal.hideModal();
          this.getProductList();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkAdmin();
  },
  components: { pagination, deleteProduct, productModal },
}).mount("#app");

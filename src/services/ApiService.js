import axios from "axios";
import VueAxios from "vue-axios";

class ApiService {
  static vueInstance;

  static init(app) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
  }

  static setHeader() {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }

  static query(resource, params) {
    return ApiService.vueInstance.axios.get(
      import.meta.env.VITE_APP_API_URL + "/" + resource,
      params
    );
  }

  static get(resource) {
    return ApiService.vueInstance.axios.get(
      `${import.meta.env.VITE_APP_API_URL}/${resource}`
    );
  }

  static post(resource, params) {
    return ApiService.vueInstance.axios.post(
      `${import.meta.env.VITE_APP_API_URL}/${resource}`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  static formDataPost(resource, formData) {
    return ApiService.vueInstance.axios.post(
      `${import.meta.env.VITE_APP_API_URL}/${resource}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static update(resource, slug, params) {
    return ApiService.vueInstance.axios.put(
      `${import.meta.env.VITE_APP_API_URL}/${resource}/${slug}`,
      params
    );
  }

  static put(resource, params) {
    return ApiService.vueInstance.axios.put(
      `${import.meta.env.VITE_APP_API_URL}/${resource}`,
      params
    );
  }

  static delete(resource) {
    return ApiService.vueInstance.axios.delete(
      import.meta.env.VITE_APP_API_URL + "/" + resource
    );
  }
}

export default ApiService;

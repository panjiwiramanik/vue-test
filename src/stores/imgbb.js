import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/services/ApiService";
import { ElNotification } from 'element-plus'

export const useImgBBStore = defineStore("imgbb", () => {

  function uploadImage(formData) {
    return ApiService.formDataPost(`upload`, formData)
      .then(({ data }) => {
        return data
      })
      .catch(({ response }) => {
        ElNotification({
          title: "Error",
          message: "Terjadi kesalahan saat mengunggah gambar",
          type: "error",
        });

        throw new Error();
      });
  }

  function deleteImage(url) {
    return ApiService.get(url)
      .then(({ data }) => {
        return data
      })
      .catch(({ response }) => {
        ElNotification({
          title: "Error",
          message: "Terjadi kesalahan saat menghapus gambar",
          type: "error",
        });

        throw new Error();
      });
  }

  return {
    uploadImage,
    deleteImage
  };
});

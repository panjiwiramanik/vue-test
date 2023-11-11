<script>
// <TrashIcon class="h-6 w-6" @click="deleteImageFromLocalStorage(list, data.images[list - 1].delete_url)" />

import { defineComponent, ref, onMounted, reactive } from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import { useImgBBStore } from "@/stores/imgbb";
import { ElLoading, ElNotification } from 'element-plus'
import { TrashIcon, EyeIcon } from '@heroicons/vue/24/solid'

export default defineComponent({
  name: "home",
  components: {
    UploadFilled,
    TrashIcon,
    EyeIcon
  },
  setup() {
    const imgKeyStorage = 'images';
    const imgBBStore = useImgBBStore();
    const data = reactive({
      images: JSON.parse(localStorage.getItem(imgKeyStorage)) || [],
      grid: 1,
      maxlist: 3
    });
    
    const onUploadAttachment = async (options) => {
      if (!options.file.type.includes('image')) {
        ElNotification({
          title: "Error",
          message: "Hanya bisa mengunggah gambar",
          type: "error",
        });

        throw new Error();
      }

      if (options.file.size / 1000000 >= 2) {
        ElNotification({
          title: "Error",
          message: "Ukuran file melebihi batas unggah",
          type: "error",
        });

        throw new Error();
      }

      const loading = ElLoading.service({
        lock: true,
        text: 'Uploading Image...',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      let formDataPost = new FormData();
      formDataPost.append('key', import.meta.env.VITE_APP_IMGBB_KEY);
      formDataPost.append('image', options.file);

      const image = await imgBBStore.uploadImage(formDataPost)
      saveImageToLocalStorage(image.data)
      
      setTimeout(() => {
        loading.close()
      }, 500)
    }

    const saveImageToLocalStorage = (image) => {
      data.images.push({
        id: image.id,
        title: image.title,
        delete_url: image.delete_url,
        display_url: image.display_url
      })

      localStorage.setItem(imgKeyStorage, JSON.stringify(data.images))

      getLayout()
    }

    const deleteImageFromLocalStorage = async (index, deleteUrl) => {
      const loading = ElLoading.service({
        lock: true,
        text: 'Uploading Image...',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      const image = await imgBBStore.deleteImage(deleteUrl)
      data.images.splice(index, 1)
      localStorage.setItem(imgKeyStorage, JSON.stringify(data.images))

      setTimeout(() => {
        loading.close()
        getLayout()
      }, 500)
    }

    const seeImage = (url) => {
      window.open(url, '_blank').focus();
    }

    const getLayout = (id) => {
      if (data.images.length <= 3) data.grid = 1
      if (data.images.length > 3 && data.images.length <= 6) data.grid = 2
      if (data.images.length > 6) data.grid = 3

      if (data.images.length > 9) data.maxlist = Math.ceil(data.images.length / 3)
    }

    onMounted(() => {
      getLayout()
    })

    return {
      data,
      seeImage,
      onUploadAttachment,
      deleteImageFromLocalStorage
    }
  }
})
</script>

<template>
  <main>
    <el-upload
      class="upload-demo mb-3"
      drag
      :show-file-list="false"
      :http-request="(options) => {
        onUploadAttachment(options) 
      }"
      accept=".jpg,.jpeg,.bmp,.png,.gif"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg, jpeg, bmp, png, gif files with a size less than 2 Mb
        </div>
      </template>
    </el-upload>

    <h1 class="text-2xl mb-3">Gallery</h1>

    <div :class="{
        'grid': true,
        'grid-cols-2': true,
        'md:grid-cols-1': data.grid == 1,
        'gap-1': data.grid == 1,
        'md:grid-cols-2': data.grid == 2,
        'gap-2': data.grid == 2,
        'md:grid-cols-3': data.grid == 3,
        'gap-3': data.grid == 3
      }"
      v-if="data.images.length > 0"
    >
      <template v-for="grid in data.grid">
        <div :class="{
          'grid': true,
          'gap-1': data.grid == 1,
          'gap-2': data.grid == 2,
          'gap-3': data.grid == 3
        }">
          <template v-for="list in grid * data.maxlist">
            <div class="relative group" v-if="list > ((grid - 1) * data.maxlist) && data.images[list - 1]">
              <img class="transition-opacity duration-300 hover:opacity-75 h-auto max-w-full rounded-lg" :src="data.images[list - 1].display_url" :alt="data.images[list - 1].title">

              <button class="hidden absolute inset-0 bg-black bg-opacity-20 w-full h-full flex items-center justify-center text-white transition-opacity duration-300 group-hover:flex eyeIcon">
                <EyeIcon class="h-6 w-6" @click="seeImage(data.images[list - 1].display_url)" />
              </button>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div v-else>
      No image
    </div>
  </main>
</template>
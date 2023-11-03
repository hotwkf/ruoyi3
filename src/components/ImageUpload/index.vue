<script setup lang="ts">
import {
  ComponentInternalInstance,
  computed,
  getCurrentInstance,
  ref,
  watch,
} from "vue";
import { getToken } from "@/utils/auth";

const properties = defineProps({
  modelValue: [String, Object, Array],
  // 图片数量限制
  limit: {
    type: Number,
    default: 5,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ["png", "jpg", "jpeg"],
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true,
  },
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const emit = defineEmits(["update:modelValue"]);
const number = ref(0);
const uploadList = ref<any[]>([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(`${import.meta.env.VITE_APP_BASE_API}/common/upload`); // 上传的图片服务器地址
const headers = ref({ Authorization: getToken() });
const fileList = ref<any[]>([]);
const showTip = computed(
  () => properties.isShowTip && (properties.fileType || properties.fileSize)
);

watch(
  () => properties.modelValue,
  (value) => {
    if (value) {
      // 首先将值转为数组
      const list: any[] = Array.isArray(value)
        ? value
        : (properties.modelValue as any).split(",");
      // 然后将数组转为对象数组
      fileList.value = list.map((item) => {
        if (typeof item === "string") {
          item = item.includes(baseUrl)
            ? { name: item, url: item }
            : { name: baseUrl + item, url: baseUrl + item };
        }
        return item;
      });
    } else {
      fileList.value = [];
      return [];
    }
  },
  { deep: true, immediate: true }
);

// 上传前loading加载
function handleBeforeUpload(file: any) {
  let isImg = false;
  if (properties.fileType.length > 0) {
    let fileExtension = "";
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    isImg = properties.fileType.some((type: any) => {
      if (file.type.includes(type)) return true;
      if (fileExtension && fileExtension.includes(type)) return true;
      return false;
    });
  } else {
    isImg = file.type.includes("image");
  }
  if (!isImg) {
    proxy!.$modal.msgError(
      `文件格式不正确, 请上传${properties.fileType.join("/")}图片格式文件!`
    );
    return false;
  }
  if (properties.fileSize) {
    const isLt = file.size / 1024 / 1024 < properties.fileSize;
    if (!isLt) {
      proxy!.$modal.msgError(
        `上传头像图片大小不能超过 ${properties.fileSize} MB!`
      );
      return false;
    }
  }
  proxy!.$modal.loading("正在上传图片，请稍候...");
  number.value++;
}

// 文件个数超出
function handleExceed() {
  proxy!.$modal.msgError(`上传文件数量不能超过 ${properties.limit} 个!`);
}

// 上传成功回调
function handleUploadSuccess(res: any, file: any) {
  if (res.code === 200) {
    uploadList.value.push({ name: res.fileName, url: res.fileName });
    uploadedSuccessfully();
  } else {
    number.value--;
    proxy!.$modal.closeLoading();
    proxy!.$modal.msgError(res.msg);
    (proxy!.$refs.imageUpload as any).handleRemove(file);
    uploadedSuccessfully();
  }
}

// 删除图片
function handleDelete(file: any) {
  const findex = fileList.value.map((f) => f.name).indexOf(file.name);
  if (findex > -1 && uploadList.value.length === number.value) {
    fileList.value.splice(findex, 1);
    // emit("update:modelValue", listToString(fileList.value));
    emit(
      "update:modelValue",
      fileList.value.map((item) => item.url)
    );
    return false;
  }
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value
      .filter((f) => f.url !== undefined)
      .concat(uploadList.value);
    uploadList.value = [];
    number.value = 0;
    // emit("update:modelValue", listToString(fileList.value));
    emit(
      "update:modelValue",
      fileList.value.map((item) => item.url)
    );
    proxy!.$modal.closeLoading();
  }
}

// 上传失败
function handleUploadError() {
  proxy!.$modal.msgError("上传图片失败");
  proxy!.$modal.closeLoading();
}

// 预览
function handlePictureCardPreview(file: any) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

// 对象转成指定字符串分隔
function listToString(list: any, separator?: any) {
  let strs = "";
  separator = separator || ",";
  for (const index in list) {
    if (
      undefined !== list[index].url &&
      list[index].url.indexOf("blob:") !== 0
    ) {
      strs += list[index].url.replace(baseUrl, "") + separator;
    }
  }
  return strs === "" ? "" : strs.slice(0, Math.max(0, strs.length - 1));
}
</script>

<template>
  <div class="component-upload-image">
    <el-upload
      ref="imageUpload"
      multiple
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :before-remove="handleDelete"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{ hide: fileList.length >= limit }"
    >
      <el-icon class="avatar-uploader-icon"><plus /></el-icon>
    </el-upload>
    <!-- 上传提示 -->
    <div v-if="showTip" class="el-upload__tip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="预览"
      width="800px"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}
</style>

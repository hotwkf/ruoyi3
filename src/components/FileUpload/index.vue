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
  modelValue: [String, Object, Array] as any,
  // 数量限制
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
    type: Array as () => Array<any>,
    default: () => ["doc", "xls", "ppt", "txt", "pdf"],
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
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadFileUrl = ref(`${import.meta.env.VITE_APP_BASE_API}/common/upload`); // 上传文件服务器地址
const headers = ref({ Authorization: getToken() });
const fileList = ref<any[]>([]);
const showTip = computed(
  () => properties.isShowTip && (properties.fileType || properties.fileSize)
);

watch(
  () => properties.modelValue,
  (value) => {
    if (value) {
      let temporary = 1;
      // 首先将值转为数组
      const list = Array.isArray(value)
        ? value
        : properties.modelValue!.split(",");
      // 然后将数组转为对象数组
      fileList.value = list.map((item: any) => {
        if (typeof item === "string") {
          item = { name: item, url: item };
        }
        item.uid = item.uid || Date.now() + temporary++;
        return item;
      });
    } else {
      fileList.value = [];
      return [];
    }
  },
  { deep: true, immediate: true }
);

// 上传前校检格式和大小
function handleBeforeUpload(file: any) {
  // 校检文件类型
  if (properties.fileType.length > 0) {
    const fileName = file.name.split(".");
    const fileExtension = fileName.at(-1);
    const isTypeOk = properties.fileType.includes(fileExtension);
    if (!isTypeOk) {
      proxy!.$modal.msgError(
        `文件格式不正确, 请上传${properties.fileType.join("/")}格式文件!`
      );
      return false;
    }
  }
  // 校检文件大小
  if (properties.fileSize) {
    const isLt = file.size / 1024 / 1024 < properties.fileSize;
    if (!isLt) {
      proxy!.$modal.msgError(`上传文件大小不能超过 ${properties.fileSize} MB!`);
      return false;
    }
  }
  proxy!.$modal.loading("正在上传文件，请稍候...");
  number.value++;
  return true;
}

// 文件个数超出
function handleExceed() {
  proxy!.$modal.msgError(`上传文件数量不能超过 ${properties.limit} 个!`);
}

// 上传失败
function handleUploadError(error: any) {
  proxy!.$modal.msgError("上传文件失败");
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
    (proxy!.$refs.fileUpload as any).handleRemove(file);
    uploadedSuccessfully();
  }
}

// 删除文件
function handleDelete(index: any) {
  fileList.value.splice(index, 1);
  emit("update:modelValue", listToString(fileList.value));
}

// 上传结束处理
function uploadedSuccessfully() {
  proxy!.$modal.msgSuccess("上传文件成功");
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value
      .filter((f) => f.url !== undefined)
      .concat(uploadList.value);
    uploadList.value = [];
    number.value = 0;
    emit("update:modelValue", listToString(fileList.value).split(","));
    proxy!.$modal.closeLoading();
  }
}

// 获取文件名称
function getFileName(name: any) {
  return name.lastIndexOf("/") > -1
    ? name.slice(name.lastIndexOf("/") + 1)
    : "";
}

// 对象转成指定字符串分隔
function listToString(list: any, separator?: any) {
  let strs = "";
  separator = separator || ",";
  for (const index in list) {
    if (list[index].url) {
      strs += list[index].url + separator;
    }
  }
  return strs === "" ? "" : strs.slice(0, Math.max(0, strs.length - 1));
}
</script>

<template>
  <div class="upload-file">
    <el-upload
      ref="fileUpload"
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
    >
      <!-- 上传按钮 -->
      <el-button type="primary">选取文件</el-button>
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
    <!-- 文件列表 -->
    <transition-group
      class="upload-file-list el-upload-list el-upload-list--text"
      name="el-fade-in-linear"
      tag="ul"
    >
      <li
        v-for="(file, index) in fileList"
        :key="file.uid"
        class="el-upload-list__item ele-upload-list__item-content"
      >
        <el-link
          :href="`${baseUrl}${file.url}`"
          :underline="false"
          target="_blank"
        >
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" type="danger" @click="handleDelete(index)"
            >删除</el-link
          >
        </div>
      </li>
    </transition-group>
  </div>
</template>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import { isExternal } from "@/utils/validate";

const properties = defineProps({
  src: {
    type: String,
    default: "",
  },
  width: {
    type: [Number, String],
    default: "",
  },
  height: {
    type: [Number, String],
    default: "",
  },
});

const realSource = computed(() => {
  if (!properties.src) {
    return;
  }
  const real_source = properties.src.split(",")[0];
  if (isExternal(real_source)) {
    return real_source;
  }
  return import.meta.env.VITE_APP_BASE_API + real_source;
});

const realSourceList = computed(() => {
  if (!properties.src) {
    return;
  }
  const real_source_list = properties.src.split(",");
  const sourceList: any[] = [];
  for (const item of real_source_list) {
    if (isExternal(item)) {
      sourceList.push(item);
      continue;
    }
    sourceList.push(import.meta.env.VITE_APP_BASE_API + item);
    continue;
  }
  return sourceList;
});

const realWidth = computed(() =>
  typeof properties.width === "string"
    ? properties.width
    : `${properties.width}px`
);

const realHeight = computed(() =>
  typeof properties.height === "string"
    ? properties.height
    : `${properties.height}px`
);
</script>

<template>
  <el-image
    :src="`${realSource}`"
    fit="cover"
    :style="`width:${realWidth};height:${realHeight};`"
    :preview-src-list="realSourceList"
    append-to-body="true"
  >
    <template #error>
      <div class="image-slot">
        <el-icon><picture-filled /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<style lang="scss" scoped>
.el-image {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;
  :deep(.el-image__inner) {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
  :deep(.image-slot) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }
}
</style>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import useSettingsStore from "@/store/modules/settings";
import { handleThemeStyle } from "@/utils/theme";

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  });
});
</script>

<template>
  <router-view />
</template>

<style lang="scss" scoped>
:deep(.el-button span) {
  font-size: 12px;
}
</style>

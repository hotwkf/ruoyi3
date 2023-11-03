<script setup lang="ts">
defineProps({
  span: {
    type: Number,
    default: 14,
  },
});
</script>

<template>
  <el-col :lg="span" :md="12" :sm="8" :xl="span" :xs="8">
    <div class="left-panel">
      <slot />
    </div>
  </el-col>
</template>

<style scoped></style>

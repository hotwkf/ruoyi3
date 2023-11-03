<script setup lang="ts">
defineProps({
  span: {
    type: Number,
    default: 10,
  },
});
</script>

<template>
  <el-col :lg="span" :md="12" :sm="16" :xl="span" :xs="16">
    <div class="right-panel">
      <slot />
    </div>
  </el-col>
</template>

<style scoped></style>

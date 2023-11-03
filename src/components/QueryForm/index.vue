<script setup lang="ts"></script>

<template>
  <el-row class="query-form" :gutter="0">
    <slot />
  </el-row>
</template>

<style lang="scss" scoped>
@mixin panel {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  min-height: 32px;
  margin: 0 0 10px 0;
  > .el-button {
    margin: 0 10px 10px 0 !important;
  }
}

.query-form {
  :deep {
    .el-form-item:first-child {
      margin: 0 0 10px 0 !important;
    }

    .el-form-item + .el-form-item {
      margin: 0 0 10px 10px !important;

      //.el-button {
      //  margin: 0 0 0 10px !important;
      //}
    }

    .left-panel {
      @include panel;
    }

    .right-panel {
      @include panel;
      justify-content: flex-end;
    }
  }
}
:deep(.el-input) {
  width: auto;
}
</style>

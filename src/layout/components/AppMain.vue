<script setup lang="ts">
import useTagsViewStore from "@/store/modules/tagsView";
import iframeToggle from "./IframeToggle/index.vue";

const tagsViewStore = useTagsViewStore();
</script>

<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="(tagsViewStore.cachedViews as any)">
          <component
            :is="Component"
            v-if="!route.meta.link"
            :key="route.path"
          />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  padding: 20px;
  background: #f1f4f5;
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  & > [class*="-container"] {
    min-height: calc(100vh - 124px);
    background: #fff;
  }
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>

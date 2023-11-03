<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getEarlyWarning } from "@/api/public";
import { type EarlyWarningData } from "@/api/contract/types/early-warning.interface";

defineOptions({
  name: "HeaderNotice",
});
const route = useRoute();
const router = useRouter();
const noticeList = ref<EarlyWarningData[]>([]);
const handleGotoContract = (contractNo: string, contractType: string) => {
  if (route.path === "/contract/goods" || route.path === "/contract/services") {
    if (contractType === "0" || contractType === "3") {
      // router.replace({ name: "excessive", query: {} });
      router
        .push({
          path: "/contract/goods",
          query: { active: "showContract", contractNo },
        })
        .catch((error) => {
          // 忽略 NavigationDuplicated 错误
          if (error.name !== "NavigationDuplicated") {
            // 如果不是 NavigationDuplicated 错误，抛出异常
            throw error;
          }
        });
    } else {
      router
        .push({
          path: "/contract/services",
          query: { active: "showContract", contractNo },
        })
        .catch((error) => {
          // 忽略 NavigationDuplicated 错误
          if (error.name !== "NavigationDuplicated") {
            // 如果不是 NavigationDuplicated 错误，抛出异常
            throw error;
          }
        });
    }
  } else if (contractType === "0" || contractType === "3") {
    router.push({
      path: "/contract/goods",
      query: { active: "showContract", contractNo },
    });
  } else {
    router.push({
      path: "/contract/services",
      query: { active: "showContract", contractNo },
    });
  }
};
onMounted(async () => {
  const { data } = await getEarlyWarning();
  noticeList.value = data;
});
</script>

<template>
  <div>
    <el-badge :value="noticeList.length">
      <el-popover placement="bottom" trigger="hover" width="300">
        <template #reference>
          <el-icon><Bell /></el-icon>
        </template>
        <div class="notice-list">
          <el-scrollbar>
            <ul class="notice-list__in">
              <li
                v-for="(item, index) in noticeList"
                :key="index"
                @click="handleGotoContract(item.contractNo, item.contractType)"
              >
                {{ item.message }}
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </el-popover>
    </el-badge>
  </div>
</template>

<style scoped lang="scss">
:deep .el-badge__content.is-fixed {
  top: 14px;
}
.notice-list__in {
  padding: 0 10px;
  li {
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    &:hover {
      background: #f5f7fa;
    }
  }
}
</style>

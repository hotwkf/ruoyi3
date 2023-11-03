<script setup lang="ts">
import dayjs from "dayjs";
import { PropType, computed } from "vue";
import { HistoryData } from "@/api/contract/types/history.interface";
import { ContractNoData } from "@/api/contract/types/contract.interface";
import { useContractStatusSelect, useCustomerNameSelect } from "@/hooks";

// interface SelectContractNo {
//   id: string;
//   contractNo: string;
// }

interface SelectContractType {
  code: string;
  name: string;
}

const properties = defineProps({
  history: {
    type: Array as PropType<HistoryData[]>,
    default: () => [],
  },
  selectContractNo: {
    type: Array as PropType<ContractNoData[]>,
    default: () => [],
  },
  selectContractType: {
    type: Array as PropType<SelectContractType[]>,
    default: () => [],
  },
});

const { selectContractStatus } = useContractStatusSelect();

const { selectCustomer } = useCustomerNameSelect();

const infoContractIdList = computed(() => {
  return properties.history.map((item) => {
    switch (item.code) {
      case "contractIds": {
        const newContractNo: string[] = [];
        const oldContractNo: string[] = [];
        let newValue = "";
        let oldValue = "";
        if (item.newVal) {
          newValue = JSON.parse(item.newVal);
        }
        if (item.oldVal) {
          oldValue = JSON.parse(item.oldVal);
        }

        if (newValue.length > 0) {
          for (const itemNewValue of newValue) {
            for (const itemIn of properties.selectContractNo) {
              if (itemIn.id.toString() === itemNewValue.toString()) {
                newContractNo.push(itemIn.contractNo);
              }
            }
          }
        }
        if (oldValue.length > 0) {
          for (const itemOldValue of oldValue) {
            for (const itemIn of properties.selectContractNo) {
              if (itemIn.id.toString() === itemOldValue.toString()) {
                oldContractNo.push(itemIn.contractNo);
              }
            }
          }
        }
        return {
          ...item,
          newVal: newContractNo.join(","),
          oldVal: oldContractNo.join(","),
        };
      }
      case "contractType":
      case "receiptType": {
        for (const itemIn of properties.selectContractType) {
          if (itemIn.code === item.newVal) {
            item.newVal = itemIn.name;
          }
          if (itemIn.code === item.oldVal) {
            item.oldVal = itemIn.name;
          }
        }
        return item;
      }
      case "contractId": {
        for (const itemIn of properties.selectContractNo) {
          if (itemIn.id.toString() === item.newVal) {
            item.newVal = itemIn.contractNo;
          }
          if (itemIn.id.toString() === item.oldVal) {
            item.oldVal = itemIn.contractNo;
          }
        }
        return item;
      }
      default: {
        return item;
      }
    }
  });
});
</script>

<template>
  <div v-show="history.length > 0">
    <el-divider content-position="left">修改记录</el-divider>
    <el-table border :data="infoContractIdList" max-height="320">
      <el-table-column
        label="修改人"
        align="center"
        prop="createBy"
        width="70"
      />
      <el-table-column label="修改模块" align="center" prop="name" width="94">
        <template #default="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改前" align="center" prop="oldVal">
        <template #default="scope">
          <template v-if="scope.row.code === 'photo'">
            <ImagePreview
              v-for="item in JSON.parse(scope.row.oldVal)"
              :key="item.id"
              :src="item"
            />
          </template>
          <template
            v-else-if="scope.row.name && scope.row.name.indexOf('日期') !== -1"
          >
            <span style="color: #f56c6c">{{
              dayjs(scope.row.oldVal).format("YYYY-MM-DD")
            }}</span>
          </template>
          <template v-else-if="scope.row.name === '合同状态'">
            <span style="color: #f56c6c">{{
              selectContractStatus.filter(
                (item) => item.code === scope.row.oldVal,
              )[0]?.name
            }}</span>
          </template>
          <template
            v-else-if="
              scope.row.name === '签订甲方' || scope.row.name === '签订乙方'
            "
          >
            <span style="color: #f56c6c">{{
              selectCustomer.filter(
                (item) => item.id.toString() === scope.row.oldVal.toString(),
              )[0]?.name
            }}</span>
          </template>
          <!--          <template v-else-if="scope.row.code=== 'contractIds'">-->
          <!--            <span style="color:#F56C6C">{{ scope.row.oldVal.join() }}</span>-->
          <!--          </template>-->
          <template v-else>
            <span style="color: #f56c6c">{{ scope.row.oldVal }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="修改后" align="center" prop="newVal">
        <template #default="scope">
          <template v-if="scope.row.code === 'photo'">
            <ImagePreview
              v-for="item in JSON.parse(scope.row.newVal)"
              :key="item.id"
              :src="item"
            />
          </template>
          <template
            v-else-if="scope.row.name && scope.row.name.indexOf('日期') !== -1"
          >
            <span style="color: #67c23a">{{
              dayjs(scope.row.newVal).format("YYYY-MM-DD")
            }}</span>
          </template>
          <template v-else-if="scope.row.name === '合同状态'">
            <span style="color: #67c23a">{{
              selectContractStatus.filter(
                (item) => item.code === scope.row.newVal,
              )[0]?.name
            }}</span>
          </template>
          <template
            v-else-if="
              scope.row.name === '签订甲方' || scope.row.name === '签订乙方'
            "
          >
            <span style="color: #67c23a">{{
              selectCustomer.filter(
                (item) => item.id.toString() === scope.row.newVal.toString(),
              )[0]?.name
            }}</span>
          </template>
          <!--          <template v-else-if="scope.row.code=== 'contractIds'">-->
          <!--            <span style="color:#F56C6C">{{ scope.row.newVal.join() }}</span>-->
          <!--          </template>-->
          <template v-else>
            <span style="color: #67c23a">{{ scope.row.newVal }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        align="center"
        prop="createTime"
        width="160"
      />
    </el-table>
  </div>
</template>

<style scoped></style>

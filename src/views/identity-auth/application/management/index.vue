<script setup lang="ts">
import { Edit, Plus, Search, Warning } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import type {
  AppListRequest,
  FundsListRow,
} from "@/api/identity-auth/types/application-management.interface";
const queryParameters = ref<AppListRequest>({
  keyword: undefined,
  pageNum: 1,
  pageSize: 10,
  isAsc: "ascending",
  fundsType: undefined,
});

const loading = ref(true);
const total = ref(0);
const fundsList = ref<FundsListRow[]>([]);

const handleAdd = () => {
  console.log("handleAdd");
};
const handleQuery = () => {
  console.log(handleQuery);
};
const handleGoto = (_row: FundsListRow) => {
  console.log("handleGoto");
};
const handleInfo = (_row: FundsListRow) => {
  console.log("handleInfo");
};
const handleUpdate = (_row: FundsListRow) => {
  console.log("handleUpdate");
};

const getList = () => {
  console.log("getList");
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
onMounted(async () => {
  await getList();
  // TODO：测试加密狗
  const sdk = new LockAuthorizeSDK();
  const locks = sdk.getLocks(true);
  console.log(locks);
});
</script>

<template>
  <div class="app-container">
    <query-form>
      <query-form-left-panel :span="4">
        <el-button type="primary" :icon="Plus" @click="handleAdd"
          >新建
        </el-button>
      </query-form-left-panel>
      <query-form-right-panel :span="20">
        <el-form :model="queryParameters" :inline="true">
          <el-form-item>
            <el-select
              v-model="queryParameters.fundsType"
              clearable
              placeholder="资金类型"
              style="width: 120px"
            >
              <el-option label="test1" value="test1" />
              <el-option label="test2" value="test2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryParameters.breedId"
              clearable
              placeholder="品种筛选"
              style="width: 130px"
            >
              <el-option label="test1" value="test1" />
              <el-option label="test2" value="test2" />
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input
              v-model="queryParameters.keyword"
              style="width: 240px"
              placeholder="合同编号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleQuery"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </query-form-right-panel>
    </query-form>
    <el-table v-loading="loading" row-key="id" border :data="fundsList">
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{
            (queryParameters.pageNum - 1) * queryParameters.pageSize +
            $index +
            1
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="合同编号"
        sortable0="custom"
        align="center"
        prop="contractNo"
        width="300"
      />
      <el-table-column
        label="公司名称"
        align="center"
        prop="customerName"
        width="300"
      />
      <el-table-column
        label="总支出（元）"
        sortable0="custom"
        align="center"
        prop="expense"
        width="140"
      />
      <el-table-column
        label="总收入（元）"
        sortable0="custom"
        align="center"
        prop="income"
        width="140"
      />
      <el-table-column label="说明" align="center" prop="explain" width="300" />
      <el-table-column
        label="资金"
        align="center"
        prop="fundsTypeName"
        width="100"
      />
      <el-table-column
        label="总数量（吨）"
        sortable0="custom"
        align="center"
        prop="tonnage"
        width="140"
      />
      <el-table-column
        label="品种"
        align="center"
        prop="breedName"
        width="100"
      />
      <el-table-column label="备注" align="center" prop="remark" width="320" />
      <el-table-column
        label="状态"
        fixed="right"
        align="center"
        prop="status"
        width="100"
      >
        <template #default="scope">
          <el-tag v-show="scope.row.status === '0'" type="danger"
            >未关联</el-tag
          >
          <el-tag v-show="scope.row.status === '1'" type="success"
            >已存入</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <template v-if="scope.row.contractId">
            <el-button :icon="Warning" @click="handleGoto(scope.row)"
              >查看详情
            </el-button>
          </template>
          <template v-else>
            <el-button :icon="Warning" @click="handleInfo(scope.row)"
              >查看
            </el-button>
            <el-button
              type="primary"
              :icon="Edit"
              @click="handleUpdate(scope.row)"
              >编辑
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParameters.pageNum"
      v-model:limit="queryParameters.pageSize"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>

<style scoped lang="scss"></style>

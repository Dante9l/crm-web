<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="公海管理"
      :columns="columns"
      :requestApi="CustomerApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" v-hasPermi="['sys:customer:private']" @click="customerToPrivate(scope.row.id)"> 客户领取 </el-button>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="ts" name="PublicManage">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { CustomerApi } from '@/api/modules/customer'
import { GenderList, IsKeyDecisionMakerList } from '@/configs/enum'
import { EditPen } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'

// 1. ProTable 实例引用
const proTable = ref()

// 2. 表格初始化请求参数
const initParam = reactive({ isPublic: 1 })

// 3. 数据回调处理 (原始代码中 dataSize 未被使用，且存在笔误)
// const dataSize = ref(0) // 此变量在代码中未被使用
const dataCallback = (data: any) => {
  // dataSize.value = data.list.length // 若需统计，应使用 .length
  return {
    list: data.list,
    total: data.total
  }
}

// 4. 表格列配置
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  { prop: 'name', label: '客户名称', minWidth: 120, search: { el: 'input' } },
  { prop: 'phone', label: '手机号', minWidth: 160, search: { el: 'input' } },
  { prop: 'email', label: '邮箱', minWidth: 120 },
  { prop: 'gender', label: '性别', enum: Object.values(GenderList), minWidth: 120 },
  { prop: 'isKeyDecisionMaker', label: '是否为关键决策人', enum: Object.values(IsKeyDecisionMakerList), minWidth: 140 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 130 }
]

// 5. 核心业务函数：领取客户
const customerToPrivate = async (id: any) => {
  // 使用 useHandleData 钩子处理API调用，它通常会封装确认弹窗、loading状态和成功/失败提示
  await useHandleData(CustomerApi.toPrivate, { id: id }, '领取客户')
  // 操作成功后，清空表格选项并刷新表格数据
  proTable.value.clearSelection()
  proTable.value.getTableList()
}
</script>

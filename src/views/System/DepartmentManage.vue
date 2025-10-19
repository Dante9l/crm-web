<template>
  <div class="table-box">
    <ProTable ref="proTable" title="部门列表" rowKey="id" :columns="columns" :requestApi="DepartmentApi.page" :data-callback="dataCallback" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" v-hasPermi="['sys:department:add']" @click="openDrawer('新增')">新增部门</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" v-hasPermi="['sys:department:edit']" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" v-hasPermi="['sys:department:remove']" @click="deleteDepartment(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <DepartmentDialog ref="dialogRef" />
  </div>
</template>
<script setup lang="ts" name="DepartmentManage">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { DepartmentApi } from '@/api/modules/department'
import { CirclePlus, EditPen, Delete } from '@element-plus/icons-vue'
import DepartmentDialog from './components/DepartmentDialog.vue'
import { useHandleData } from '@/hooks/useHandleData'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  console.log(data)
  return {
    list: data.list,
    total: data.total
  }
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '部门名称',
    search: { el: 'input' }
  },
  {
    prop: 'level',
    label: '部门等级'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<any> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: DepartmentApi.saveOrEdit,
    getTableList: proTable.value.getTableList,
    maxHeight: '300px'
  }
  dialogRef.value.acceptParams(params)
}

// 删除部门
const deleteDepartment = async (params: any) => {
  await useHandleData(DepartmentApi.remove, { id: params.id }, `删除【${params.name}】`)
  proTable.value.getTableList()
}
</script>

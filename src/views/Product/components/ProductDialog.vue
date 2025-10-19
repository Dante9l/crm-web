<template>
  <Dialog
    :model-value="dialogVisible"
    :title="dialogProps.title"
    :fullscreen="dialogProps.fullscreen"
    :max-height="dialogProps.maxHeight"
    @cancel-dialog="cancelDialog"
    width="50%"
  >
    <div :style="'width: calc(100% - ' + dialogProps.labelWidth! / 2 + 'px)'">
      <el-form
        ref="ruleFormRef"
        :label-position="'right'"
        :label-width="dialogProps.labelWidth + 'px'"
        :rules="rules"
        :model="dialogProps.row"
        :disabled="dialogProps.isView"
        :hide-required-asterisk="dialogProps.isView"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="dialogProps.row!.name" placeholder="请输入商品名称" clearable maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input v-model="dialogProps.row!.price" placeholder="请输入商品价格" type="number" clearable maxlength="10" show-word-limit />
        </el-form-item>

        <el-form-item label="商品库存" prop="stock">
          <el-input v-model="dialogProps.row!.stock" placeholder="请输入商品库存" clearable maxlength="10" show-word-limit />
        </el-form-item>

        <el-form-item label="商品状态" prop="status">
          <el-select v-model="dialogProps.row!.status" filterable placeholder="请选择商品状态" class="w-full">
            <el-option v-for="item in Object.values(ProductStatusList)" :key="item.value" :label="item.label" :value="item.value" class="label-option" />
          </el-select>
        </el-form-item>

        <el-form-item label="商品封面" prop="coverImage">
          <Uploading v-model:image-url="dialogProps.row!.coverImage" width="135px" height="135px" :file-size="5">
            <template #empty>
              <el-icon><Avatar /></el-icon>
              <span>上传商品封面</span>
            </template>
          </Uploading>
        </el-form-item>

        <el-form-item label="商品简介" prop="description">
          <el-input v-model="dialogProps.row!.description" placeholder="请输入商品简介" clearable maxlength="100" show-word-limit type="textarea" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { ProductStatusList } from '@/configs/enum'
import Uploading from '@/components/Upload/Img.vue'

interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: any
  labelWidth?: number
  maxHeight?: number | string
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  title: '',
  row: {},
  isView: false,
  fullscreen: true,
  maxHeight: '500px',
  labelWidth: 120
})

// 接收父组件传参的方法
const acceptParams = (params: DialogProps): void => {
  const { row, ...rest } = params
  dialogProps.value = { ...dialogProps.value, ...rest, row }
  if (dialogProps.value.title === '商品定时上架') {
    dialogProps.value.row.time = dialogProps.value.row.onShellTime
  } else {
    dialogProps.value.row.time = dialogProps.value.row.offShellTime
  }
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})

const rules = reactive({
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { pattern: /^(([1-9]\d*)|(0))(\.\d{1,2})?$/, message: '请输入正确的金额格式', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (isNaN(num)) return callback(new Error('请输入数字'))
        if (num < 0) return callback(new Error('商品库存不能小于0'))
        callback()
      },
      trigger: 'blur'
    }
  ],
  status: [{ required: true, message: '请选择商品状态', trigger: 'blur' }],
  coverImage: [{ required: true, message: '请上传商品封面图', trigger: 'blur' }]
})

const ruleFormRef = ref<FormInstance>()

const handleSubmit = async () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      delete dialogProps.value.row.updateTime
      delete dialogProps.value.row.createTime
      await dialogProps.value.api!(dialogProps.value.row)
      ElMessage.success(`【${dialogProps.value.title}】成功！`)
      dialogProps.value.getTableList!()
      dialogVisible.value = false
      ruleFormRef.value!.resetFields()
      cancelDialog(true)
    } catch (error) {
      console.error(error)
    }
  })
}

const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  const condition = ['编辑', '新增']
  if (condition.includes(dialogProps.value.title) || isClean) {
    dialogProps.value.row = {}
    ruleFormRef.value!.resetFields()
  }
}
</script>

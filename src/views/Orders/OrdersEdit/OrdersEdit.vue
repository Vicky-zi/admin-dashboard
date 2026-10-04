<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { useOrdersStore } from '@/stores/ordersStore'
import { useDialog } from '@/composables/useDialog'
import { dialogMessages } from '@/constants/dialogMessages'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const ordersStore = useOrdersStore()
const {
  showConfirmDialog,
  showMessageDialog,
  messageDialog,
  openMessageDialog,
  closeMessageDialog,
  closeConfirmDialog,
} = useDialog()

const isEdit = computed(() => !!route.params.id)
const formRef = ref(null)
const valid = ref(false)
const submitLoading = ref(false)

// 權限判斷
const canShipOrder = computed(() => {
  return userStore.user?.permissions.includes('order.ship')
})

const canCancelOrder = computed(() => {
  return userStore.user?.permissions.includes('order.cancel')
})

const availableOrderStatus = computed(() => {
  return ordersStore.orderStatusConfig.filter((item) => {
    if (item.value === form.value.status) {
      return true
    }

    if (item.value === 0) {
      return canCancelOrder.value
    }

    return canShipOrder.value
  })
})

const form = ref({
  orderNo: '',
  status: 1,

  customerName: '',
  customerPhone: '',
  customerEmail: '',

  shippingAddress: '',

  paymentMethod: '',
  paymentStatus: '',

  items: [
    {
      name: '',
      qty: 1,
      price: 0,
    },
  ],

  totalAmount: 0,
  note: '',
  updatedAt: '',
})

// 驗證規則
const rules = {
  orderNo: [(v) => !!v || '請輸入商品名稱'],
  status: [(v) => (v !== null && v !== undefined) || '請選擇狀態'],
  paymentStatus: [(v) => (v !== null && v !== undefined) || '請選擇狀態'],
}

// 提交
const submit = async () => {
  const result = await formRef.value.validate()
  if (!result.valid) return

  try {
    submitLoading.value = true

    const payload = { ...form.value }

    await ordersStore.update(form.value.id, payload)

    // API 成功後等待 1 秒
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    // 顯示成功訊息
    openMessageDialog(dialogMessages.saveSuccess)
  } catch (err) {
    console.error('儲存失敗', err)
    // 顯示失敗訊息
    openMessageDialog(dialogMessages.saveError)
  } finally {
    submitLoading.value = false
  }
}

// 儲存成功後，跳轉回前頁
function handleMessageClose() {
  closeMessageDialog()

  if (messageDialog.type === 'success') {
    router.push({
      name: 'Orders',
    })
  }
}

// 操作：取消
const handleCancel = () => {
  closeConfirmDialog()
  router.push({ name: 'Orders' })
}

const isProcessing = computed(() => submitLoading.value)

onMounted(async () => {
  if (isEdit.value) {
    await ordersStore.fetchOrderDetail(route.params.id)
    form.value = { ...ordersStore.current }
  }
})

onUnmounted(() => {
  form.value = {
    orderNo: '',
    status: 1,

    customerName: '',
    customerPhone: '',
    customerEmail: '',

    shippingAddress: '',

    paymentMethod: '',
    paymentStatus: '',

    items: [
      {
        name: '',
        qty: 1,
        price: 0,
      },
    ],

    totalAmount: 0,
    note: '',
    updatedAt: '',
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>訂單編輯</v-card-title>

          <v-card-text>
            <!-- ===================== -->
            <!-- 1. 可編輯區（訂單狀態） -->
            <!-- ===================== -->
            <v-form ref="formRef" v-model="valid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.orderNo"
                    label="訂單編號"
                    variant="outlined"
                    disabled
                    :rules="rules.orderNo"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.paymentStatus"
                    :items="ordersStore.paymentStatusOptions"
                    label="付款狀態"
                    variant="outlined"
                    :rules="rules.paymentStatus"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="form.status"
                    :items="availableOrderStatus"
                    label="訂單狀態"
                    variant="outlined"
                    :rules="rules.status"
                  />
                </v-col>
              </v-row>
            </v-form>

            <v-divider class="my-4" />

            <!-- ===================== -->
            <!-- 2. 訂購人資訊 -->
            <!-- ===================== -->
            <div class="text-subtitle-1 mb-2">訂購人資訊</div>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field :model-value="form.customerName" label="姓名" variant="outlined" readonly disabled />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field :model-value="form.customerPhone" label="電話" variant="outlined" readonly disabled />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field :model-value="form.customerEmail" label="Email" variant="outlined" readonly disabled />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  :model-value="form.shippingAddress"
                  label="收件地址"
                  variant="outlined"
                  readonly
                  disabled
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- ===================== -->
            <!-- 3. 商品明細 -->
            <!-- ===================== -->
            <div class="text-subtitle-1 mb-2">商品明細</div>

            <v-table density="comfortable">
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th>數量</th>
                  <th>單價</th>
                  <th>小計</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, i) in form.items" :key="i">
                  <td>{{ item.name }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.qty * item.price }}</td>
                </tr>
              </tbody>
            </v-table>

            <div class="text-right mt-3 font-weight-bold">總金額：NT$ {{ form.totalAmount }}</div>

            <v-divider class="my-4" />

            <!-- ===================== -->
            <!-- 4. 備註 -->
            <!-- ===================== -->
            <v-textarea v-model="form.note" label="備註" variant="outlined" rows="3" />
          </v-card-text>

          <!-- footer -->
          <v-card-actions class="justify-end">
            <div v-if="isEdit" class="text-caption text-medium-emphasis mb-1">
              最後更新時間 {{ form.updatedAt || '-' }}
            </div>

            <ConfirmDialog
              v-model="showConfirmDialog"
              :title="dialogMessages.discard.title"
              :text="dialogMessages.discard.text"
              confirm-text="確認"
              confirm-color="red"
              @confirm="handleCancel"
            >
              <template #activator="{ props }">
                <v-btn variant="text" :disabled="isProcessing" v-bind="props"> 捨棄 </v-btn>
              </template>
            </ConfirmDialog>
            <v-btn color="primary" variant="flat" :loading="submitLoading" :disabled="!valid" @click="submit">
              儲存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <MessageDialog
        v-model="showMessageDialog"
        :title="messageDialog.title"
        :text="messageDialog.text"
        :type="messageDialog.type"
        @close="handleMessageClose"
      />
    </v-row>
  </v-container>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/ordersStore'

const ordersStore = useOrdersStore()
const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const formRef = ref(null)
const valid = ref(false)
const submitLoading = ref(false)

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

    router.push({ name: 'Orders' })
  } catch (err) {
    console.error('儲存失敗', err)
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    await ordersStore.fetchOrderDetail(route.params.id)
    form.value = { ...ordersStore.current }
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
                    :items="ordersStore.orderStatusConfig"
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

            <v-dialog max-width="400">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn variant="text" v-bind="activatorProps"> 捨棄 </v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="確認捨棄">
                  <v-card-text>
                    即將<strong class="text-error">放棄編輯</strong>，未儲存內容將遺失並返回列表頁。<br />
                    是否繼續？
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="取消" @click="isActive.value = false"></v-btn>
                    <v-btn
                      text="確認"
                      color="red"
                      variant="flat"
                      @click="
                        () => {
                          isActive.value = false
                          router.push({ name: 'Orders' })
                        }
                      "
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>

            <v-btn color="primary" @click="submit"> 儲存 </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

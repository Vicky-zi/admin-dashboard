<script setup>
defineProps({
  title: {
    type: String,
    default: '確認操作',
  },
  text: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: '確認',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmColor: {
    type: String,
    default: 'primary',
  },
})

const emit = defineEmits(['confirm'])

function handleConfirm(isActive) {
  isActive.value = false
  emit('confirm')
}
</script>

<template>
  <v-dialog max-width="400">
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>

    <template #default="{ isActive }">
      <v-card :title="title">
        <v-card-text v-html="text" />

        <v-card-actions>
          <v-spacer />

          <v-btn :text="cancelText" @click="isActive.value = false" />

          <v-btn :text="confirmText" :color="confirmColor" variant="flat" @click="handleConfirm(isActive)" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
ㄋ

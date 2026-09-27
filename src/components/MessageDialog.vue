<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    default: '提示',
  },

  text: {
    type: String,
    default: '',
  },

  type: {
    type: String,
    default: 'info',
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <v-dialog :model-value="props.modelValue" max-width="400" @update:model-value="emit('update:modelValue', $event)">
    <v-card :title="title">
      <v-card-text>
        {{ text }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn text="確定" variant="flat" :color="type === 'error' ? 'error' : 'primary'" @click="handleClose" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

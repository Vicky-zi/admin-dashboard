export function useDialog() {
  const showConfirmDialog = ref(false)
  const showMessageDialog = ref(false)

  const messageDialog = reactive({
    title: '',
    text: '',
    type: 'info',
  })

  function openConfirmDialog() {
    showConfirmDialog.value = true
  }

  function closeConfirmDialog() {
    showConfirmDialog.value = false
  }

  function openMessageDialog({ title = '提示', text = '', type = 'info' }) {
    messageDialog.title = title
    messageDialog.text = text
    messageDialog.type = type

    showMessageDialog.value = true
  }

  function closeMessageDialog() {
    showMessageDialog.value = false
  }

  return {
    showConfirmDialog,
    showMessageDialog,
    messageDialog,

    openConfirmDialog,
    closeConfirmDialog,

    openMessageDialog,
    closeMessageDialog,
  }
}

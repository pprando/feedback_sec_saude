<script setup lang="ts">
import type { ToastType } from '~/types/feedback'

const props = defineProps<{
  show: boolean
  message: string
  type: ToastType
}>()
</script>

<template>
  <div
    v-if="props.show"
    class="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl text-white text-sm"
    :class="props.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
  >
    {{ props.message }}
  </div>
</template>
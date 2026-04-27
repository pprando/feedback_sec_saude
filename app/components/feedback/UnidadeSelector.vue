<script setup lang="ts">
import { REGIOES } from '~/constants/feedback'

const props = defineProps<{
  regiao: string
  unidade: string
}>()

const emit = defineEmits<{
  (event: 'update:regiao', value: string): void
  (event: 'update:unidade', value: string): void
}>()

const regiaoOptions = REGIOES.map(regiao => ({
  label: regiao.label,
  value: regiao.label
}))

const regiaoAtiva = computed(() => REGIOES.find(regiao => regiao.label === props.regiao) || null)

const unidadesFiltradas = computed(() => {
  if (!regiaoAtiva.value) return []
  return regiaoAtiva.value.unidades
})

const onRegiaoChange = (value: string) => {
  emit('update:regiao', value)
  emit('update:unidade', '')
}

const onUnidadeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value

  if (!value) {
    emit('update:regiao', '')
    emit('update:unidade', '')
    return
  }

  const [regiaoSelecionada, unidadeSelecionada] = value.split('::')
  emit('update:regiao', regiaoSelecionada ?? '')
  emit('update:unidade', unidadeSelecionada ?? '')
}
</script>

<template>
  <div class="space-y-4 sm:space-y-5">
    <div>
      <label class="block text-sm font-semibold mb-2">
        Região
      </label>
      <USelect
        :model-value="regiao"
        :items="regiaoOptions"
        placeholder="Selecione a região"
        size="lg"
        @update:model-value="onRegiaoChange"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold mb-2">
        Unidade / Local
      </label>

      <select
        :value="unidade ? `${regiao}::${unidade}` : ''"
        class="mt-3 w-full min-h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-3 text-sm shadow-sm disabled:opacity-60"
        :disabled="!regiao"
        @change="onUnidadeChange"
      >
        <option value="" disabled>
          {{ regiao ? 'Selecione a unidade' : 'Escolha uma região primeiro' }}
        </option>

        <option
          v-for="item in unidadesFiltradas"
          :key="item"
          :value="`${regiao}::${item}`"
        >
          {{ item }}
        </option>
      </select>

      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Escolha a região acima. Depois filtre ou role a lista para encontrar a unidade.
      </p>
    </div>
  </div>
</template>
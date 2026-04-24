<script setup lang="ts">
const form = reactive({
  tipo: 'informacao',
  regiao: '',
  unidade: '',
  nota: 0,
  descricao: '',
  nome: '',
  telefone: '',
  email: '',
  anonimo: false
})

const loading = ref(false)
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})
const protocoloModal = ref({
  show: false,
  protocolo: ''
})
const buscaUnidade = ref('')
const buscaUnidadeInput = ref<HTMLElement | null>(null)

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }

  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const descricaoError = computed(() => {
  if (form.descricao && form.descricao.length > 500) {
    return 'Máximo 500 caracteres'
  }
  return ''
})

const unidadeError = computed(() => {
  if (!form.regiao || !form.unidade) {
    return 'Selecione a região e a unidade.'
  }
  return ''
})

const notaOptions = Array.from({ length: 10 }, (_, index) => index + 1)

const notaClass = (nota: number) => {
  if (nota <= 3) return 'border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
  if (nota <= 7) return 'border-amber-400 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
  return 'border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
}

const regioes = [
  {
    label: 'SEDE',
    unidades: [
      'CENTRO MUNICIPAL DE SAÚDE DR HUMBERTO SALEME DO VALLE',
      'UNIDADE DE VIGILÂNCIA EM SAÚDE DE DOMINGOS MARTINS',
      'UNIDADE DE ASSISTÊNCIA FARMACÊUTICA MUNICIPAL DE D. MARTINS',
      'CENTRO DE FISIOTERAPIA MUNICIPAL DE DOMINGOS MARTINS',
      'UNIDADE DE REFERÊNCIA EM SAÚDE MENTAL DE DOMINGOS MARTINS',
      'SECRETARIA MUNICIPAL DE SAÚDE DE DOMINGOS MARTINS',
      'CLÍNICA ODONTOLÓGICA SEDE'
    ]
  },
  {
    label: 'MELGAÇO',
    unidades: [
      'UNIDADE DE SAÚDE DE MELGAÇO',
      'UNIDADE DE SAÚDE JARDEL HAESE',
      'POSTO DE ATENDIMENTO FAZENDA GERMANO SCHWANZ'
    ]
  },
  {
    label: 'PARAJU',
    unidades: [
      'UNIDADE DE SAÚDE DA FAMÍLIA DE PARAJU',
      'UNIDADE DE SAÚDE DE ALTO PARAJU'
    ]
  },
  {
    label: 'PONTO ALTO',
    unidades: [
      'UNIDADE DE SAÚDE JOAQUIM TESCH',
      'UNIDADE DE SAÚDE DE PONTO ALTO'
    ]
  },
  {
    label: 'TIJUCO PRETO',
    unidades: [
      'UNIDADE DE SAÚDE DE ALTO TIJUCO PRETO',
      'UNIDADE DE SAÚDE DE TIJUCO PRETO',
      'UNIDADE DE SAÚDE DE SÃO RAFAEL'
    ]
  },
  {
    label: 'PEDRA AZUL',
    unidades: [
      'UNIDADE DE SAÚDE DA FAMÍLIA DE PEDRA AZUL',
      'UNIDADE DE SAÚDE PAUL VOLGT'
    ]
  },
  {
    label: 'SANTA ISABEL',
    unidades: [
      'UNIDADE DE SAÚDE LEONOR GOMES CAMPOS'
    ]
  },
  {
    label: 'BIRIRICAS',
    unidades: [
      'UNIDADE DE SAÚDE DE BIRIRICAS'
    ]
  },
  {
    label: 'BARCELOS',
    unidades: [
      'UNIDADE DE SAÚDE ADOLPHO PIZZOL',
      'POSTO DE SAÚDE DE CRISTO REI'
    ]
  }
]

const regiaoAtiva = computed(() => regioes.find(regiao => regiao.label === form.regiao) || null)

const regiaoOptions = regioes.map(regiao => ({
  label: regiao.label,
  value: regiao.label
}))

const unidadesFiltradas = computed(() => {
  if (!regiaoAtiva.value) return []

  const termo = buscaUnidade.value.trim().toLowerCase()
  if (!termo) return regiaoAtiva.value.unidades

  return regiaoAtiva.value.unidades.filter(unidade =>
    unidade.toLowerCase().includes(termo)
  )
})

const selecionarUnidade = (value: string) => {
  if (!value) {
    form.regiao = ''
    form.unidade = ''
    return
  }

  const [regiaoSelecionada, unidadeSelecionada] = value.split('::')
  form.regiao = regiaoSelecionada ?? ''
  form.unidade = unidadeSelecionada ?? ''
}

const onUnidadeChange = (event: Event) => {
  selecionarUnidade((event.target as HTMLSelectElement).value)
}

const formatarTelefone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)}${digits.slice(3, 7)}-${digits.slice(7)}`
}

const validarTelefone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits.length === 11 && digits[2] === '9'
}

const onTelefoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const formatted = formatarTelefone(input.value)

  input.value = formatted
  form.telefone = formatted
}

const fecharModalProtocolo = () => {
  protocoloModal.value.show = false
  protocoloModal.value.protocolo = ''
}

const copiarProtocolo = async () => {
  if (!protocoloModal.value.protocolo || !navigator?.clipboard) return

  await navigator.clipboard.writeText(protocoloModal.value.protocolo)
  showToast('Protocolo copiado.', 'success')
}

const enviar = async () => {
  if (!form.descricao || form.descricao.trim() === '') {
    showToast('Preencha a descrição', 'error')
    return
  }

  if (!form.regiao || !form.unidade) {
    showToast('Selecione a região e a unidade', 'error')
    return
  }

  if (!form.nota) {
    showToast('Selecione uma nota de 1 a 10', 'error')
    return
  }

  if (!form.anonimo && !validarTelefone(form.telefone)) {
    showToast('Telefone inválido. Use um celular brasileiro no formato (XX) 9XXXX-XXXX', 'error')
    return
  }

  try {
    loading.value = true

    const response = await $fetch<{ success: boolean; protocolo?: string; message?: string }>('/api/feedback', {
      method: 'POST',
      body: { ...form }
    })

    if (response.success) {
      protocoloModal.value = {
        show: true,
        protocolo: response.protocolo || ''
      }

      form.tipo = 'informacao'
      form.regiao = ''
      form.unidade = ''
      form.nota = 0
      form.descricao = ''
      form.nome = ''
      form.telefone = ''
      form.email = ''
      form.anonimo = false
    } else {
      showToast(response.message || 'Erro ao salvar', 'error')
    }
  } catch (error: any) {
    showToast(error?.data?.message || error?.message || 'Erro ao enviar', 'error')
  } finally {
    loading.value = false
  }
}

const tipoOptions = [
  { label: 'Informação', value: 'informacao', icon: 'i-lucide-info' },
  { label: 'Elogio', value: 'elogio', icon: 'i-lucide-star' },
  { label: 'Sugestão', value: 'sugestao', icon: 'i-lucide-lightbulb' },
  { label: 'Reclamação', value: 'reclamacao', icon: 'i-lucide-alert-circle' }
]

watch(() => form.regiao, () => {
  form.unidade = ''
})
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
    <div class="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold mb-2">
          Manifeste-se
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Sua opinião é importante para nós. Compartilhe comentários, sugestões ou elogios sobre nossos serviços.
        </p>
      </div>

      <form @submit.prevent="enviar" class="space-y-5 sm:space-y-6">
        <div>
          <label class="block text-sm font-semibold mb-3">
            Tipo de Manifestação
          </label>
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              v-for="tipo in tipoOptions"
              :key="tipo.value"
              type="button"
              @click="form.tipo = tipo.value"
              :class="[
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all text-left',
                form.tipo === tipo.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400'
                  : 'border-slate-200 dark:border-slate-700'
              ]"
            >
              <i :class="tipo.icon" class="text-xl"></i>
              <span class="text-xs font-medium text-center">
                {{ tipo.label }}
              </span>
            </button>
          </div>
        </div>

        <div class="space-y-4 sm:space-y-5">
          <div>
            <label class="block text-sm font-semibold mb-2">
              Região
            </label>
            <USelect
              v-model="form.regiao"
              :items="regiaoOptions"
              placeholder="Selecione a região"
              size="lg"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">
              Unidade / Local
            </label>

         

            <select
              :value="form.unidade ? `${form.regiao}::${form.unidade}` : ''"
              class="mt-3 w-full min-h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-3 text-sm shadow-sm disabled:opacity-60"
              :disabled="!form.regiao"
              @change="onUnidadeChange"
            >
              <option value="" disabled>
                {{ form.regiao ? 'Selecione a unidade' : 'Escolha uma região primeiro' }}
              </option>

              <option
                v-for="unidade in unidadesFiltradas"
                :key="unidade"
                :value="`${form.regiao}::${unidade}`"
              >
                {{ unidade }}
              </option>
            </select>

            <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Escolha a região acima. Depois filtre ou role a lista para encontrar a unidade.
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-semibold mb-2">
            Descrição *
          </label>
          <textarea
            v-model="form.descricao"
            placeholder="Descreva sua manifestação..."
            class="w-full h-36 sm:h-32 p-4 rounded-xl border bg-white dark:bg-slate-900"
            maxlength="500"
          />
          <div class="text-xs text-slate-500 mt-1">
            {{ form.descricao.length }}/500
          </div>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3">
          <UCheckbox v-model="form.anonimo" />
          <label class="text-sm">
            Não quero me identificar
          </label>
        </div>

        <div v-if="!form.anonimo" class="space-y-3 sm:space-y-4">
          <UInput v-model="form.nome" placeholder="Nome" />
          <UInput
            v-model="form.telefone"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="Telefone"
            @input="onTelefoneInput"
            @keydown="(event) => {
              const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
              if (allowedKeys.includes(event.key)) return
              if (!/^[0-9]$/.test(event.key)) event.preventDefault()
            }"
          />

          <UInput v-model="form.email" placeholder="Email" />
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-semibold mb-3">
            Nota
          </label>
          <div class="grid grid-cols-5 gap-2 sm:gap-2.5">
            <button
              v-for="nota in notaOptions"
              :key="nota"
              type="button"
              @click="form.nota = nota"
              :class="[
                'h-11 w-full rounded-full border-2 text-sm font-bold transition-all duration-200 flex items-center justify-center bg-white dark:bg-slate-900 touch-manipulation',
                form.nota === nota
                  ? `${notaClass(nota)} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950`
                  : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
              ]"
            >
              {{ nota }}
            </button>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Selecione uma nota de 1 a 10 para avaliar o atendimento.
          </p>
        </div>

        <div class="flex flex-col gap-3 pt-3 sm:pt-4 pb-2 sm:pb-0">
          <UButton
            type="submit"
            block
            :loading="loading"
            :disabled="loading || !form.descricao || !!descricaoError || !!unidadeError || !form.nota"
          >
            {{ loading ? 'Enviando...' : 'Enviar' }}
          </UButton>

          <UButton
            type="button"
            variant="ghost"
            block
            @click="$router.push('/acompanhar')"
          >
            Ver Status do Envio
          </UButton>
        </div>
      </form>
    </div>

    <Transition name="modal">
      <div
        v-if="protocoloModal.show"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="fecharModalProtocolo" />

        <div class="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
            Enviado com sucesso
          </p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Obrigado pela sua contribuição!
          </h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sua manifestação foi registrada com sucesso. Sua participação ajuda a melhorar nossos serviços.
          </p>
          <p class="mt-3 text-base font-semibold text-slate-900 dark:text-white">
            Seu protocolo
          </p>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Anote ou copie esse código para consultar o status depois.
          </p>

          <div class="mt-5 rounded-2xl border border-dashed border-green-300 dark:border-green-800 bg-green-50/70 dark:bg-green-950/20 px-4 py-4 text-center">
            <p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Protocolo
            </p>
            <p class="mt-2 break-all text-xl font-bold text-slate-900 dark:text-white">
              {{ protocoloModal.protocolo }}
            </p>
          </div>

          <div class="mt-5 flex flex-col gap-3 sm:flex-row">
            <UButton block icon="i-lucide-copy" @click="copiarProtocolo">
              Copiar protocolo
            </UButton>
            <UButton block variant="soft" color="neutral" @click="fecharModalProtocolo">
              Fechar
            </UButton>
          </div>
        </div>
      </div>
    </Transition>

    <div
      v-if="toast.show"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl text-white text-sm"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 180ms ease, opacity 180ms ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}
</style>

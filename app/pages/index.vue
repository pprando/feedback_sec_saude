<script setup>
const form = reactive({
  tipo: 'informacao',
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

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }

  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const descricaoError = computed(() => {
  if (form.descricao && form.descricao.length > 500) {
    return 'Maximo 500 caracteres'
  }
  return ''
})

const enviar = async () => {
  console.log('enviar acionado')
  console.log('form atual:', { ...form })

  if (!form.descricao || form.descricao.trim() === '') {
    showToast('Preencha a descricao', 'error')
    return
  }

  try {
    loading.value = true

    const response = await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        ...form
      }
    })

    console.log('resposta da API:', response)

    if (response.success) {
      showToast(`Enviado! Protocolo: ${response.protocolo}`, 'success')

      form.tipo = 'informacao'
      form.descricao = ''
      form.nome = ''
      form.telefone = ''
      form.email = ''
      form.anonimo = false
    } else {
      showToast(response.message || 'Erro ao salvar', 'error')
    }
  } catch (error) {
    console.error(error)
    showToast(error?.data?.message || error?.message || 'Erro ao enviar', 'error')
  } finally {
    loading.value = false
  }
}

const tipoOptions = [
  { label: 'Informacao', value: 'informacao', icon: 'i-lucide-info' },
  { label: 'Elogio', value: 'elogio', icon: 'i-lucide-star' },
  { label: 'Sugestao', value: 'sugestao', icon: 'i-lucide-lightbulb' },
  { label: 'Reclamacao', value: 'reclamacao', icon: 'i-lucide-alert-circle' }
]
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
    <div class="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold mb-2">
          Manifeste-se
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Sua opiniao e importante para nos. Compartilhe comentarios, sugestoes ou elogios sobre nossos servicos.
        </p>
      </div>

      <form @submit.prevent="enviar" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold mb-3">
            Tipo de Manifestacao
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

        <div>
          <label class="block text-sm font-semibold mb-2">
            Descricao *
          </label>
          <textarea
            v-model="form.descricao"
            placeholder="Descreva sua manifestacao..."
            class="w-full h-32 p-4 rounded-lg border bg-white dark:bg-slate-900"
            maxlength="500"
          />
          <div class="text-xs text-slate-500 mt-1">
            {{ form.descricao.length }}/500
          </div>
        </div>

        <div class="flex items-center gap-3">
          <UCheckbox v-model="form.anonimo" />
          <label class="text-sm">
            Nao quero me identificar
          </label>
        </div>

        <div v-if="!form.anonimo" class="space-y-4">
          <UInput v-model="form.nome" placeholder="Nome" />
          <UInput v-model="form.telefone" placeholder="Telefone" />
          <UInput v-model="form.email" placeholder="Email" />
        </div>

        <div class="flex flex-col gap-3 pt-4">
          <UButton
            type="submit"
            block
            :loading="loading"
            :disabled="loading || !form.descricao || !!descricaoError"
          >
            {{ loading ? 'Enviando...' : 'Enviar' }}
          </UButton>

          <UButton
            type="button"
            variant="ghost"
            block
            @click="$router.push('/acompanhar')"
          >
            Acompanhar Manifestacao
          </UButton>
        </div>
      </form>
    </div>

    <div
      v-if="toast.show"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl text-white text-sm"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

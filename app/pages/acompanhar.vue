<script setup>
const protocolo = ref('')
const resultado = ref(null)
const loading = ref(false)
const notFound = ref(false)

const buscar = async () => {
  if (!protocolo.value) return

  try {
    loading.value = true
    notFound.value = false

    const res = await $fetch('/api/feedback', {
      method: 'GET',
      query: {
        protocolo: protocolo.value
      }
    })

    resultado.value = res

    if (!res) {
      notFound.value = true
    }

  } catch (e) {
    console.error(e)
    notFound.value = true
  } finally {
    loading.value = false
  }
}

const voltar = () => {
  $router.push('/')
}
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors px-4 py-6 sm:px-6 sm:py-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="voltar"
          class="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <i class="i-lucide-arrow-left"></i>
          Voltar
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold mb-2">
          Acompanhar Manifestação
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Digite seu protocolo para verificar o status
        </p>
      </div>

      <!-- Busca -->
      <div class="space-y-4 mb-8">
        <div>
          <label class="block text-sm font-semibold mb-2">
            Protocolo
          </label>
          <div class="flex gap-3">
            <UInput
              v-model="protocolo"
              placeholder="Ex: FB-1712345678901"
              type="text"
              icon="i-lucide-search"
              class="flex-1"
              @keyup.enter="buscar"
            />
            <UButton
              @click="buscar"
              :loading="loading"
              :disabled="!protocolo || loading"
              icon="i-lucide-search"
              size="lg"
            >
              {{ loading ? 'Buscando...' : 'Buscar' }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Resultado -->
      <div
        v-if="resultado"
        class="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4"
      >
        <div class="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <i class="i-lucide-check-circle text-green-600 dark:text-green-400 text-2xl"></i>
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400">Protocolo</p>
            <p class="font-semibold">{{ resultado.protocolo }}</p>
          </div>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Status</p>
          <p class="text-lg font-semibold">{{ resultado.status || 'Não definido' }}</p>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Descrição</p>
          <p class="text-base">{{ resultado.descricao }}</p>
        </div>

        <div v-if="resultado.resposta" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Resposta</p>
          <p class="text-base text-blue-800 dark:text-blue-200">{{ resultado.resposta }}</p>
        </div>

        <div class="pt-4 text-xs text-slate-500 dark:text-slate-400">
          <p v-if="resultado.created_at">
            Criado em: {{ new Date(resultado.created_at).toLocaleDateString('pt-BR') }}
          </p>
        </div>
      </div>

      <!-- Não encontrado -->
      <div
        v-else-if="notFound"
        class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 text-center"
      >
        <i class="i-lucide-alert-circle text-red-600 dark:text-red-400 text-3xl mb-3"></i>
        <p class="text-red-900 dark:text-red-200 font-semibold">
          Nenhuma manifestação encontrada
        </p>
        <p class="text-red-800 dark:text-red-300 text-sm mt-1">
          Verifique se o protocolo está correto
        </p>
      </div>

      <!-- Dica inicial -->
      <div
        v-else-if="!protocolo"
        class="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-300 dark:border-slate-700 text-center"
      >
        <i class="i-lucide-info text-slate-600 dark:text-slate-400 text-3xl mb-3"></i>
        <p class="text-slate-700 dark:text-slate-300 font-semibold">
          Digite seu protocolo acima
        </p>
        <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Você recebeu um protocolo ao enviar sua manifestação
        </p>
      </div>
    </div>
  </div>
</template>

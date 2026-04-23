<script setup>
const form = reactive({
  tipo: 'informacao',
  unidade: '',
  descricao: '',
  nome: '',
  telefone: '',
  email: '',
  anonimo: false
})

const loading = ref(false)
const successMessage = ref(false)
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
    return 'Máximo 500 caracteres'
  }
  return ''
})

const enviar = async () => {
  if (!form.descricao || form.descricao.trim() === '') {
    showToast('Preencha a descrição', 'error')
    return
  }

  if (!form.unidade) {
    showToast('Selecione uma unidade de saúde', 'error')
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

    if (response.success) {
      showToast(`Enviado! Protocolo: ${response.protocolo}`, 'success')

      form.tipo = 'informacao'
      form.unidade = ''
      form.descricao = ''
      form.nome = ''
      form.telefone = ''
      form.email = ''
      form.anonimo = false
    } else {
      showToast('Erro ao salvar', 'error')
    }

  } catch (error) {
    console.error(error)
    showToast('Erro ao enviar', 'error')
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

const unidadesOptions = [
  { label: 'CENTRO MUNICIPAL DE SAUDE DR HUMBERTO SALEME DO VALLE', value: 'cmshsv' },
  { label: 'UNIDADE DE VIGILANCIA EM SAUDE DE DOMINGOS MARTINS', value: 'uvsde' },
  { label: 'UNIDADE DE ASSISTENCIA FARMACEUTICA MUNICIPAL DE D. MARTINS', value: 'uafmd' },
  { label: 'CENTRO DE FISIOTERAPIA MUNICIPAL DE DOMINGOS MARTINS', value: 'cfmdm' },
  { label: 'UNIDADE DE REFERENCIA EM SAUDE MENTAL DE DOMINGOS MARTINS', value: 'ursmdm' },
  { label: 'SECRETARIA MUNICIPAL DE SAUDE DE DOMINGOS MARTINS', value: 'smsdm' },
  { label: 'CLINICA ODONTOLOGICA SEDE', value: 'cos' },
  { label: 'UNIDADE DE SAUDE DA FAMILIA DE PARAJU', value: 'usdfp' },
  { label: 'UNIDADE DE SAUDE DE ALTO PARAJU', value: 'usap' },
  { label: 'UNIDADE DE SAUDE DE TIJUCO PRETO', value: 'ustp' },
  { label: 'UNIDADE DE SAUDE DE ALTO TIJUCO PRETO', value: 'usatp' },
  { label: 'UNIDADE DE SAUDE DA FAMILIA DE PEDRA AZUL', value: 'usdfpa' },
  { label: 'UNIDADE DE SAUDE DE MELGACO', value: 'usm' },
  { label: 'UNIDADE DE SAUDE DE PONTO ALTO', value: 'uspa' },
  { label: 'UNIDADE DE SAUDE DE SAO RAFAEL', value: 'ussr' },
  { label: 'UNIDADE DE SAUDE DE BIRIRICAS', value: 'usb' },
  { label: 'POSTO DE SAUDE DE CRISTO REI', value: 'pscr' },
  { label: 'POSTO DE ATENDIMENTO FAZENDA GERMANO SCHWANZ', value: 'pafgs' },
  { label: 'UNIDADE DE SAUDE JOAQUIM TESCH', value: 'usjt' },
  { label: 'UNIDADE DE SAUDE LEONOR GOMES CAMPOS', value: 'uslgc' },
  { label: 'UNIDADE DE SAUDE PAUL VOLGT', value: 'uspv' },
  { label: 'UNIDADE DE SAUDE JARDEL HAESE', value: 'usjh' },
  { label: 'UNIDADE DE SAUDE ADOLPHO PIZZOL', value: 'usap2' }
]
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
    <!-- Mensagem de sucesso -->
    <Transition
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-300"
      enter-from-class="opacity-0 translate-y-4"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="successMessage"
        class="fixed top-20 left-4 right-4 md:left-1/2 md:right-auto md:translate-x-[-50%] z-40"
      >
        <UAlert
          color="green"
          variant="soft"
          icon="i-lucide-check-circle"
          title="Sucesso!"
          description="Sua manifestação foi registrada com sucesso."
        />
      </div>
    </Transition>

    <!-- Main Content -->
    <div class="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto">
      <!-- Título -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold mb-2">
          Manifeste-se
        </h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Sua opinião é importante para nós. Compartilhe comentários, sugestões ou elogios sobre nossos serviços.
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="enviar" class="space-y-6">
        <!-- Tipo de Manifestação -->
        <div>
          <label class="block text-sm font-semibold mb-3">
            Tipo de Manifestação
          </label>
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <label
              v-for="tipo in tipoOptions"
              :key="tipo.value"
              :class="[
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                form.tipo === tipo.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              ]"
            >
              <input
                type="radio"
                :value="tipo.value"
                v-model="form.tipo"
                class="sr-only"
              />
              <i :class="tipo.icon" class="text-xl sm:text-2xl"></i>
              <span class="text-xs sm:text-sm font-medium text-center">
                {{ tipo.label }}
              </span>
            </label>
          </div>
        </div>

        <!-- Unidade de Saúde -->
        <div>
          <label class="block text-sm font-semibold mb-3">
            Unidade de Saúde <span class="text-red-500">*</span>
          </label>
          <USelect
            v-model="form.unidade"
            :options="unidadesOptions"
            placeholder="Selecione uma unidade de saúde"
            searchable
            option-attribute="label"
            value-attribute="value"
          />
        </div>

        <!-- Descrição -->
        <div>
          <label class="block text-sm font-semibold mb-2">
            Descrição <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.descricao"
            placeholder="Descreva seu feedback, sugestão ou reclamação aqui..."
            :class="[
              'w-full h-32 sm:h-40 p-4 rounded-lg border-2 transition-colors resize-none',
              'bg-white dark:bg-slate-900',
              'border-slate-300 dark:border-slate-600',
              'text-slate-900 dark:text-white',
              'placeholder-slate-500 dark:placeholder-slate-400',
              'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900'
            ]"
            maxlength="500"
          />
          <div class="flex items-center justify-between mt-2">
            <div v-if="descricaoError" class="text-red-500 text-xs sm:text-sm">
              {{ descricaoError }}
            </div>
            <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-auto">
              {{ form.descricao.length }}/500
            </div>
          </div>
        </div>

        <!-- Anônimo Toggle -->
        <div class="flex items-center gap-3 py-2">
          <UCheckbox v-model="form.anonimo" />
          <label class="text-sm sm:text-base cursor-pointer">
            Não quero me identificar
          </label>
        </div>

        <!-- Campos Pessoais -->
        <Transition
          enter-active-class="transition duration-300"
          leave-active-class="transition duration-300"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="!form.anonimo" class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <!-- Nome -->
            <div>
              <label class="block text-sm font-semibold mb-2">
                Nome
              </label>
              <UInput
                v-model="form.nome"
                placeholder="Seu nome completo"
                type="text"
                icon="i-lucide-user"
              />
            </div>

            <!-- Telefone -->
            <div>
              <label class="block text-sm font-semibold mb-2">
                Telefone
              </label>
              <UInput
                v-model="form.telefone"
                placeholder="(XX) XXXXX-XXXX"
                type="tel"
                icon="i-lucide-phone"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold mb-2">
                Email
              </label>
              <UInput
                v-model="form.email"
                placeholder="seu.email@exemplo.com"
                type="email"
                icon="i-lucide-mail"
              />
            </div>
          </div>
        </Transition>

        <!-- Botões -->
        <div class="flex flex-col gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <UButton
            type="submit"
            size="lg"
            block
            :loading="loading"
            :disabled="loading || !form.descricao || !form.unidade || descricaoError"
            icon="i-lucide-send"
          >
            {{ loading ? 'Enviando...' : 'Enviar Manifestação' }}
          </UButton>

          <UButton
            type="button"
            variant="ghost"
            size="lg"
            block
            icon="i-lucide-file-text"
            @click="$router.push('/acompanhar')"
          >
            Acompanhar Manifestação
          </UButton>
        </div>
      </form>

      <!-- Informações Adicionais -->
      <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-3">
              <i class="i-lucide-shield-check text-blue-600 dark:text-blue-400 text-lg"></i>
            </div>
            <h3 class="text-sm sm:text-base font-semibold mb-1">Confidencial</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Seus dados são protegidos
            </p>
          </div>

          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-3">
              <i class="i-lucide-zap text-green-600 dark:text-green-400 text-lg"></i>
            </div>
            <h3 class="text-sm sm:text-base font-semibold mb-1">Rápido</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Leva apenas 2 minutos
            </p>
          </div>

          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 mb-3">
              <i class="i-lucide-ear text-purple-600 dark:text-purple-400 text-lg"></i>
            </div>
            <h3 class="text-sm sm:text-base font-semibold mb-1">Ouvimos</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Valorizamos sua opinião
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast.show"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl shadow-lg text-white text-sm z-50"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    >
      {{ toast.message }}
    </div>
  </div>
</template>
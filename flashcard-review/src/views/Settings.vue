<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Settings</h1>

    <div class="card p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">AI Service Configuration</h2>

      <!-- API Type Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select AI Service
        </label>
        <div class="flex gap-4">
          <label class="inline-flex items-center">
            <input
              type="radio"
              class="form-radio"
              name="api-type"
              value="google"
              :checked="apiType === 'google'"
              @change="handleApiTypeChange('google')"
            />
            <span class="ml-2">Google AI</span>
            <span v-if="hasGoogleKey" class="ml-2 text-sm text-green-600">
              (Key saved ✓)
            </span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              class="form-radio"
              name="api-type"
              value="openai"
              :checked="apiType === 'openai'"
              @change="handleApiTypeChange('openai')"
            />
            <span class="ml-2">OpenAI</span>
            <span v-if="hasOpenAIKey" class="ml-2 text-sm text-green-600">
              (Key saved ✓)
            </span>
          </label>
        </div>
      </div>

      <!-- API Key Input -->
      <div class="mb-6">
        <!-- Success Message -->
        <div v-if="showSaveSuccess" class="mb-4 p-2 bg-green-50 text-green-700 rounded-md flex items-center">
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          API key saved successfully!
        </div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ apiType === 'google' ? 'Google AI API Key' : 'OpenAI API Key' }}
        </label>
        <input
          type="password"
          v-model="apiKey"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          :placeholder="`Enter your ${apiType === 'google' ? 'Google AI' : 'OpenAI'} API key`"
        />
      </div>

      <!-- Save Button -->
      <button
        @click="saveSettings"
        class="w-full bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Save Settings
      </button>
    </div>

    <!-- API Key Instructions -->
    <div class="bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-medium mb-4">How to Get Your API Key</h3>
      <div v-if="apiType === 'google'">
        <h4 class="font-medium mb-2">Google AI API Key:</h4>
        <ol class="list-decimal list-inside space-y-2 text-gray-600">
          <li>Visit the <a href="https://makersuite.google.com/app/apikey" target="_blank" class="text-primary hover:underline">Google AI Studio</a></li>
          <li>Sign in with your Google account</li>
          <li>Create a new API key or use an existing one</li>
          <li>Copy and paste the API key above</li>
        </ol>
      </div>
      <div v-else>
        <h4 class="font-medium mb-2">OpenAI API Key:</h4>
        <ol class="list-decimal list-inside space-y-2 text-gray-600">
          <li>Visit <a href="https://platform.openai.com/account/api-keys" target="_blank" class="text-primary hover:underline">OpenAI's API Keys page</a></li>
          <li>Sign in to your OpenAI account</li>
          <li>Click "Create new secret key"</li>
          <li>Copy and paste the API key above</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Settings',
  setup() {
    const store = useStore();
    const apiKey = ref('');
    const showSaveSuccess = ref(false);
    const apiType = computed(() => store.getters.currentApiType);
    const hasGoogleKey = ref(false);
    const hasOpenAIKey = ref(false);

    // Check if API keys exist for each service
    onMounted(() => {
      const googleKey = localStorage.getItem('google_api_key');
      const openaiKey = localStorage.getItem('openai_api_key');
      hasGoogleKey.value = !!googleKey;
      hasOpenAIKey.value = !!openaiKey;
    });

    const handleApiTypeChange = (type) => {
      store.dispatch('updateApiType', type);
      apiKey.value = localStorage.getItem(`${type}_api_key`) || '';
    };

    const saveSettings = () => {
      if (apiKey.value.trim()) {
        store.dispatch('updateApiKey', apiKey.value);
        if (apiType.value === 'google') {
          hasGoogleKey.value = true;
        } else {
          hasOpenAIKey.value = true;
        }
        showSaveSuccess.value = true;
        setTimeout(() => {
          showSaveSuccess.value = false;
        }, 3000);
      }
    };

    return {
      apiKey,
      apiType,
      handleApiTypeChange,
      saveSettings,
      showSaveSuccess,
      hasGoogleKey,
      hasOpenAIKey
    };
  }
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow border border-gray-200;
}

.form-radio {
  @apply h-4 w-4 text-primary border-gray-300 focus:ring-primary;
}

.text-primary {
  @apply text-blue-600;
}

.bg-primary {
  @apply bg-blue-600;
}

.bg-primary-dark {
  @apply bg-blue-700;
}

.focus\:ring-primary:focus {
  @apply ring-blue-500;
}

.focus\:border-primary:focus {
  @apply border-blue-500;
}
</style>
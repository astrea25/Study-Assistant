<!-- src/views/Settings.vue -->
<template>
    <div>
      <h1 class="text-3xl font-bold text-dark mb-6">Settings</h1>
      
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">OpenAI API Configuration</h2>
        
        <div class="mb-4">
          <label for="apiKey" class="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <div class="flex">
            <input
              :type="showApiKey ? 'text' : 'password'"
              id="apiKey"
              v-model="apiKey"
              class="input rounded-r-none"
              placeholder="Enter your OpenAI API key"
            />
            <button
              @click="toggleApiKeyVisibility"
              class="px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50"
            >
              <svg v-if="showApiKey" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
        
        <div class="mt-6">
          <button @click="saveApiKey" class="btn btn-primary">Save API Key</button>
        </div>
        
        <div v-if="apiKeySaved" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          API key saved successfully!
        </div>
      </div>
      
      <div class="mt-8 card">
        <h2 class="text-xl font-semibold mb-4">About This App</h2>
        <p class="mb-2">
          This application uses the OpenAI API to convert PDF documents into interactive
          learning materials such as flashcards and quizzes.
        </p>
        <p class="mb-2">
          The app processes your documents locally, and only sends the text content to OpenAI's API
          for generating the learning materials. Your original PDFs are never uploaded to any server.
        </p>
        <p>
          To use this app, you need to provide your own OpenAI API key in the settings above.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import openaiService from '@/services/aiService';
  
  export default {
    name: 'Settings',
    setup() {
      const store = useStore();
      const apiKey = ref('');
      const showApiKey = ref(false);
      const apiKeySaved = ref(false);
      
      onMounted(() => {
        apiKey.value = openaiService.getApiKey() || '';
      });
      
      const toggleApiKeyVisibility = () => {
        showApiKey.value = !showApiKey.value;
      };
      
      const saveApiKey = () => {
        store.dispatch('updateApiKey', apiKey.value);
        apiKeySaved.value = true;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          apiKeySaved.value = false;
        }, 3000);
      };
      
      return {
        apiKey,
        showApiKey,
        apiKeySaved,
        toggleApiKeyVisibility,
        saveApiKey
      };
    }
  }
  </script>
<!-- src/views/Dashboard.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold text-center mb-8">Welcome to Study Assistant</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Upload PDFs Card -->
      <div class="card hover:shadow-lg transition-shadow">
        <router-link to="/upload" class="block p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h2 class="text-2xl font-semibold">Upload PDFs</h2>
          </div>
          <p class="text-gray-600 mb-4">
            Upload your study materials and let us help you learn more effectively.
          </p>
          <span class="text-primary font-medium">Get Started →</span>
        </router-link>
      </div>

      <!-- Flashcards Card -->
      <div class="card hover:shadow-lg transition-shadow">
        <router-link to="/flashcards" class="block p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h2 class="text-2xl font-semibold">Flashcards</h2>
          </div>
          <p class="text-gray-600 mb-4">
            Generate and study with AI-powered flashcards from your materials.
          </p>
          <span class="text-primary font-medium">Study Now →</span>
        </router-link>
      </div>

      <!-- Test Creator Card -->
      <div class="card hover:shadow-lg transition-shadow">
        <router-link to="/test" class="block p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 class="text-2xl font-semibold">Test Creator</h2>
          </div>
          <p class="text-gray-600 mb-4">
            Create custom tests to assess your understanding of the material.
          </p>
          <span class="text-primary font-medium">Create Test →</span>
        </router-link>
      </div>

      <!-- Smart Notes Card -->
      <div class="card hover:shadow-lg transition-shadow">
        <router-link to="/notes" class="block p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="text-2xl font-semibold">Smart Notes</h2>
          </div>
          <p class="text-gray-600 mb-4">
            Generate comprehensive notes from your PDFs or text transcripts.
          </p>
          <span class="text-primary font-medium">Generate Notes →</span>
        </router-link>
      </div>

      <!-- Note Taking App Card -->
      <div class="card hover:shadow-lg transition-shadow col-span-2">
        <router-link to="/notes" class="block p-6">
          <div class="flex items-center mb-4">
            <svg class="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h2 class="text-2xl font-semibold">Take Notes</h2>
          </div>
          <p class="text-gray-600 mb-4">
            Write, organize, and manage your notes with our built-in note-taking app. Create, edit, and organize your study notes in one place.
          </p>
          <span class="text-primary font-medium">Start Writing →</span>
        </router-link>
      </div>
    </div>

    <!-- Quick Start Guide -->
    <div class="mt-12 card">
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-6">Quick Start Guide</h2>
        <ol class="list-decimal list-inside space-y-4 text-gray-600">
          <li>
            <span class="font-medium text-gray-900">Upload your PDFs:</span>
            Start by uploading one or more PDF files containing your study materials.
          </li>
          <li>
            <span class="font-medium text-gray-900">Choose your study method:</span>
            Generate flashcards, create a test, get AI-powered notes, or take your own notes.
          </li>
          <li>
            <span class="font-medium text-gray-900">Study and review:</span>
            Use the generated materials and your notes to enhance your learning experience.
          </li>
        </ol>
      </div>
    </div>

    <!-- API Key Reminder -->
    <div v-if="!isApiKeySet" class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-sm text-yellow-700">
          Please set up your API key in the 
          <router-link to="/settings" class="font-medium underline">Settings</router-link> 
          to start using the AI features.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Home',
  setup() {
    const store = useStore();
    
    return {
      isApiKeySet: computed(() => store.getters.isApiKeySet)
    };
  }
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow border border-gray-200;
}
</style>
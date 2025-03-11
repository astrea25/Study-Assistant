<!-- src/components/NavBar.vue -->
<template>
    <nav class="bg-gray-900 text-white py-4 px-6">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold">Study Assistant</router-link>
        
        <div class="hidden md:flex space-x-6">
          <router-link to="/" class="font-medium hover:text-blue-400 transition-colors" 
            :class="{ 'text-blue-400': $route.name === 'Dashboard' }">
            Dashboard
          </router-link>
          <router-link to="/upload" class="font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'PDFUpload' }">
            Upload PDF
          </router-link>
          <router-link to="/notes" class="font-medium hover:text-blue-400 transition-colors" :class="{ 'text-blue-400': $route.name === 'Notes' }">
            Take Notes
          </router-link>
          <router-link to="/flashcards" class="font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'Flashcards' }">
            Flashcards
          </router-link>
          <router-link to="/test-creator" class="font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'TestCreator' }">
            Test Creator
          </router-link>
          <router-link to="/settings" class="font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'Settings' }">
            Settings
          </router-link>
        </div>
        
        <button @click="toggleMobileMenu" class="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-gray-800 border-t border-gray-700">
        <div class="container mx-auto px-5 py-3 flex flex-col space-y-3">
          <router-link to="/" class="block py-2 font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'Dashboard' }">
            Dashboard
          </router-link>
          <router-link to="/upload" class="block py-2 font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'PDFUpload' }">
            Upload PDF
          </router-link>
          <router-link to="/flashcards" class="block py-2 font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'Flashcards' }">
            Flashcards
          </router-link>
          <router-link to="/test-creator" class="block py-2 font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'TestCreator' }">
            Test Creator
          </router-link>
          <router-link to="/settings" class="block py-2 font-medium hover:text-blue-400 transition-colors"
            :class="{ 'text-blue-400': $route.name === 'Settings' }">
            Settings
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
    data() {
      return {
        mobileMenuOpen: false
      }
    },
    methods: {
      toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
      }
    }
  }
  </script>
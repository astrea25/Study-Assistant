<!-- src/components/NavBar.vue -->
<template>
    <nav class="bg-dark text-light p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold">PDF Learning App</router-link>
        
        <div class="hidden md:flex space-x-4">
          <router-link to="/" class="hover:text-secondary transition-colors" 
            :class="{ 'text-secondary': $route.name === 'Dashboard' }">
            Dashboard
          </router-link>
          <router-link to="/upload" class="hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'PDFUpload' }">
            Upload PDF
          </router-link>
          <router-link to="/notes" class="hover:text-secondary transition-colors" :class="{ 'text-secondary': $route.name === 'Notes' }">
            Take Notes
            </router-link>
          <router-link to="/flashcards" class="hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'Flashcards' }">
            Flashcards
          </router-link>
          <router-link to="/test-creator" class="hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'TestCreator' }">
            Test Creator
          </router-link>
          <router-link to="/settings" class="hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'Settings' }">
            Settings
          </router-link>
        </div>
        
        <button @click="toggleMobileMenu" class="md:hidden text-light">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="container mx-auto px-4 py-2 flex flex-col space-y-2">
          <router-link to="/" class="block py-2 hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'Dashboard' }">
            Dashboard
          </router-link>
          <router-link to="/upload" class="block py-2 hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'PDFUpload' }">
            Upload PDF
          </router-link>
          <router-link to="/flashcards" class="block py-2 hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'Flashcards' }">
            Flashcards
          </router-link>
          <router-link to="/test-creator" class="block py-2 hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'TestCreator' }">
            Test Creator
          </router-link>
          <router-link to="/settings" class="block py-2 hover:text-secondary transition-colors"
            :class="{ 'text-secondary': $route.name === 'Settings' }">
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
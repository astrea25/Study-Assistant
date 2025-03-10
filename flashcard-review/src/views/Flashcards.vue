<!-- src/views/Flashcards.vue (continued) -->
<template>
    <div>
      <h1 class="text-3xl font-bold text-dark mb-6">Flashcards</h1>
      
      <div v-if="!hasPdf" class="card text-center py-8">
        <p class="text-lg mb-4">No PDF uploaded yet</p>
        <router-link to="/upload" class="btn btn-primary">Upload PDF</router-link>
      </div>
      
      <div v-else-if="isProcessing" class="card text-center py-8">
        <svg class="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-lg">Generating flashcards...</p>
      </div>
      
      <div v-else-if="flashcards.length === 0" class="card text-center py-8">
        <p class="text-lg mb-4">No flashcards generated yet</p>
        <button @click="generateFlashcards" class="btn btn-primary">Generate Flashcards</button>
      </div>
      
      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">
            Flashcard {{ currentIndex + 1 }} of {{ flashcards.length }}
          </h2>
          <div class="flex space-x-4">
            <button @click="shuffleFlashcards" class="btn btn-secondary">
              Shuffle
            </button>
            <button @click="resetFlashcards" class="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>
        
        <div class="w-full max-w-2xl mx-auto">
          <div 
            class="card h-64 cursor-pointer transition-all duration-500 relative border-2 border-primary/20 hover:border-primary/40"
            @click="toggleCard"
            tabindex="0"
            @keyup.space="toggleCard"
            @keyup.enter="toggleCard"
            @keyup.left="prevCard"
            @keyup.right="nextCard"
            ref="flashcard"
          >
            <div v-if="!showBack" class="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
              <h3 class="text-2xl font-bold mb-4">{{ currentFlashcard.front }}</h3>
              <p class="text-gray-500 text-sm">Click to reveal answer</p>
            </div>
            
            <div v-else class="absolute inset-0 p-6 flex flex-col justify-center items-center text-center bg-primary text-white rounded-lg">
              <h3 class="text-xl font-bold mb-2">{{ currentFlashcard.front }}</h3>
              <div class="w-full border-t border-white/30 my-2"></div>
              <p class="text-lg">{{ currentFlashcard.back }}</p>
              <p class="text-white/70 text-sm mt-4">Click to flip back</p>
            </div>
          </div>
          
          <div class="flex justify-between mt-6">
            <button 
              @click="prevCard" 
              class="btn btn-primary shadow-md"
              :disabled="currentIndex === 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
            >
              Previous (←)
            </button>
            
            <button 
              @click="nextCard" 
              class="btn btn-primary shadow-md"
              :disabled="currentIndex === flashcards.length - 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentIndex === flashcards.length - 1 }"
            >
              Next (→)
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Flashcards',
    setup() {
      const store = useStore();
      const router = useRouter();
      const flashcard = ref(null);
      
      const currentIndex = ref(0);
      const showBack = ref(false);
      
      const flashcards = computed(() => store.state.flashcards);
      const currentFlashcard = computed(() => {
        if (flashcards.value.length === 0) return { front: '', back: '' };
        return flashcards.value[currentIndex.value];
      });
      
      // Reset card to front side when changing cards
      watch(currentIndex, () => {
        showBack.value = false;
      });
      
      const toggleCard = () => {
        showBack.value = !showBack.value;
      };
      
      const nextCard = () => {
        if (currentIndex.value < flashcards.value.length - 1) {
          currentIndex.value++;
        }
      };
      
      const prevCard = () => {
        if (currentIndex.value > 0) {
          currentIndex.value--;
        }
      };
      
      const shuffleFlashcards = () => {
        const shuffled = [...flashcards.value].sort(() => Math.random() - 0.5);
        store.commit('SET_FLASHCARDS', shuffled);
        currentIndex.value = 0;
      };
      
      const resetFlashcards = () => {
        currentIndex.value = 0;
        showBack.value = false;
      };
      
      // Global keyboard handler - changed to keyup
      const handleKeyup = (event) => {
        // Only handle keyboard events if flashcards are present
        if (flashcards.value.length === 0) return;

        // Prevent rapid-fire key events
        switch (event.key) {
          case 'ArrowLeft':
            prevCard();
            break;
          case 'ArrowRight':
            nextCard();
            break;
          case ' ': // Space key
          case 'Enter':
            toggleCard();
            // Prevent page scroll on space
            event.preventDefault();
            break;
        }
      };

      // Add and remove keyboard event listeners - changed to keyup
      onMounted(() => {
        document.addEventListener('keyup', handleKeyup);
        // Focus the flashcard element for keyboard interactions
        if (flashcard.value) {
          flashcard.value.focus();
        }
      });

      onUnmounted(() => {
        document.removeEventListener('keyup', handleKeyup);
      });
      
      const generateFlashcards = async () => {
        try {
          if (!store.getters.isApiKeySet) {
            router.push('/settings');
            return;
          }
          
          await store.dispatch('generateFlashcards');
        } catch (error) {
          console.error('Error generating flashcards:', error);
        }
      };
      
      // Generate flashcards if we have a PDF but no flashcards
      if (store.getters.hasPdf && !store.getters.hasFlashcards && !store.state.isProcessing) {
        generateFlashcards();
      }
      
      return {
        currentIndex,
        showBack,
        flashcards,
        currentFlashcard,
        toggleCard,
        nextCard,
        prevCard,
        shuffleFlashcards,
        resetFlashcards,
        generateFlashcards,
        flashcard,
        hasPdf: computed(() => store.getters.hasPdf),
        pdfName: computed(() => store.getters.pdfName),
        isProcessing: computed(() => store.state.isProcessing),
        error: computed(() => store.state.error)
      };
    }
  }
  </script>
  
  <style scoped>
  /* For card flip animation */
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  </style>
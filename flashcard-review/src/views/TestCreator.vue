<!-- src/views/TestCreator.vue -->
<template>
    <div>
      <h1 class="text-3xl font-bold text-dark mb-6">Test Creator</h1>
      
      <div v-if="!hasPdf" class="card text-center py-8">
        <p class="text-lg mb-4">No PDFs uploaded yet</p>
        <router-link to="/upload" class="btn btn-primary">Upload PDFs</router-link>
      </div>
      
      <template v-else>
        <div v-if="!quiz.length && !isProcessing" class="card mb-6">
          <h2 class="text-xl font-semibold mb-4">Generate Quiz</h2>
          
          <!-- Number of Questions Input -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions (from all PDFs)
            </label>
            <input 
              type="number" 
              v-model="numberOfQuestions" 
              min="1" 
              max="50"
              class="input w-32"
            >
            <p class="mt-1 text-sm text-gray-500">Choose between 1 and 50 questions</p>
          </div>

          <p class="mb-4">Select the types of questions to include:</p>
          
          <div class="flex flex-wrap gap-4 mb-6">
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="selectedTypes" value="multiple_choice" class="h-5 w-5 text-primary">
              <span>Multiple Choice</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="selectedTypes" value="true_false" class="h-5 w-5 text-primary">
              <span>True/False</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="selectedTypes" value="identification" class="h-5 w-5 text-primary">
              <span>Identification</span>
            </label>
          </div>

          <!-- Source PDFs info -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Source PDFs:</h3>
            <ul class="list-disc list-inside text-sm text-gray-600">
              {allPdfs.map(pdf => (
                <li key={pdf.id}>{pdf.name}</li>
              ))}
            </ul>
          </div>
          
          <button 
            @click="generateQuiz" 
            class="btn btn-primary"
            :disabled="selectedTypes.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': selectedTypes.length === 0 }"
          >
            Generate Quiz
          </button>
        </div>
        
        <div v-if="isProcessing" class="card text-center py-8">
          <svg class="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-lg">Generating quiz questions from all PDFs...</p>
        </div>
        
        <div v-if="quiz.length > 0 && !isProcessing" class="space-y-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Quiz Questions</h2>
            <div class="flex space-x-4">
              <button @click="regenerateQuiz" class="btn btn-secondary">
                Generate New Questions
              </button>
              <button @click="toggleAnswers" class="btn btn-primary">
                {{ showAnswers ? 'Hide Answers' : 'Show Answers' }}
              </button>
            </div>
          </div>

          <!-- Questions List -->
          <div class="space-y-6">
            <div v-for="(question, index) in quiz" :key="index" class="card">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium mb-4">
                  Question {{ index + 1 }}: {{ question.question }}
                </h3>
                <div class="text-sm">
                  <span class="text-gray-500">{{ formatQuestionType(question.type) }}</span>
                  <span class="text-gray-400 ml-2">(from {{ question.sourcePdf }})</span>
                </div>
              </div>

              <!-- Multiple Choice -->
              <div v-if="question.type === 'multiple_choice'" class="ml-4 space-y-2">
                <div v-for="(option, optIndex) in question.options" :key="optIndex"
                  class="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    :name="`question-${index}`"
                    :value="option"
                    v-model="userAnswers[index]"
                    :disabled="showAnswers"
                    class="h-4 w-4 text-primary"
                  >
                  <label :class="getAnswerClass(option, question.correct_answer, index)">
                    {{ option }}
                  </label>
                </div>
              </div>

              <!-- True/False -->
              <div v-else-if="question.type === 'true_false'" class="ml-4 space-y-2">
                <div v-for="option in ['True', 'False']" :key="option" class="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    :name="`question-${index}`"
                    :value="option"
                    v-model="userAnswers[index]"
                    :disabled="showAnswers"
                    class="h-4 w-4 text-primary"
                  >
                  <label :class="getAnswerClass(option, question.correct_answer, index)">
                    {{ option }}
                  </label>
                </div>
              </div>

              <!-- Identification -->
              <div v-else-if="question.type === 'identification'" class="ml-4">
                <input 
                  type="text"
                  v-model="userAnswers[index]"
                  :disabled="showAnswers"
                  class="input"
                  placeholder="Your answer"
                >
              </div>

              <!-- Correct Answer Display -->
              <div v-if="showAnswers"
                :class="[
                  'mt-4 p-3 rounded-md',
                  isAnswerCorrect(index)
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                ]">
                <p :class="[
                  isAnswerCorrect(index)
                    ? 'text-green-700'
                    : 'text-red-700'
                ]">
                  <span class="font-semibold">Correct Answer:</span>
                  {{ question.correct_answer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <div v-if="error" class="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'TestCreator',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const selectedTypes = ref(['multiple_choice', 'true_false', 'identification']);
      const showAnswers = ref(false);
      const userAnswers = ref({});
      const numberOfQuestions = ref(10); // Default to 10 questions
      const quiz = computed(() => store.state.quiz);
      
      const resetAnswers = () => {
        userAnswers.value = {};
        showAnswers.value = false;
      };
      
      watch(quiz, () => {
        resetAnswers();
      }, { immediate: true });
      
      const generateQuiz = async () => {
        try {
          if (!store.getters.isApiKeySet) {
            router.push('/settings');
            return;
          }
          
          await store.dispatch('generateQuiz', {
            types: selectedTypes.value,
            count: parseInt(numberOfQuestions.value)
          });
        } catch (error) {
          console.error('Error generating quiz:', error);
        }
      };

      const resetQuiz = () => {
        store.commit('SET_QUIZ', []); // Clear the quiz questions
        resetAnswers();
      };

      const regenerateQuiz = () => {
        resetQuiz(); // This will trigger showing the generation options
      };
      
      const toggleAnswers = () => {
        showAnswers.value = !showAnswers.value;
      };

      const getAnswerClass = (option, correctAnswer, questionIndex) => {
        if (!showAnswers.value) return '';
        
        const userAnswer = userAnswers.value[questionIndex];
        // Convert both to lowercase for case-insensitive comparison
        const normalizedOption = option.toString().toLowerCase();
        const normalizedUserAnswer = userAnswer ? userAnswer.toString().toLowerCase() : '';
        const normalizedCorrectAnswer = correctAnswer.toString().toLowerCase();
        
        const isSelected = normalizedUserAnswer === normalizedOption;
        const isCorrect = normalizedOption === normalizedCorrectAnswer;
        
        if (isSelected && isCorrect) return 'text-green-700 font-semibold';
        if (isSelected && !isCorrect) return 'text-red-700 font-semibold';
        if (!isSelected && isCorrect) return 'text-green-700 font-semibold';
        return '';
      };
      
      const formatQuestionType = (type) => {
        switch (type) {
          case 'multiple_choice':
            return 'Multiple Choice';
          case 'true_false':
            return 'True/False';
          case 'identification':
            return 'Identification';
          default:
            return type;
        }
      };
      
      // Generate quiz if we have a PDF but no quiz
      if (store.getters.hasPdf && !store.getters.hasQuiz && !store.state.isProcessing) {
        generateQuiz();
      }
      
      const isAnswerCorrect = (questionIndex) => {
        const userAnswer = userAnswers.value[questionIndex];
        const correctAnswer = quiz.value[questionIndex].correct_answer;
        
        if (!userAnswer) return false;
        
        return userAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase();
      };

      return {
        selectedTypes,
        showAnswers,
        userAnswers,
        numberOfQuestions,
        quiz,
        resetAnswers,
        generateQuiz,
        regenerateQuiz,
        toggleAnswers,
        getAnswerClass,
        formatQuestionType,
        isAnswerCorrect,
        hasPdf: computed(() => store.getters.hasPdf),
        hasQuiz: computed(() => store.getters.hasQuiz),
        isProcessing: computed(() => store.state.isProcessing),
        error: computed(() => store.state.error),
        resetQuiz,
        allPdfs: computed(() => store.state.allPdfs),
      };
    }
  }
  </script>

<style scoped>
.card {
  @apply bg-white p-6 rounded-lg shadow-md border border-gray-200;
}

input[type="radio"]:checked + label {
  @apply font-semibold;
}
</style>
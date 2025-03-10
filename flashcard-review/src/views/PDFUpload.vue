<!-- src/views/PDFUpload.vue -->
<template>
    <div>
      <h1 class="text-3xl font-bold text-dark mb-6">Upload PDFs</h1>
      
      <!-- PDF Upload Area -->
      <div class="card mb-6">
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
             @dragover.prevent
             @drop.prevent="onDrop">
          <input
            type="file"
            ref="fileInput"
            @change="onFileSelected"
            accept="application/pdf"
            multiple
            class="hidden"
          >
          <button @click="$refs.fileInput.click()" class="btn btn-primary mb-4">
            Choose PDF Files
          </button>
          <p class="text-gray-500">or drag and drop your PDF files here</p>
        </div>
      </div>

      <!-- List of Uploaded PDFs -->
      <div v-if="allPdfs.length > 0" class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Uploaded PDFs ({{ allPdfs.length }})</h2>
          <router-link 
            to="/flashcards" 
            class="btn btn-primary"
            v-if="allPdfs.length > 0"
          >
            Generate Flashcards
          </router-link>
        </div>
        <div class="space-y-4">
          <div v-for="(pdf, index) in allPdfs" :key="pdf.id" 
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="text-lg">{{ pdf.name }}</div>
              <div class="text-sm text-gray-500">
                {{ new Date(pdf.timestamp).toLocaleDateString() }}
              </div>
            </div>
            <button @click="removePdf(index)" class="btn btn-secondary bg-red-500 hover:bg-red-600">
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Processing Status -->
      <div v-if="isProcessing" class="mt-6 p-4 bg-blue-100 border border-blue-300 text-blue-700 rounded-md">
        Processing PDF...
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import pdfService from '../services/pdfService';
  
  export default {
    name: 'PDFUpload',
    setup() {
      const store = useStore();
      const fileInput = ref(null);
      
      const onFileSelected = async (event) => {
        const files = Array.from(event.target.files);
        for (const file of files) {
          if (file.type === 'application/pdf') {
            await uploadPdf(file);
          }
        }
      };
      
      const onDrop = async (event) => {
        const files = Array.from(event.dataTransfer.files);
        for (const file of files) {
          if (file.type === 'application/pdf') {
            await uploadPdf(file);
          }
        }
      };
      
      const uploadPdf = async (file) => {
        try {
          const content = await pdfService.extractTextFromPDF(file);
          await store.dispatch('uploadPdf', { file, content });
        } catch (error) {
          console.error('Error processing PDF:', error);
        }
      };
      
      const removePdf = async (index) => {
        await store.dispatch('removePdf', index);
      };
      
      return {
        fileInput,
        onFileSelected,
        onDrop,
        removePdf,
        allPdfs: computed(() => store.getters.allPdfs),
        isProcessing: computed(() => store.state.isProcessing),
        error: computed(() => store.state.error)
      };
    }
  }
  </script>
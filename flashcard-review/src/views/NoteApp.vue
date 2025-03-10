<template>
  <div>
    <h1 class="text-3xl font-bold text-dark mb-6">Notes Generator</h1>

    <!-- Input Section -->
    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Input Source</h2>
      
      <!-- Source Type Selection -->
      <div class="flex gap-4 mb-6">
        <label class="flex items-center space-x-2">
          <input 
            type="radio" 
            v-model="sourceType" 
            value="pdf" 
            class="h-5 w-5 text-primary"
          >
          <span>PDF File</span>
        </label>
        
        <label class="flex items-center space-x-2">
          <input 
            type="radio" 
            v-model="sourceType" 
            value="text" 
            class="h-5 w-5 text-primary"
          >
          <span>Text Transcript</span>
        </label>
      </div>

      <!-- PDF Upload -->
      <div v-if="sourceType === 'pdf'" class="mb-6">
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          @dragover.prevent
          @drop.prevent="onDrop"
        >
          <input
            type="file"
            ref="fileInput"
            @change="onFileSelected"
            accept="application/pdf"
            class="hidden"
          >
          <button @click="$refs.fileInput.click()" class="btn btn-primary mb-4">
            Choose PDF File
          </button>
          <p class="text-gray-500">or drag and drop your PDF file here</p>
        </div>
        <div v-if="selectedFile" class="mt-4 text-sm text-gray-600">
          Selected file: {{ selectedFile.name }}
        </div>
      </div>

      <!-- Text Input -->
      <div v-else class="mb-6">
        <textarea
          v-model="textInput"
          placeholder="Paste your transcript here..."
          class="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        ></textarea>
      </div>

      <!-- Generate Button -->
      <button 
        @click="generateNotes"
        class="btn btn-primary w-full"
        :disabled="!canGenerate || isProcessing"
        :class="{ 'opacity-50 cursor-not-allowed': !canGenerate || isProcessing }"
      >
        {{ isProcessing ? 'Generating...' : 'Generate Notes' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isProcessing" class="card text-center py-8">
      <svg class="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-lg">Generating comprehensive notes...</p>
    </div>

    <!-- Generated Notes -->
    <div v-if="notes" class="card p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Generated Notes</h2>
        <div class="flex gap-4">
          <button @click="copyNotes" class="btn btn-secondary">
            Copy to Clipboard
          </button>
          <button @click="downloadNotes" class="btn btn-primary">
            Download as MD
          </button>
        </div>
      </div>

      <!-- Render formatted markdown -->
      <div class="markdown-content" v-html="formattedNotes"></div>
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
import { marked } from "marked";
import hljs from "highlight.js";

export default {
  name: 'NoteApp',
  setup() {
    const store = useStore();
    const sourceType = ref('pdf');
    const selectedFile = ref(null);
    const textInput = ref('');
    const fileInput = ref(null);
    const error = ref(null);
    const notes = ref('');
    
    // Convert Markdown to formatted HTML with syntax highlighting
    const formattedNotes = computed(() =>
      marked(notes.value, {
        gfm: true, // Enable GitHub-Flavored Markdown
        breaks: true, // Enable line breaks for better formatting
        highlight: (code, lang) => {
          return hljs.highlightAuto(code, [lang]).value; // Auto-detect language
        },
      })
    );

    const canGenerate = computed(() => {
      return sourceType.value === 'pdf' ? selectedFile.value : textInput.value.trim().length > 0;
    });

    const onFileSelected = async (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
        error.value = null;
      }
    };

    const onDrop = async (event) => {
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
        error.value = null;
      }
    };

    const generateNotes = async () => {
      try {
        error.value = null;
        store.commit("SET_PROCESSING", true);

        let content = "";
        if (sourceType.value === "pdf") {
          if (!selectedFile.value) {
            throw new Error("Please select a PDF file");
          }
          content = await pdfService.extractTextFromPDF(selectedFile.value);
        } else {
          if (!textInput.value.trim()) {
            throw new Error("Please enter some text");
          }
          content = textInput.value;
        }

        // Send to API and get generated Markdown notes
        let generatedNotes = await store.dispatch("generateNotes", content);

        // ✅ Remove the "```markdown" and ending "```" from the AI response
        generatedNotes = generatedNotes.replace(/^```markdown\s+/, "").replace(/```$/, "");

        notes.value = generatedNotes;
      } catch (err) {
        error.value = err.message || "Failed to generate notes";
        console.error("Error generating notes:", err);
      } finally {
        store.commit("SET_PROCESSING", false);
      }
    };


    const copyNotes = async () => {
      try {
        await navigator.clipboard.writeText(notes.value);
      } catch (err) {
        error.value = 'Failed to copy to clipboard';
      }
    };

    const downloadNotes = () => {
      if (!notes.value) return;
      
      const blob = new Blob([notes.value], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-notes.md';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };

    return {
      sourceType,
      selectedFile,
      textInput,
      notes,
      fileInput,
      error,
      formattedNotes,
      canGenerate,
      onFileSelected,
      onDrop,
      generateNotes,
      copyNotes,
      downloadNotes,
      isProcessing: computed(() => store.state.isProcessing)
    };
  }
};
</script>

<style>
/* GitHub-like markdown styling */
.markdown-content {
  color: #24292e;
  line-height: 1.6;
  word-wrap: break-word;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 6px;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content h1 {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.markdown-content h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.markdown-content h3 {
  font-size: 1.25em;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-content ul {
  list-style-type: disc;
}

.markdown-content ol {
  list-style-type: decimal;
}

.markdown-content li {
  margin: 0.25em 0;
}

.markdown-content li > ul,
.markdown-content li > ol {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.markdown-content blockquote {
  margin: 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-content code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

.markdown-content pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-content pre code {
  display: inline;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-content p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-content table {
  display: block;
  width: 100%;
  overflow: auto;
  margin-top: 0;
  margin-bottom: 16px;
  border-spacing: 0;
  border-collapse: collapse;
}

.markdown-content table th {
  font-weight: 600;
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-content table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-content table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-content table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-content hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

.markdown-content strong {
  font-weight: 600;
}

.markdown-content a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}
.markdown-content pre {
  background-color: #282c34; /* Dark theme for code blocks */
  color: #fff;
  padding: 12px;
  border-radius: 5px;
  overflow-x: auto;
  font-family: "Courier New", monospace;
}

</style>

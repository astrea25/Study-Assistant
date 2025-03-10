// src/store/index.js
import { createStore } from 'vuex';
import openaiService from '../services/aiService';

export default createStore({
  state: {
    pdfs: [], // Array of PDF objects with their content
    flashcards: [],
    quiz: [],
    notes: null,
    isProcessing: false,
    error: null
  },
  mutations: {
    ADD_PDF(state, pdfData) {
      state.pdfs.push(pdfData);
    },
    REMOVE_PDF(state, index) {
      state.pdfs.splice(index, 1);
    },
    SET_FLASHCARDS(state, flashcards) {
      state.flashcards = flashcards;
    },
    SET_QUIZ(state, quiz) {
      state.quiz = quiz;
    },
    SET_PROCESSING(state, isProcessing) {
      state.isProcessing = isProcessing;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_NOTES(state, notes) {
      state.notes = notes;
    }
  },
  actions: {
    async uploadPdf({ commit, dispatch }, { file, content }) {
      try {
        commit('ADD_PDF', {
          file,
          name: file.name,
          content: content,
          timestamp: Date.now(),
          id: Math.random().toString(36).substr(2, 9)
        });
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    async removePdf({ commit }, index) {
      commit('REMOVE_PDF', index);
    },
    async generateFlashcards({ commit, state }) {
      try {
        commit('SET_PROCESSING', true);
        commit('SET_ERROR', null);

        // Combine content from all PDFs
        const combinedContent = state.pdfs
          .map(pdf => `[From ${pdf.name}]:\n${pdf.content}`)
          .join('\n\n');
        const flashcards = await openaiService.generateFlashcards(combinedContent);
        commit('SET_FLASHCARDS', flashcards);
        return flashcards;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_PROCESSING', false);
      }
    },
    async generateQuiz({ commit, state }, { types, count }) {
      try {
        commit('SET_PROCESSING', true);
        commit('SET_ERROR', null);

        // Calculate questions per PDF
        const pdfCount = state.pdfs.length;
        const questionsPerPdf = Math.floor(count / pdfCount);
        const remainingQuestions = count % pdfCount;

        let allQuestions = [];

        // Generate questions for each PDF
        for (let i = 0; i < state.pdfs.length; i++) {
          const pdf = state.pdfs[i];
          // Add extra question from remainder if needed
          const pdfQuestionCount = i < remainingQuestions ? 
            questionsPerPdf + 1 : 
            questionsPerPdf;
          
          const pdfQuestions = await openaiService.generateQuiz(
            pdf.content,
            types,
            pdfQuestionCount
          );

          // Tag questions with their source PDF
          const taggedQuestions = pdfQuestions.map(q => ({
            ...q,
            sourcePdf: pdf.name
          }));

          allQuestions = allQuestions.concat(taggedQuestions);
        }

        // Shuffle the combined questions
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

        commit('SET_QUIZ', shuffledQuestions);
        return shuffledQuestions;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_PROCESSING', false);
      }
    },
    updateApiKey({ commit }, apiKey) {
      try {
        openaiService.setApiKey(apiKey);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    async generateNotes({ commit }, content) {
      try {
        commit('SET_PROCESSING', true);
        commit('SET_ERROR', null);
        
        const notes = await openaiService.generateNotes(content);
        commit('SET_NOTES', notes);
        return notes;
      } catch (error) {
        console.error('Error in generateNotes action:', error);
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_PROCESSING', false);
      }
    },
  },
  getters: {
    hasPdf: state => state.pdfs.length > 0,
    pdfCount: state => state.pdfs.length,
    allPdfs: state => state.pdfs,
    isApiKeySet: () => !!openaiService.getApiKey(),
    hasFlashcards: state => state.flashcards.length > 0,
    hasQuiz: state => state.quiz.length > 0,
    hasNotes: state => !!state.notes
  }
});
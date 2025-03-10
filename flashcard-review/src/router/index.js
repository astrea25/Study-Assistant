// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import PDFUpload from '../views/PDFUpload.vue';
import Flashcards from '../views/Flashcards.vue';
import TestCreator from '../views/TestCreator.vue';
import Settings from '../views/Settings.vue';
import NoteApp from '../views/NoteApp.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/upload',
    name: 'PDFUpload',
    component: PDFUpload,
    meta: { title: 'Upload PDF' }
  },
  {
    path: '/flashcards',
    name: 'Flashcards',
    component: Flashcards,
    meta: { title: 'Flashcards' }
  },
  {
    path: '/test-creator',
    name: 'TestCreator',
    component: TestCreator,
    meta: { title: 'Test Creator' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: 'Settings' }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: NoteApp,
    meta: { title: 'Notes' }
  }
];

const router = createRouter({
  history: createWebHistory('/'),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | PDF Learning App`;
  next();
});

export default router;
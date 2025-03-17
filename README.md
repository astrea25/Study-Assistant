# Study Assistant

A modern web application built with Vue.js that helps students study more effectively using AI-powered tools and features.

## Features

### 📚 PDF Management
- Upload and process PDF study materials
- Extract text content from PDFs
- Organize study materials in one place

### 🎴 AI-Powered Flashcards
- Automatically generate flashcards from PDF content
- Review flashcards with spaced repetition
- Track learning progress

### ✍️ Smart Notes
- Generate comprehensive study notes from PDFs
- AI-powered note summarization and organization
- Export notes in markdown format
- Copy notes to clipboard
- GitHub-style markdown rendering

### 📝 Test Generation
- Create custom tests from your study materials
- Multiple question types:
  - Multiple choice
  - True/False
  - Identification
- Automatic grading and feedback

## Technologies Used

- Vue.js 3 (Composition API)
- Vuex 4 for state management
- Vue Router 4 for navigation
- Axios for HTTP requests
- PDF.js for PDF processing
- Tailwind CSS (via CDN) for styling
- Markdown-it (via CDN) for markdown rendering
- Highlight.js (via CDN) for code syntax highlighting
- GitHub Markdown CSS (via CDN) for markdown styling
- Google's Gemini Pro API for AI features

## Prerequisites

- Node.js (v14 or higher)
- Google API key for Gemini Pro

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/study-assistant.git
cd study-assistant
```

2. Install dependencies for running frontend and backend concurrently:
```bash
npm install
```

3. Install dependencies for the frontend server:
```bash
cd flashcard-review
npm install
cd ..
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` to access the application.


## Usage

1. **Setting Up**
   - Navigate to Settings
   - Enter your Google API key
   - Save settings

2. **Working with PDFs**
   - Upload PDFs through the upload interface
   - View and manage uploaded files

3. **Generating Flashcards**
   - Select a PDF or enter text
   - Click "Generate Flashcards"
   - Review and study generated flashcards

4. **Creating Notes**
   - Choose between PDF or text input
   - Click "Generate Notes"
   - View, copy, or download the generated notes

5. **Creating Tests**
   - Select study material
   - Choose question types
   - Generate and take the test




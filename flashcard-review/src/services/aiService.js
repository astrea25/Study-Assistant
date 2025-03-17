// src/services/openaiService.js
import axios from 'axios';

class AIService {
  constructor() {
    this.apiKey = localStorage.getItem('google_api_key') || '';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('google_api_key', key);
    return this.apiKey;
  }

  getApiKey() {
    return this.apiKey;
  }
  async generateFlashcards(content) {
    try {
      const response = await axios.post(
        `${this.baseURL}/models/gemma-3-27b-it:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [{
                text: `You are a helpful assistant that creates flashcards. Generate flashcards from the following content and return ONLY a JSON array in this exact format: [{"front": "concept", "back": "definition"}]. Do not include any other text or explanation in your response. Here's the content: ${content}`
              }]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      return this.extractJSON(generatedText);
    } catch (error) {
      console.error('Error generating flashcards:', error.response?.data || error.message);
      throw error;
    }
  }

  async generateQuiz(content, questionTypes = ['multiple_choice', 'true_false', 'identification'], count) {
    try {
      const response = await axios.post(
        `${this.baseURL}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: `Generate a quiz with ${count} questions from this content: ${content}
                     Include these types of questions: ${questionTypes.join(', ')}.
                     Format the response as a JSON array with each question having:
                     - type: the question type
                     - question: the question text
                     - options: array of possible answers (for multiple choice)
                     - correct_answer: the correct answer`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }
      );
      
      try {
        const text = response.data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const quiz = JSON.parse(jsonMatch[0]);
          return quiz;
        }
      } catch (e2) {
        console.error('Array extraction failed:', e2);
      }
      
      throw new Error('Could not parse JSON from API response');
    } catch (error) {
      console.error('Quiz generation error:', error);
      throw error;
    }
  }

  extractJSON(responseText) {
    const cleanText = responseText
      .replace(/```json\n?|\n?```/g, '')
      .replace(/\n\s*/g, '')
      .trim();
    
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      console.error('JSON parse error:', e);
      
      try {
        const arrayMatch = cleanText.match(/\[(.*)\]/s);
        if (arrayMatch) {
          return JSON.parse(arrayMatch[0]);
        }
      } catch (e2) {
        console.error('Array extraction failed:', e2);
      }
      
      throw new Error('Could not parse JSON from API response');
    }
  }

  async generateNotes(content) {
    try {
      const response = await axios.post(
        `${this.baseURL}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: `You are a skilled note-taker. Analyze the entire content holistically and create comprehensive, well-structured notes. Focus on connecting ideas and themes across the entire document, rather than going slide by slide or section by section.

                Generate detailed notes following this:

                Objective: To analyze a PDF document and generate comprehensive and insightful notes tailored to the document's content and intent. 

                INPUT: - PDF Document, Text Transcript

                Process: Intent Identification: Automatic Identification: Analyse the input for keywords, phrases, and structural elements to determine the pdf's intent. 

                Content Analysis & Note Generation: Course Lecture: Employ a tiered note-taking structure (e.g., outlining, bullet points) to capture key concepts, supporting ideas, and examples. Identify important definitions, formulas, and diagrams for inclusion. Create a summary section to synthesize main points. Deep Dive: Divide the notes into relevant sections based on the explored subtopics. Highlight key arguments, evidence, and counterpoints presented. Include relevant quotes and citations. 

                Actionable Guide: Extract and list actionable steps in a clear and concise manner. Include any resources or tools mentioned in the video. Emphasize tips and strategies for successful implementation. 

                Motivational Talk: Identify and extract motivational quotes and impactful statements. Capture the speaker's main message and key takeaways. Summarize inspiring stories or anecdotes shared. 

                Output: Structured Notes: Present the generated notes in a clear and organized format based on the identified intent and content analysis. This may include headings, subheadings, bullet points, numbered lists, and other formatting elements. Format the output in a neat, and clean manner. No need for the confirmation message, jump straight to the notes.

              ${content}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Notes generation error:', error);
      throw error;
    }
  }
}

export default new AIService();

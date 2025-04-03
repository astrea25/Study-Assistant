// src/services/openaiService.js
import axios from 'axios';

class AIService {
  constructor() {
    this.apiType = localStorage.getItem('ai_api_type') || 'google';
    this.apiKey = localStorage.getItem(`${this.apiType}_api_key`) || '';
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    return this.apiType === 'google'
      ? 'https://generativelanguage.googleapis.com/v1beta'
      : 'https://api.openai.com/v1';
  }

  setApiType(type) {
    if (type !== 'google' && type !== 'openai') {
      throw new Error('Invalid API type. Must be "google" or "openai"');
    }
    this.apiType = type;
    localStorage.setItem('ai_api_type', type);
    this.baseURL = this.getBaseURL();
    // Load the API key for the selected type
    this.apiKey = localStorage.getItem(`${type}_api_key`) || '';
    return this.apiType;
  }

  getApiType() {
    return this.apiType;
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem(`${this.apiType}_api_key`, key);
    return this.apiKey;
  }

  getApiKey() {
    return this.apiKey;
  }
  async generateFlashcards(content) {
    try {
      let response;
      const prompt = `You are an AI assistant specialized in generating academic flashcards for effective review.  
          **Task:** Convert the given content into a structured set of flashcards.  
          **Output Format:** Return ONLY a JSON array in the exact format:  
          [
            {"front": "Concept or Question", "back": "Clear, concise, and well-formatted explanation or answer."}
          ]  
          **Guidelines:**  
          - Extract key concepts, terms, or questions from the content.  
          - Provide precise, easy-to-understand definitions or explanations.  
          - Ensure the formatting is clean and optimized for quick review.  
          - Do NOT impose a limit on the number of flashcards.  
          - Do NOT include any additional text, explanations, or formatting outside of the JSON response.  
          **Content:** 
          ${content}`;

      if (this.apiType === 'google') {
        response = await axios.post(
          `${this.baseURL}/models/gemini-2.5-pro-exp-03-25:generateContent?key=${this.apiKey}`,
          {
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return this.extractJSON(response.data.candidates[0].content.parts[0].text);
      } else {
        // OpenAI API
        response = await axios.post(
          `${this.baseURL}/chat/completions`,
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that creates flashcards."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return this.extractJSON(response.data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error generating flashcards:', error.response?.data || error.message);
      throw error;
    }
  }

  async generateQuiz(content, questionTypes = ['multiple_choice', 'true_false', 'identification'], count) {
    try {
      let response;
      const prompt = `Generate a quiz with ${count} questions from this content: ${content}
                     Include these types of questions: ${questionTypes.join(', ')}.
                     Format the response as a JSON array with each question having:
                     - type: the question type
                     - question: the question text
                     - options: array of possible answers (for multiple choice)
                     - correct_answer: the correct answer`;

      if (this.apiType === 'google') {
        response = await axios.post(
          `${this.baseURL}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
          {
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }
        );
      } else {
        // OpenAI API
        response = await axios.post(
          `${this.baseURL}/chat/completions`,
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a quiz generator that creates well-structured quiz questions."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2048
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      let text = this.apiType === 'google'
        ? response.data.candidates[0].content.parts[0].text
        : response.data.choices[0].message.content;

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const quiz = JSON.parse(jsonMatch[0]);
        return quiz;
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
      let response;
      const prompt = `You are a skilled note-taker. Analyze the entire content holistically and create comprehensive, well-structured notes. Focus on connecting ideas and themes across the entire document, rather than going slide by slide or section by section.

        Generate detailed notes following this:

        Objective: To analyze a PDF document and generate comprehensive and insightful notes tailored to the document's content and intent.

        INPUT: - PDF Document, Text Transcript

        Process: Intent Identification: Automatic Identification: Analyse the input for keywords, phrases, and structural elements to determine the pdf's intent.

        Content Analysis & Note Generation: Course Lecture: Employ a tiered note-taking structure (e.g., outlining, bullet points) to capture key concepts, supporting ideas, and examples. Identify important definitions, formulas, and diagrams for inclusion. Create a summary section to synthesize main points. Deep Dive: Divide the notes into relevant sections based on the explored subtopics. Highlight key arguments, evidence, and counterpoints presented. Include relevant quotes and citations.

        Actionable Guide: Extract and list actionable steps in a clear and concise manner. Include any resources or tools mentioned in the video. Emphasize tips and strategies for successful implementation.

        Motivational Talk: Identify and extract motivational quotes and impactful statements. Capture the speaker's main message and key takeaways. Summarize inspiring stories or anecdotes shared.

        Output: Structured Notes: Present the generated notes in a clear and organized format based on the identified intent and content analysis. This may include headings, subheadings, bullet points, numbered lists, and other formatting elements. Format the output in a neat, and clean manner. No need for the confirmation message, jump straight to the notes.

        ${content}`;

      if (this.apiType === 'google') {
        response = await axios.post(
          `${this.baseURL}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
          {
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }
        );
        return response.data.candidates[0].content.parts[0].text;
      } else {
        // OpenAI API
        response = await axios.post(
          `${this.baseURL}/chat/completions`,
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a skilled note-taker that creates comprehensive and well-structured notes."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2048
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data.choices[0].message.content;
      }
    } catch (error) {
      console.error('Notes generation error:', error);
      throw error;
    }
  }
}

export default new AIService();

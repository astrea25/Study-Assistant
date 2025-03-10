class PDFService {
    async extractTextFromPDF(file) {
  
      const formData = new FormData();
      formData.append('pdfFile', file);
  
      try {
        const response = await fetch('http://localhost:5000/extract-text', {
          method: 'POST',
          body: formData
        });
  
        const data = await response.json();
  
        return data.text.trim();
      } catch (error) {
        console.error('❌ Error extracting text from PDF:', error);
        throw error;
      }
    }
  }
  
  export default new PDFService();
  
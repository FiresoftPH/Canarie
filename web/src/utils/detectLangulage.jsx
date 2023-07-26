import hljs from 'highlight.js/lib/core';
// import 'highlight.js/styles/tomorrow.css'; // Replace this with your desired theme

// Import the relevant language syntax modules you want to support
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
// Add more language syntax modules as needed

// Register the language syntax modules with highlight.js
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
// Register more languages as needed

hljs.highlightAll()

// Utility function to detect the language from the code snippet
const detectLanguage = (code) => {
  // Use highlight.js to detect the language
  const result = hljs.highlightAuto(code);
  return result.language;
};

export default detectLanguage;

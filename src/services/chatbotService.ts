import { AnalysisResults } from './analysisService';

/**
 * Interface for FAQ items
 */
interface FAQ {
  question: string;
  answer: string;
}

/**
 * Get initial greeting with conversation starters
 */
export const getInitialGreeting = (): string => {
  return `👋 **Welcome to PancreScan AI Assistant!**

I'm here to help you understand your pancreatic scan results and answer any questions about pancreatic conditions. 

**I can help you with:**
• 🔬 **Explaining your analysis results** - What do the percentages mean?
• 📊 **Understanding the risk levels** - What should you be concerned about?
• 🏥 **Medical information** - Learn about pancreatic conditions
• 📋 **Next steps** - What to discuss with your healthcare provider
• 💡 **Using this system** - How to upload scans or download reports

**Quick conversation starters:**
• "What does my highest risk result mean?"
• "Explain my analysis results"
• "What is pancreatic cancer?"
• "How accurate is this AI analysis?"
• "What should I do next?"

Feel free to ask me anything about your results or pancreatic health! 😊`;
};

/**
 * Get positive acknowledgment responses
 */
const getPositiveResponse = (): string => {
  const responses = [
    "Great question! 😊",
    "I'm happy to help with that! 👍",
    "Excellent! Let me explain that for you. ✨",
    "That's a very important question! 💡",
    "I'm glad you asked about that! 🌟"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Process user message and return chatbot response
 */
export const chatbotRespond = async (
  message: string,
  results?: AnalysisResults
): Promise<string> => {
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase().trim();
  
  // Check if message is empty
  if (!lowerMessage) {
    return "I'm here to help with your questions about pancreatic conditions and analysis results. What would you like to know?";
  }

  // Check for greeting/positive user responses
  if (isGreetingOrPositive(lowerMessage)) {
    return handleGreetingResponse(lowerMessage);
  }
  
  // Check for FAQ matches first
  const faqMatch = findFaqMatch(lowerMessage);
  if (faqMatch) {
    return `${getPositiveResponse()}\n\n${faqMatch}`;
  }
  
  // Check for results-specific questions if results are available
  if (results) {
    const resultsResponse = handleResultsQuestion(lowerMessage, results);
    if (resultsResponse) {
      return `${getPositiveResponse()}\n\n${resultsResponse}`;
    }
  }
  
  // Check for pancreas-related questions
  const pancreasResponse = handlePancreasQuestion(lowerMessage);
  if (pancreasResponse) {
    return `${getPositiveResponse()}\n\n${pancreasResponse}`;
  }
  
  // Check for system usage questions
  const usageResponse = handleUsageQuestion(lowerMessage);
  if (usageResponse) {
    return `${getPositiveResponse()}\n\n${usageResponse}`;
  }
  
  // Check for gratitude or satisfaction
  if (isGratitudeMessage(lowerMessage)) {
    return handleGratitudeResponse();
  }
  
  // Default response for unrecognized questions
  if (isOfftopic(lowerMessage)) {
    return "I'm specifically designed to help with pancreas-related questions, analysis results, and how to use this system. Could you please ask a question related to these topics? 😊";
  }
  
  return "I'm not sure I understand your question. Could you try rephrasing it or ask about:\n• Your pancreatic scan results\n• Pancreatic conditions and symptoms\n• How to use this analysis system\n\nI'm here to help! 💙";
};

/**
 * Check if message is a greeting or positive response
 */
const isGreetingOrPositive = (message: string): boolean => {
  const greetings = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'thanks', 'thank you', 'great', 'awesome', 'perfect', 'excellent',
    'yes', 'okay', 'ok', 'sure', 'sounds good'
  ];
  
  return greetings.some(greeting => message.includes(greeting));
};

/**
 * Handle greeting or positive responses
 */
const handleGreetingResponse = (message: string): string => {
  if (message.includes('thank') || message.includes('thanks')) {
    return "You're very welcome! 😊 I'm here whenever you need help understanding your results or have questions about pancreatic health. Is there anything specific you'd like to know more about?";
  }
  
  if (message.includes('great') || message.includes('awesome') || message.includes('perfect') || message.includes('excellent')) {
    return "I'm so glad that was helpful! 🌟 Feel free to ask me anything else about your scan results, pancreatic conditions, or how to use this system. What would you like to explore next?";
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello there! 👋 I'm your PancreScan AI assistant, ready to help you understand your analysis results and answer questions about pancreatic health. What can I help you with today?";
  }
  
  return "Great! I'm here to help you with any questions about your scan results or pancreatic conditions. What would you like to know? 😊";
};

/**
 * Check if message expresses gratitude
 */
const isGratitudeMessage = (message: string): boolean => {
  const gratitudeWords = [
    'thank you', 'thanks', 'appreciate', 'grateful', 'helpful',
    'that helped', 'that was helpful', 'good to know'
  ];
  
  return gratitudeWords.some(word => message.includes(word));
};

/**
 * Handle gratitude responses
 */
const handleGratitudeResponse = (): string => {
  const responses = [
    "You're so welcome! 😊 I'm really glad I could help you understand better. Remember, it's always important to discuss these results with your healthcare provider. Is there anything else you'd like to know?",
    "I'm happy I could help! 🌟 If you have any other questions about your results or pancreatic health, just ask. I'm here for you!",
    "My pleasure! 💙 Understanding your health information is so important. Feel free to ask me anything else - I'm here to support you through this process.",
    "You're very welcome! 😊 That's exactly what I'm here for. Don't hesitate to reach out if you think of any other questions!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Check if a question is likely off-topic
 */
const isOfftopic = (message: string): boolean => {
  const pancreasTerms = [
    'pancreas', 'pancreat', 'dicom', 'scan', 'imaging', 'cancer', 'cyst', 
    'tumor', 'inflammation', 'analysis', 'result', 'doctor', 'symptom', 
    'treatment', 'diagnosis', 'report', 'image', 'upload', 'heatmap', 'pdf',
    'medical', 'disease', 'condition', 'health'
  ];
  
  // Check if message contains any pancreas-related terms
  return !pancreasTerms.some(term => message.includes(term));
};

/**
 * Calculate Levenshtein distance between two strings
 * (Helper function for fuzzy matching FAQ questions)
 */
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
};

/**
 * Check if the question matches any FAQ
 */
const findFaqMatch = (message: string): string | null => {
  const faqs: FAQ[] = [
    {
      question: "what is pancreatic cancer",
      answer: "Pancreatic cancer is a disease where malignant (cancerous) cells form in the tissues of the pancreas. It typically has few symptoms in its early stages, which makes early detection challenging. Common symptoms in advanced stages include abdominal pain, jaundice, weight loss, and digestive problems. Risk factors include smoking, obesity, diabetes, family history, and certain genetic conditions. Early detection and treatment significantly improve survival rates."
    },
    {
      question: "what does this result mean",
      answer: "The results show the probability of four pancreatic conditions based on AI analysis of your scan. Higher percentages indicate a greater likelihood of that condition. The colored bars represent risk levels: green for low risk, yellow for moderate risk, and red for higher risk. The heatmap shows areas of concern. Remember that these results should be reviewed by a healthcare professional for proper diagnosis, as AI analysis is a screening tool, not a definitive diagnosis."
    },
    {
      question: "how accurate is the ai",
      answer: "Our AI system has been trained on specialized pancreatic imaging datasets and demonstrates high accuracy in detecting patterns associated with pancreatic conditions. However, like all medical AI systems, it has limitations. The accuracy varies by condition and image quality, with typical accuracy ranges of 80-90% for clear presentations of disease. Factors that can affect accuracy include image quality, unusual presentations of disease, and rare variants. This is why we always recommend having the results reviewed by a healthcare professional."
    },
    {
      question: "can i trust this report for medical consultation",
      answer: "While our AI analysis provides valuable insights, it should not replace professional medical advice. The report should be used as a discussion tool with your healthcare provider. Medical imaging interpretation is complex, and AI systems have limitations. Your doctor will consider your complete medical history, symptoms, and possibly additional tests when making a diagnosis. Always consult with a qualified healthcare professional before making any medical decisions based on these results."
    },
    {
      question: "what is chronic pancreatitis",
      answer: "Chronic pancreatitis is a long-lasting inflammation of the pancreas that alters its normal structure and function. It develops gradually, often after multiple episodes of acute pancreatitis. The condition leads to digestive problems, diabetes, and chronic pain as the pancreas loses its ability to produce digestive enzymes and insulin. Common causes include alcoholism, genetic factors, autoimmune conditions, and blockages in the pancreatic duct. Treatment focuses on pain management, enzyme replacement therapy, and lifestyle modifications."
    },
    {
      question: "what are pancreatic cysts",
      answer: "Pancreatic cysts are fluid-filled sacs within the pancreas. While many are benign (non-cancerous), some types can be or become cancerous. Most pancreatic cysts are found incidentally during imaging for other conditions. Different types include serous cystadenomas (rarely become cancerous), mucinous cystic neoplasms (potential to become cancerous), intraductal papillary mucinous neoplasms (IPMNs), and pseudocysts (usually from inflammation). Regular monitoring is important, particularly for mucinous cysts which have higher malignancy potential."
    },
    {
      question: "what is acute pancreatitis",
      answer: "Acute pancreatitis is sudden inflammation of the pancreas that can range from mild discomfort to a life-threatening emergency. Common causes include gallstones, alcohol consumption, certain medications, infections, and trauma. Symptoms typically include severe abdominal pain (often radiating to the back), nausea, vomiting, and fever. Most cases resolve with supportive care including IV fluids, pain management, and fasting, but severe cases can lead to tissue damage, infection, or organ failure. Recurrent episodes may lead to chronic pancreatitis."
    },
    {
      question: "what does the heatmap show",
      answer: "The heatmap overlay highlights areas in your scan that the AI system has identified as potentially abnormal. Warmer colors (red/orange) indicate regions that most strongly influenced the AI's assessment, often corresponding to areas with features associated with disease. These could be areas of inflammation, structural changes, abnormal tissue density, or other concerning characteristics. The heatmap helps visualize where in the pancreas the potential issues are located, which can be valuable information for healthcare professionals during their evaluation."
    }
  ];
  
  // Look for close matches in the FAQs
  for (const faq of faqs) {
    if (message.includes(faq.question) || 
        faq.question.includes(message) ||
        levenshteinDistance(message, faq.question) < 5) {
      return faq.answer;
    }
  }
  
  return null;
};

/**
 * Handle questions about the analysis results
 */
const handleResultsQuestion = (
  message: string,
  results: AnalysisResults
): string | null => {
  // Get highest probability disease
  const highestProbDisease = Object.entries(results.probabilities)
    .reduce((max, [disease, probability]) => 
      (probability as number) > (max[1] as number) ? [disease, probability] : max, 
      ['', 0]
    );
  
  const formatDiseaseName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  if (message.includes("highest risk") || 
      message.includes("most likely") || 
      message.includes("biggest concern")) {
    return `Based on the analysis, ${formatDiseaseName(highestProbDisease[0] as string)} shows the highest probability at ${((highestProbDisease[1] as number) * 100).toFixed(1)}%. ${results.explanations[highestProbDisease[0] as string].split('.')[0]}.`;
  }
  
  if (message.includes("explain my results") || 
      message.includes("interpret these results") ||
      message.includes("what do my results mean")) {
    return `Your scan analysis shows probabilities for four pancreatic conditions. The highest probability is ${((highestProbDisease[1] as number) * 100).toFixed(1)}% for ${formatDiseaseName(highestProbDisease[0] as string)}. ${(highestProbDisease[1] as number) > 0.5 ? "This is considered a significant finding." : "This finding suggests moderate to low likelihood."} The colored bars indicate risk levels (green for low, yellow for moderate, red for higher). Remember that these results should be reviewed by a healthcare professional, as AI analysis is a screening tool, not a definitive diagnosis.`;
  }
  
  return null;
};

/**
 * Handle general pancreas-related questions
 */
const handlePancreasQuestion = (message: string): string | null => {
  // Questions about pancreas function
  if (message.includes("what does the pancreas do") || 
      message.includes("pancreas function") ||
      message.includes("role of pancreas")) {
    return "The pancreas serves two major functions: It produces digestive enzymes that break down food in the small intestine (exocrine function), and it produces hormones like insulin and glucagon that regulate blood sugar levels (endocrine function). Located behind the stomach, this organ is crucial for both digestion and metabolism.";
  }
  
  // Questions about pancreas symptoms
  if (message.includes("symptoms") && 
      (message.includes("pancreas") || message.includes("pancreatic"))) {
    return "Common symptoms of pancreatic issues can include abdominal pain (often radiating to the back), nausea and vomiting, unintended weight loss, jaundice (yellowing of skin/eyes), light-colored stools, dark urine, and new-onset diabetes. Different conditions have different symptom patterns. Pancreatic cancer often has few symptoms until advanced stages, while pancreatitis typically causes severe pain. Any persistent symptoms should be evaluated by a healthcare professional.";
  }
  
  // Questions about treatment
  if (message.includes("treatment") || message.includes("cure") || message.includes("therapy")) {
    return "Treatment for pancreatic conditions varies depending on the specific diagnosis. Acute pancreatitis often requires hospitalization with IV fluids and pain management. Chronic pancreatitis may be managed with enzyme supplements, dietary changes, and pain control. Pancreatic cancer treatment depends on stage and location but may include surgery, chemotherapy, radiation, or targeted therapies. Pancreatic cysts might be monitored, drained, or surgically removed depending on their type and characteristics. All treatment plans should be developed with healthcare professionals based on individual circumstances.";
  }
  
  // Questions about prevention
  if (message.includes("prevent") || message.includes("reduce risk") || message.includes("avoid")) {
    return "While not all pancreatic conditions can be prevented, you can reduce risk factors by: maintaining a healthy weight, avoiding tobacco, limiting alcohol consumption, eating a balanced diet rich in fruits and vegetables, staying physically active, and managing conditions like diabetes. Regular check-ups are important, especially if you have risk factors such as family history of pancreatic conditions or genetic syndromes associated with increased risk.";
  }
  
  return null;
};

/**
 * Handle questions about using the system
 */
const handleUsageQuestion = (message: string): string | null => {
  if (message.includes("how to upload") || 
      message.includes("upload image") || 
      message.includes("submit scan")) {
    return "To upload a scan: 1) Go to the Upload page from the navigation menu, 2) Drag and drop your image onto the upload area or click to browse your files, 3) Select a JPG, PNG, or DICOM (.dcm) file, 4) Click the 'Analyze Image' button to process your scan. The system works best with DICOM files from CT or MRI scans, but can also analyze standard image formats.";
  }
  
  if (message.includes("download report") || 
      message.includes("get pdf") || 
      message.includes("save results")) {
    return "To download your analysis as a PDF report: 1) After your scan has been analyzed and the results are displayed, 2) Look for the 'Download PDF Report' button in the Actions section on the results page, 3) Click this button and the report will be generated and downloaded to your device. The PDF contains a summary of findings, probability scores, medical explanations, and important notes to discuss with your healthcare provider.";
  }
  
  if (message.includes("what file") || 
      message.includes("supported format") || 
      message.includes("file type")) {
    return "The system supports the following file formats: 1) DICOM (.dcm) files from CT and MRI scans - these provide the most accurate analysis as they contain complete medical imaging data, 2) Standard image formats including JPG/JPEG and PNG - these might be screenshots or exported images from medical imaging systems. For optimal results, we recommend using DICOM files whenever possible.";
  }
  
  if (message.includes("how accurate") || 
      message.includes("reliability") || 
      message.includes("trust the result")) {
    return "Our AI system demonstrates high accuracy in detecting patterns associated with pancreatic conditions, with typical accuracy ranges of 80-90% for clear presentations of disease. However, the system has limitations and should be used as a screening tool, not for definitive diagnosis. Factors affecting accuracy include image quality, unusual disease presentations, and rare variants. Always consult with a healthcare professional to interpret the results in the context of your complete medical history.";
  }
  
  return null;
};

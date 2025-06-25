import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, MessageCircle, X, Send, TrendingDown, TrendingUp } from 'lucide-react';
import HeatmapViewer from '../components/results/HeatmapViewer';
import VerticalChart from '../components/results/VerticalChart';
import { generatePdfReport } from '../services/pdfService';
import { chatbotRespond, getInitialGreeting } from '../services/chatbotService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { results, imageUrl } = location.state || {};
  
  if (!results) {
    React.useEffect(() => {
      navigate('/upload');
    }, [navigate]);
    return null;
  }

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [message, setMessage] = useState('');
  
  // Function to format disease name
  const formatDiseaseName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get highest probability disease
  const highestProbDisease = Object.entries(results.probabilities)
    .reduce((max, [disease, probability]) => 
      (probability as number) > (max[1] as number) ? [disease, probability] : max, 
      ['', 0]
    );

  // Generate detailed analysis message
  const generateAnalysisMessage = () => {
    const sortedResults = Object.entries(results.probabilities)
      .sort(([,a], [,b]) => (b as number) - (a as number));
    
    let analysisText = `🔬 **Complete Analysis Results**\n\n`;
    
    analysisText += `**Highest Risk Finding:**\n`;
    analysisText += `${formatDiseaseName(highestProbDisease[0] as string)} - ${((highestProbDisease[1] as number) * 100).toFixed(1)}%\n\n`;
    
    analysisText += `**Full Probability Breakdown:**\n`;
    sortedResults.forEach(([disease, probability]) => {
      const percentage = ((probability as number) * 100).toFixed(1);
      const riskLevel = (probability as number) > 0.5 ? '🔴 High' : '🟢 Low';
      analysisText += `• ${formatDiseaseName(disease)}: ${percentage}% ${riskLevel}\n`;
    });
    
    analysisText += `\n**Clinical Summary:**\n`;
    analysisText += `${results.explanations[highestProbDisease[0] as string]}\n\n`;
    
    if ((highestProbDisease[1] as number) > 0.5) {
      analysisText += `⚠️ **Important Notice:** This analysis shows elevated probability for ${formatDiseaseName(highestProbDisease[0] as string)}. This finding requires immediate professional medical evaluation.\n\n`;
    }
    
    analysisText += `**Recommendations:**\n`;
    analysisText += `• Consult with a healthcare provider to discuss these results\n`;
    analysisText += `• Schedule appropriate follow-up examinations\n`;
    analysisText += `• Keep this analysis report for your medical records\n\n`;
    
    analysisText += `Remember: This AI analysis is a screening tool to assist healthcare providers and should not replace professional medical evaluation.`;
    
    return analysisText;
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: getInitialGreeting(),
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleOpenChatbot = () => {
    setShowChatbot(true);
    
    // Add detailed analysis message when chatbot opens
    const analysisMessage = {
      id: `analysis_${Date.now()}`,
      text: generateAnalysisMessage(),
      sender: 'bot' as const,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, analysisMessage]);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePdfReport(results, imageUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    try {
      const response = await chatbotRespond(message, results);
      setChatMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setChatMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I'm having trouble processing your question. Please try again.",
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    }
  };

 
  const isNormalImage = typeof results.analysisId === 'string' && results.analysisId.toLowerCase().includes('normal');

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/upload')}
          className="flex items-center text-gray-600 hover:text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Upload another scan
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
          <p className="text-gray-600 mt-1">
            AI analysis complete. Review the findings below.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Chart and Statistics */}
          <div className="xl:col-span-2 space-y-6">
            {/* Vertical Chart */}
            <VerticalChart 
              data={results.probabilities}
              title="Disease Probability Analysis"
            />

            {/* Risk Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-green-600 mb-3">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Lowest Risk</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {formatDiseaseName(Object.entries(results.probabilities)
                    .reduce((min, [disease, prob]) => 
                      (prob as number) < (min[1] as number) ? [disease, prob] : min, ['', 1])[0])}
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {(Math.min(...Object.values(results.probabilities).map(p => p as number)) * 100).toFixed(1)}%
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-red-600 mb-3">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Highest Risk</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {formatDiseaseName(highestProbDisease[0] as string)}
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {(highestProbDisease[1] as number * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Important Finding Alert */}
            {(highestProbDisease[1] as number) > 0.5 && (
              <div className="bg-white p-5 rounded-xl shadow-md border border-yellow-200">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-lg mr-3">⚠</span>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Finding:</h4>
                    <p className="text-sm text-yellow-700 leading-relaxed">
                      Analysis indicates elevated probability for {formatDiseaseName(highestProbDisease[0] as string)}.
                      This finding requires professional medical evaluation. Please consult a healthcare provider
                      to discuss these results and determine appropriate next steps.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Scan Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="font-semibold text-xl mb-4">Scan Analysis</h2>
              {imageUrl ? (
                <div className="space-y-4">
                  <HeatmapViewer 
                    originalImage={imageUrl} 
                    showHeatmap={showHeatmap && !isNormalImage}
                  />
                  {!isNormalImage ? (
                    <button
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      className={`w-full px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
                        showHeatmap 
                          ? 'bg-gray-200 text-gray-800' 
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {showHeatmap ? 'Hide Analysis Overlay' : 'Show Analysis Overlay'}
                    </button>
                  ) : (
                    <div className="w-full px-4 py-2 text-sm rounded-lg font-medium bg-green-100 text-green-700 text-center border border-green-300">
                      No heatmap is shown for normal scans.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Scan processed successfully</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Clinical Info and Actions */}
          <div className="space-y-6">
            {/* Clinical Information */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="font-semibold text-xl mb-4">Clinical Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    {formatDiseaseName(highestProbDisease[0] as string)}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed font-bold ${
                      // If all probabilities are below 0.1, show green bold text
                      Object.values(results?.probabilities || {}).every((p) => (p as number) < 0.1)
                        ? 'text-green-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {results.explanations[highestProbDisease[0] as string]}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Medical Notice</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    This AI analysis is provided as a screening tool to assist healthcare providers.
                    It should not replace professional medical evaluation. Please consult with a qualified
                    healthcare provider to discuss these results and determine appropriate next steps.
                    Early detection and proper medical evaluation are essential for optimal outcomes.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="font-semibold text-xl mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full flex items-center justify-center btn btn-primary"
                >
                  {isGeneratingPdf ? (
                    <>
                      <div className="loader mr-2"></div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Detailed Report
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleOpenChatbot}
                  className="w-full flex items-center justify-center btn btn-outline"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discuss Results with AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-[900px] mx-4 h-[85vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-xl">
              <div>
                <h3 className="font-semibold text-lg">Medical AI Assistant</h3>
                <p className="text-sm text-white/80">Ask questions about your results or pancreatic conditions</p>
              </div>
              <button
                onClick={() => setShowChatbot(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-base whitespace-pre-line">{msg.text}</p>
                    <p className="text-xs opacity-70 text-right mt-2">
                      {msg.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your results or pancreatic conditions..."
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-primary text-white px-6 py-3 rounded-r-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                For medical emergencies, please contact emergency services or your healthcare provider immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;

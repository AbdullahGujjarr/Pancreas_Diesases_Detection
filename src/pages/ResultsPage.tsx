import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Share, ArrowLeft, MessageCircle, X, Send, TrendingDown, TrendingUp } from 'lucide-react';
import HeatmapViewer from '../components/results/HeatmapViewer';
import { generatePdfReport } from '../services/pdfService';
import { chatbotRespond } from '../services/chatbotService';
import { Chart } from '../components/results/Chart';

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your PancreScan AI assistant. I can help you understand your results and answer questions about pancreatic conditions.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/upload')}
          className="flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Upload another scan
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
          <p className="text-gray-600 mt-2">
            AI analysis complete. Review the findings below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card bg-white p-6">
              <h2 className="text-xl font-semibold mb-4">Disease Probability Analysis</h2>
              
              <div className="flex items-end justify-around h-64 mb-8">
                {Object.entries(results.probabilities).map(([disease, probability]) => (
                  <div 
                    key={disease} 
                    className="flex flex-col items-center w-16 group relative"
                    title={`${formatDiseaseName(disease)}: ${(probability * 100).toFixed(1)}%`}
                  >
                    <div className="w-8 bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: '200px' }}>
                      <div 
                        className="w-full transition-all duration-500"
                        style={{ 
                          height: `${probability * 100}%`,
                          marginTop: `${100 - (probability * 100)}%`,
                          backgroundColor: probability > 0.5 ? '#ef4444' : 
                                         probability > 0.25 ? '#f59e0b' : '#22c55e'
                        }}
                      ></div>
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-900">
                      {(probability * 100).toFixed(1)}%
                    </span>
                    <span className="mt-1 text-xs text-gray-600 text-center">
                      {formatDiseaseName(disease).split(' ').map((word, i) => (
                        <span key={i} className="block">{word}</span>
                      ))}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-gray-900 text-white text-sm rounded px-2 py-1 whitespace-nowrap">
                        {formatDiseaseName(disease)}: {(probability * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center text-green-600 mb-2">
                    <TrendingDown className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Lowest Risk</span>
                  </div>
                  <h3 className="font-medium text-gray-900">
                    {formatDiseaseName(Object.entries(results.probabilities)
                      .reduce((min, [disease, prob]) => 
                        prob < min[1] ? [disease, prob] : min, ['', 1])[0])}
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {(Math.min(...Object.values(results.probabilities)) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center text-red-600 mb-2">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Highest Risk</span>
                  </div>
                  <h3 className="font-medium text-gray-900">
                    {formatDiseaseName(highestProbDisease[0] as string)}
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    {(highestProbDisease[1] as number * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {(highestProbDisease[1] as number) > 0.5 && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-yellow-600 text-lg mr-2">⚠</span>
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Important Finding:</h4>
                      <p className="text-sm text-yellow-700">
                        Analysis indicates elevated probability for {formatDiseaseName(highestProbDisease[0] as string)}.
                        This finding requires professional medical evaluation. Please consult a healthcare provider
                        to discuss these results and determine appropriate next steps.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="font-semibold text-xl mb-4">Scan Analysis</h2>
              {imageUrl ? (
                <div className="relative">
                  <HeatmapViewer 
                    originalImage={imageUrl} 
                    showHeatmap={showHeatmap} 
                    heatmapData={results.heatmapData}
                  />
                  <div className="mt-4">
                    <button
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
                        showHeatmap 
                          ? 'bg-gray-200 text-gray-800' 
                          : 'bg-primary text-white'
                      }`}
                    >
                      {showHeatmap ? 'Hide Analysis Overlay' : 'Show Analysis Overlay'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Scan processed successfully</p>
                </div>
              )}
            </div>

            <div className="card">
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
                  onClick={() => setShowChatbot(true)}
                  className="w-full flex items-center justify-center btn btn-outline"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discuss Results with AI Assistant
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="font-semibold text-xl mb-4">Clinical Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    {formatDiseaseName(highestProbDisease[0] as string)}
                  </h3>
                  <p className="text-gray-600">
                    {results.explanations[highestProbDisease[0] as string]}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-800 mb-2">Medical Notice</h3>
                  <p className="text-gray-600">
                    This AI analysis is provided as a screening tool to assist healthcare providers.
                    It should not replace professional medical evaluation. Please consult with a qualified
                    healthcare provider to discuss these results and determine appropriate next steps.
                    Early detection and proper medical evaluation are essential for optimal outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                    <p className="text-base">{msg.text}</p>
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
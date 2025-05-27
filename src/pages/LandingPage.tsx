import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileCheck, ShieldCheck, LineChart, Brain } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Advanced Pancreatic Disease Detection
              </h1>
              <p className="text-xl text-blue-100 mt-4 max-w-2xl mx-auto lg:mx-0">
                Upload your pancreatic scan for AI-powered analysis that can detect four major 
                conditions with high precision and professional reporting.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  to="/upload"
                  className="btn bg-white text-primary hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  Start Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="btn bg-transparent text-white border border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Medical professional analyzing scan results" 
                className="rounded-lg shadow-xl w-full object-cover max-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Disease Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Detectable Conditions</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our system analyzes pancreatic imaging to detect four major conditions that 
              affect the pancreas with detailed probability analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Pancreatic Cancer',
                description: 'Early detection of pancreatic adenocarcinoma and other malignancies.',
                color: 'bg-red-50 text-red-600',
                borderColor: 'border-red-200'
              },
              {
                title: 'Chronic Pancreatitis',
                description: 'Identification of long-term inflammation and structural changes.',
                color: 'bg-amber-50 text-amber-600',
                borderColor: 'border-amber-200'
              },
              {
                title: 'Pancreatic Cysts',
                description: 'Detection of various types of fluid-filled sacs in the pancreas.',
                color: 'bg-blue-50 text-blue-600',
                borderColor: 'border-blue-200'
              },
              {
                title: 'Acute Pancreatitis',
                description: 'Recognition of sudden inflammation and early warning signs.',
                color: 'bg-purple-50 text-purple-600',
                borderColor: 'border-purple-200'
              }
            ].map((condition, index) => (
              <div 
                key={index} 
                className={`rounded-xl border ${condition.borderColor} p-6 transition-all duration-300 hover:shadow-md`}
              >
                <div className={`w-12 h-12 ${condition.color} rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{condition.title}</h3>
                <p className="text-gray-600">{condition.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform uses advanced AI to analyze pancreatic imaging and provide detailed 
              diagnostic insights in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileCheck className="w-10 h-10 text-primary" />,
                title: 'Upload Your Scan',
                description: 'Upload pancreatic images in standard formats (JPG, PNG) or medical DICOM format from CT and MRI scans.'
              },
              {
                icon: <Brain className="w-10 h-10 text-primary" />,
                title: 'AI Analysis',
                description: 'Our advanced AI model analyzes the imaging data to detect signs of four major pancreatic diseases.'
              },
              {
                icon: <LineChart className="w-10 h-10 text-primary" />,
                title: 'Get Results',
                description: 'Receive a detailed report with disease probability scores, visualizations, and downloadable PDF summary.'
              }
            ].map((step, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300 relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/upload"
              className="btn btn-primary px-8 py-3 inline-flex items-center"
            >
              Start Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with easy-to-use tools
              to provide comprehensive pancreatic disease detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                title: 'Medical-Grade AI Analysis',
                description: 'Powered by advanced CNN architectures like ResNet and EfficientNet, trained on specialized pancreatic imaging datasets.'
              },
              {
                icon: <Brain className="w-8 h-8 text-primary" />,
                title: 'Smart Pancreas Chatbot',
                description: 'Get answers to your pancreas-related questions from our specialized medical chatbot.'
              },
              {
                icon: <FileCheck className="w-8 h-8 text-primary" />,
                title: 'Comprehensive PDF Reports',
                description: 'Download detailed reports with disease probabilities, visual markers, and medical explanations to share with your doctor.'
              },
              {
                icon: <LineChart className="w-8 h-8 text-primary" />,
                title: 'Visual Heatmap Analysis',
                description: 'View affected areas with advanced visualization techniques like Grad-CAM to highlight regions of concern.'
              }
            ].map((feature, index) => (
              <div key={index} className="flex p-6 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 mr-4">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to analyze your pancreatic scan?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Our AI-powered system is waiting to help provide insights about your pancreatic health.
          </p>
          <Link
            to="/upload"
            className="btn bg-white text-secondary hover:bg-blue-50 px-8 py-3 rounded-lg font-medium inline-flex items-center"
          >
            Start Analysis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
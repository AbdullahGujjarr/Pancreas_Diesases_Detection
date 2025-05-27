import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image, FileWarning, CheckCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { analyzeImage } from '../services/analysisService';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (selectedFile: File) => {
    // Check if file type is supported
    const validImageTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/dicom'];
    if (!validImageTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.dcm')) {
      toast.error('Please upload a valid image file (JPG, PNG, or DICOM)');
      return;
    }

    setFile(selectedFile);

    // Create preview for standard images (not DICOM)
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For DICOM files, show a placeholder
      setPreview(null);
    }
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Trigger file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clear selected file
  const handleClearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select an image to analyze');
      return;
    }

    setIsLoading(true);
    
    try {
      // Process the image - in a real app, this would send to backend
      const results = await analyzeImage(file);
      
      // Navigate to results page with the analysis data
      navigate('/results', { state: { results, imageUrl: preview } });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Pancreatic Scan</h1>
          <p className="mt-4 text-lg text-gray-600">
            Upload your pancreatic image for AI analysis. We support JPG, PNG, and DICOM files.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card mb-8">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
              } transition-all duration-200 cursor-pointer`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleButtonClick}
            >
              {!file ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Drag and drop your image here
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Supported formats: JPG, PNG, DICOM (.dcm)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearFile();
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {preview ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={preview} 
                        alt="Upload preview" 
                        className="max-h-64 max-w-full rounded object-contain"
                      />
                      <p className="mt-2 text-sm text-gray-600">
                        {file.name} ({(file.size / 1024).toFixed(0)} KB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="h-64 w-64 bg-gray-200 rounded flex items-center justify-center">
                        <Image className="h-16 w-16 text-gray-400" />
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        DICOM file: {file.name} ({(file.size / 1024).toFixed(0)} KB)
                      </p>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                accept=".jpg,.jpeg,.png,.dcm,application/dicom,image/dicom"
              />
            </div>
          </div>

          {/* File Format Information */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-blue-50 border border-blue-200">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Standard Image Formats</h3>
                  <p className="text-sm text-blue-800">
                    JPEG and PNG files from ultrasound, CT, or MRI screenshots can be analyzed, 
                    but may provide lower accuracy compared to DICOM files.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card bg-green-50 border border-green-200">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-green-900 mb-2">DICOM Medical Format</h3>
                  <p className="text-sm text-green-800">
                    For optimal results, upload DICOM (.dcm) files directly from your CT or MRI scan,
                    which preserve all medical imaging data for accurate analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="card bg-gray-50 border border-gray-200 mb-8">
            <div className="flex items-start">
              <FileWarning className="h-6 w-6 text-gray-500 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Privacy Notice</h3>
                <p className="text-sm text-gray-600">
                  Your images are processed securely and are not stored permanently on our servers.
                  All analysis is performed in your browser and through secure API calls.
                  We recommend removing any personal identifying information from images before upload.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!file || isLoading}
              className={`btn btn-primary px-8 py-3 flex items-center ${
                (!file || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="loader mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Image
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ArrowRight = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

export default UploadPage;
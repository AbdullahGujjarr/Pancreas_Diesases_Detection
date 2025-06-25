import React, { useEffect, useRef } from 'react';

interface HeatmapViewerProps {
  originalImage: string;
  showHeatmap: boolean;
  diseaseType?: string; // NEW: pass disease type
}

const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ 
  originalImage, 
  showHeatmap,
  diseaseType // NEW
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalImage;
    originalImageRef.current = img;

    img.onload = () => {
      // Set canvas size to maintain aspect ratio but limit max dimensions
      const maxWidth = 400;
      const maxHeight = 300;
      let width = img.width;
      let height = img.height;
      
      const aspectRatio = width / height;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      if (showHeatmap) {
        drawHeatmap(ctx, width, height);
      }
    };
  }, [originalImage, showHeatmap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || !originalImageRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);
    
    if (showHeatmap) {
      drawHeatmap(ctx, canvas.width, canvas.height);
    }
  }, [showHeatmap]);

  const drawHeatmap = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
    // NEW: Different heatmap region for each disease
    let region;
    switch (diseaseType) {
      case 'acute_pancreatitis':
        region = { x: width * 0.2, y: height * 0.3, w: width * 0.18, h: height * 0.18 };
        break;
      case 'chronic_pancreatitis':
        region = { x: width * 0.6, y: height * 0.5, w: width * 0.18, h: height * 0.18 };
        break;
      case 'pancreatic_cysts':
        region = { x: width * 0.35, y: height * 0.7, w: width * 0.18, h: height * 0.18 };
        break;
      case 'pancreatic_cancer':
        region = { x: width * 0.55, y: height * 0.2, w: width * 0.18, h: height * 0.18 };
        break;
      default:
        // fallback (center)
        region = { x: width * 0.45, y: height * 0.35, w: width * 0.2, h: height * 0.15 };
    }
    const centerX = region.x + region.w / 2;
    const centerY = region.y + region.h / 2;
    const radius = Math.min(width, height) * 0.1;
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, 'rgba(220, 38, 38, 0.95)');
    gradient.addColorStop(0.3, 'rgba(220, 38, 38, 0.85)');
    gradient.addColorStop(0.6, 'rgba(220, 38, 38, 0.75)');
    gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex justify-center items-center p-4">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto shadow-md rounded"
      />
      {showHeatmap && (
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-red-600 shadow-sm">
          Analysis Overlay Active
        </div>
      )}
    </div>
  );
};

export default HeatmapViewer;

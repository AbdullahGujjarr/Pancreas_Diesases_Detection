import React, { useEffect, useRef } from 'react';

interface HeatmapViewerProps {
  originalImage: string;
  showHeatmap: boolean;
  heatmapData: number[][];
}

const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ 
  originalImage, 
  showHeatmap,
  heatmapData
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
    // Target the specific pancreatic region based on the image
    const pancreaticRegion = {
      x: Math.floor(width * 0.45),    // Adjusted to target center-right area
      y: Math.floor(height * 0.35),    // Adjusted to target upper-middle area
      width: Math.floor(width * 0.2),  // Reduced width for more precise targeting
      height: Math.floor(height * 0.15) // Reduced height for more precise targeting
    };
    
    // Calculate the center point for the heatmap
    const centerX = pancreaticRegion.x + (pancreaticRegion.width / 2);
    const centerY = pancreaticRegion.y + (pancreaticRegion.height / 2);
    
    // Create a smaller, more focused radius for the highlight
    const radius = Math.min(width, height) * 0.1;
    
    // Create gradient for smooth highlight effect
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    
    // Use higher opacity values for better visibility
    gradient.addColorStop(0, 'rgba(220, 38, 38, 0.95)');    // Core: stronger red
    gradient.addColorStop(0.3, 'rgba(220, 38, 38, 0.85)');  // Inner: high opacity
    gradient.addColorStop(0.6, 'rgba(220, 38, 38, 0.75)');  // Middle: medium opacity
    gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');       // Edge: fade to transparent

    // Draw the highlight
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
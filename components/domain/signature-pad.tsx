'use client';

import * as React from 'react';
import { Eraser, Check, RotateCcw, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignaturePadProps {
  onSave?: (signature: string) => void;
  onClear?: () => void;
  width?: number;
  height?: number;
  strokeColor?: string;
  backgroundColor?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function SignaturePad({
  onSave,
  onClear,
  width = 400,
  height = 200,
  strokeColor = '#1a1a2e',
  backgroundColor = '#ffffff',
  label = 'Signature',
  required = false,
  disabled = false,
}: SignaturePadProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [hasSignature, setHasSignature] = React.useState(false);
  const [lastPos, setLastPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [backgroundColor, strokeColor]);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (disabled) return;

    const coords = getCoordinates(e);
    setIsDrawing(true);
    setLastPos(coords);
    setHasSignature(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || disabled) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coords = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastPos(coords);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onClear?.();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSave?.(dataUrl);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSignature}
            disabled={disabled || !hasSignature}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div
        className={`relative border-2 rounded-lg overflow-hidden transition-colors ${
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : hasSignature
            ? 'border-primary-300'
            : 'border-gray-300 border-dashed'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`w-full touch-none ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {!hasSignature && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <Pen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sign here</p>
            </div>
          </div>
        )}

        {/* Signature line */}
        <div className="absolute bottom-6 left-8 right-8 border-b border-gray-300" />
        <div className="absolute bottom-2 left-8 text-xs text-gray-400">
          Sign above the line
        </div>
      </div>

      {hasSignature && onSave && (
        <div className="flex justify-end">
          <Button type="button" size="sm" onClick={saveSignature}>
            <Check className="h-4 w-4 mr-2" />
            Accept Signature
          </Button>
        </div>
      )}
    </div>
  );
}

// Inline signature preview component
interface SignaturePreviewProps {
  signature: string;
  label?: string;
  className?: string;
}

export function SignaturePreview({
  signature,
  label = 'Signature',
  className = '',
}: SignaturePreviewProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
        {signature ? (
          <img
            src={signature}
            alt="Signature"
            className="max-h-24 object-contain mx-auto"
          />
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
            No signature
          </div>
        )}
      </div>
    </div>
  );
}

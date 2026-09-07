'use client';

import React, { useState, useRef, useEffect } from 'react';
import './form.css';

export interface ColorPickerProps {
  color?: string; // hex e.g. #00824c
  onChange?: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color = '#00824c',
  onChange,
  className = '',
}) => {
  const [hue, setHue] = useState(155); // 0-360
  const [sat, setSat] = useState(100); // 0-100%
  const [val, setVal] = useState(50); // 0-100%
  const [alpha, setAlpha] = useState(1); // 0-1

  const canvasRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const alphaSliderRef = useRef<HTMLDivElement>(null);

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const currentHex = hslToHex(hue, sat, val);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    updateCanvasPosition(e);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateCanvasPosition(moveEvent);
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const updateCanvasPosition = (e: MouseEvent | React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const newSat = Math.round((x / rect.width) * 100);
    const newVal = Math.round((1 - y / rect.height) * 100);
    setSat(newSat);
    setVal(newVal);
    onChange?.(hslToHex(hue, newSat, newVal));
  };

  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    updateHuePosition(e);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateHuePosition(moveEvent);
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const updateHuePosition = (e: MouseEvent | React.MouseEvent) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const newHue = Math.round((y / rect.height) * 360);
    setHue(newHue);
    onChange?.(hslToHex(newHue, sat, val));
  };

  const handleAlphaMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    updateAlphaPosition(e);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateAlphaPosition(moveEvent);
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const updateAlphaPosition = (e: MouseEvent | React.MouseEvent) => {
    if (!alphaSliderRef.current) return;
    const rect = alphaSliderRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const newAlpha = Math.round((1 - y / rect.height) * 100) / 100;
    setAlpha(newAlpha);
  };

  const baseHueColor = `hsl(${hue}, 100%, 50%)`;

  return (
    <div className={`sirius-colorpicker ${className}`}>
      {/* 2D Saturation / Value canvas */}
      <div
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        className="sirius-colorpicker__canvas-box"
        style={{
          backgroundColor: baseHueColor,
          backgroundImage:
            'linear-gradient(to right, #fff 0%, transparent 100%), linear-gradient(to top, #000 0%, transparent 100%)',
        }}
      >
        <div
          className="sirius-colorpicker__canvas-thumb"
          style={{
            left: `${sat}%`,
            top: `${100 - val}%`,
            backgroundColor: currentHex,
          }}
        />
      </div>

      {/* Hue vertical slider */}
      <div
        ref={hueSliderRef}
        onMouseDown={handleHueMouseDown}
        className="sirius-colorpicker__slider sirius-colorpicker__slider--hue"
      >
        <div
          className="sirius-colorpicker__slider-thumb"
          style={{
            top: `${(hue / 360) * 100}%`,
            backgroundColor: baseHueColor,
          }}
        />
      </div>

      {/* Alpha vertical slider */}
      <div
        ref={alphaSliderRef}
        onMouseDown={handleAlphaMouseDown}
        className="sirius-colorpicker__slider sirius-colorpicker__slider--alpha"
        style={{ '--current-hue-color': currentHex } as React.CSSProperties}
      >
        <div
          className="sirius-colorpicker__slider-thumb"
          style={{
            top: `${(1 - alpha) * 100}%`,
            backgroundColor: currentHex,
          }}
        />
      </div>
    </div>
  );
};

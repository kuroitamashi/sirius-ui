'use client';

import { Icon } from '../Icon/Icon';

import React, { useRef, useState } from 'react';
import './form.css';

export interface DropAreaProps {
  label?: string;
  subtext?: string;
  buttonText?: string;
  compact?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: FileList) => void;
  className?: string;
}

export const DropArea: React.FC<DropAreaProps> = ({
  label,
  subtext = 'ou glissez-déposez des fichiers pour téléverser',
  buttonText = 'Ajouter des fichiers',
  compact = false,
  disabled = false,
  accept,
  multiple = true,
  onFilesSelected,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected?.(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected?.(e.target.files);
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`sirius-drop-area sirius-drop-area--compact ${
          isDragOver ? 'sirius-drop-area--dragover' : ''
        } ${disabled ? 'sirius-field--disabled' : ''} ${className}`}
        title="Ajouter un fichier"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Icon name="upload" size={20} style={{ color: '#5c5f62' }} />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`sirius-drop-area ${isDragOver ? 'sirius-drop-area--dragover' : ''} ${
        disabled ? 'sirius-field--disabled' : ''
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {label && <span className="sirius-field__label">{label}</span>}

      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        className="sirius-btn sirius-btn--secondary"
        style={{ pointerEvents: 'none', minHeight: '32px', fontSize: '13px' }}
      >
        {buttonText}
      </button>

      {subtext && <span className="sirius-drop-area__subtext">{subtext}</span>}
    </div>
  );
};

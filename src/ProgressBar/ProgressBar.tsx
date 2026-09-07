import React from 'react';
import './progress-bar.css';

export interface SiriusProgressBarProps {
  progress: number; // 0 to 100
  size?: 'small' | 'medium' | 'large';
  tone?: 'primary' | 'success';
  className?: string;
  ariaLabel?: string;
}

export function SiriusProgressBar({
  progress,
  size = 'medium',
  tone = 'primary',
  className = '',
  ariaLabel = 'Progression',
}: SiriusProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={`sirius-progress-bar sirius-progress-bar--${size} sirius-progress-bar--${tone} ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div
        className="sirius-progress-bar__indicator"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

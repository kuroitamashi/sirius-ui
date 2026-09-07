'use client';

import { Icon } from '../Icon/Icon';

import React, { useState } from 'react';
import './form.css';

export interface DateRange {
  start?: Date;
  end?: Date;
}

export interface DatePickerProps {
  selectedDate?: Date;
  selectedRange?: DateRange;
  onSelectDate?: (date: Date) => void;
  onSelectRange?: (range: DateRange) => void;
  mode?: 'single' | 'range';
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  selectedRange,
  onSelectDate,
  onSelectRange,
  mode = 'single',
  className = '',
}) => {
  const initialDate = selectedDate || selectedRange?.start || new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  const dayNames = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isSameDay = (d1?: Date, d2?: Date) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isDateBetween = (date: Date, start?: Date, end?: Date) => {
    if (!start || !end) return false;
    const time = date.getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return time > s && time < e;
  };

  const handleDayClick = (dayNumber: number) => {
    const clickedDate = new Date(currentYear, currentMonth, dayNumber);

    if (mode === 'single') {
      onSelectDate?.(clickedDate);
    } else if (mode === 'range') {
      if (!selectedRange?.start || (selectedRange.start && selectedRange.end)) {
        onSelectRange?.({ start: clickedDate, end: undefined });
      } else if (selectedRange.start && !selectedRange.end) {
        if (clickedDate < selectedRange.start) {
          onSelectRange?.({ start: clickedDate, end: selectedRange.start });
        } else {
          onSelectRange?.({ start: selectedRange.start, end: clickedDate });
        }
      }
    }
  };

  return (
    <div className={`sirius-datepicker ${className}`}>
      {/* Header with Month / Year and Prev / Next */}
      <div className="sirius-datepicker__header">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="sirius-datepicker__nav-btn"
          aria-label="Mois précédent"
        >
          <Icon name="chevron-left" size={16} />
        </button>

        <span className="sirius-datepicker__month-title">
          {monthNames[currentMonth]} {currentYear}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="sirius-datepicker__nav-btn"
          aria-label="Mois suivant"
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>

      {/* Grid: Day names */}
      <div className="sirius-datepicker__grid">
        {dayNames.map((name) => (
          <div key={name} className="sirius-datepicker__day-name">
            {name}
          </div>
        ))}

        {/* Empty cells before month start */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="sirius-datepicker__day-cell sirius-datepicker__day-cell--empty" />
        ))}

        {/* Day numbers */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const thisDate = new Date(currentYear, currentMonth, dayNumber);

          const isSelected =
            (mode === 'single' && isSameDay(thisDate, selectedDate)) ||
            (mode === 'range' && (isSameDay(thisDate, selectedRange?.start) || isSameDay(thisDate, selectedRange?.end)));

          const isRangeStart = mode === 'range' && isSameDay(thisDate, selectedRange?.start);
          const isRangeEnd = mode === 'range' && isSameDay(thisDate, selectedRange?.end);
          const isInRange = mode === 'range' && isDateBetween(thisDate, selectedRange?.start, selectedRange?.end);

          return (
            <div
              key={dayNumber}
              onClick={() => handleDayClick(dayNumber)}
              className={`sirius-datepicker__day-cell ${
                isSelected ? 'sirius-datepicker__day-cell--selected' : ''
              } ${isInRange ? 'sirius-datepicker__day-cell--in-range' : ''} ${
                isRangeStart ? 'sirius-datepicker__day-cell--range-start' : ''
              } ${isRangeEnd ? 'sirius-datepicker__day-cell--range-end' : ''}`}
            >
              {dayNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
};

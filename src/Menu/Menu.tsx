'use client';

import React, { useState, useRef, useEffect } from 'react';
import './menu.css';

export interface SiriusMenuItem {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  onClick?: () => void;
  href?: string;
}

export interface SiriusMenuProps {
  trigger: React.ReactNode;
  items: SiriusMenuItem[];
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

export function SiriusMenu({
  trigger,
  items,
  open: controlledOpen,
  onClose,
  className = '',
}: SiriusMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(!internalOpen);
    }
  };

  const close = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    }
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`sirius-menu ${className}`} ref={menuRef}>
      <div onClick={toggle} role="button" tabIndex={0} style={{ display: 'inline-flex' }}>
        {trigger}
      </div>

      {isOpen && (
        <div className="sirius-menu__popover" role="menu">
          {items.map((item, idx) => (
            <React.Fragment key={item.id ?? idx}>
              {item.href ? (
                <a
                  href={item.href}
                  className={`sirius-menu__item ${
                    item.destructive ? 'sirius-menu__item--destructive' : ''
                  }`}
                  role="menuitem"
                  onClick={close}
                >
                  {item.icon && <span className="sirius-menu__item-icon">{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ) : (
                <button
                  type="button"
                  className={`sirius-menu__item ${
                    item.destructive ? 'sirius-menu__item--destructive' : ''
                  }`}
                  role="menuitem"
                  onClick={() => {
                    item.onClick?.();
                    close();
                  }}
                >
                  {item.icon && <span className="sirius-menu__item-icon">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant statique pour afficher la liste déroulante seule (comme dans Figma)
export function SiriusActionList({
  items,
  className = '',
}: {
  items: SiriusMenuItem[];
  className?: string;
}) {
  return (
    <div className={`sirius-menu__popover ${className}`} style={{ position: 'static' }}>
      {items.map((item, idx) => (
        <button
          key={item.id ?? idx}
          type="button"
          className={`sirius-menu__item ${
            item.destructive ? 'sirius-menu__item--destructive' : ''
          }`}
          onClick={item.onClick}
        >
          {item.icon && <span className="sirius-menu__item-icon">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

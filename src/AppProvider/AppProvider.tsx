'use client';

import React, { createContext, useContext, useMemo, useEffect, useRef } from 'react';
import { enTranslations, frTranslations, type SiriusTranslations } from './translations';
import './app-provider.css';

export type SiriusLinkComponent = React.ComponentType<any>;

export interface SiriusAppContextType {
  /** Dictionnaire de traduction actif */
  translations: SiriusTranslations;
  /** Fonction utilitaire pour traduire une clé avec variables dynamiques */
  translate: (key: string, replacements?: Record<string, string | number>, defaultText?: string) => string;
  /** Composant de lien personnalisé (ex: Next.js Link) */
  linkComponent?: SiriusLinkComponent;
  /** Thème actif */
  theme: 'light' | 'dark';
  /** Conteneur DOM pour les portails (modales, popovers) */
  portalsContainer: HTMLElement | null;
}

const SiriusAppContext = createContext<SiriusAppContextType>({
  translations: frTranslations,
  translate: (_key, _replacements, defaultText) => defaultText || '',
  theme: 'light',
  portalsContainer: null,
});

export interface SiriusAppProviderProps {
  /**
   * Dictionnaire de traductions ou code de langue ('fr' | 'en').
   * Par défaut : 'fr' (Français).
   */
  i18n?: SiriusTranslations | 'fr' | 'en';
  /**
   * Composant de lien de votre framework (ex: Next.js `Link` de `next/link`
   * ou React Router `Link`).
   */
  linkComponent?: SiriusLinkComponent;
  /**
   * Thème d'interface : 'light' ou 'dark'.
   * Par défaut : 'light'.
   */
  theme?: 'light' | 'dark';
  /** Enfants enveloppés dans le contexte Sirius */
  children: React.ReactNode;
}

export const SiriusAppProvider: React.FC<SiriusAppProviderProps> = ({
  i18n = 'fr',
  linkComponent,
  theme = 'light',
  children,
}) => {
  const portalsContainerRef = useRef<HTMLDivElement | null>(null);

  // Résolution du dictionnaire de traductions
  const translations: SiriusTranslations = useMemo(() => {
    if (typeof i18n === 'string') {
      return i18n === 'en' ? enTranslations : frTranslations;
    }
    return i18n || frTranslations;
  }, [i18n]);

  // Fonction de traduction avec support des clés imbriquées ("Polaris.ResourceList.showing")
  // et remplacement des tokens ("{count}", "{resource}")
  const translate = useMemo(() => {
    return (key: string, replacements?: Record<string, string | number>, defaultText?: string): string => {
      const keys = key.split('.');
      let current: any = translations;

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          current = undefined;
          break;
        }
      }

      let text = typeof current === 'string' ? current : defaultText || key;

      if (replacements) {
        Object.entries(replacements).forEach(([token, value]) => {
          text = text.replace(new RegExp(`\\{${token}\\}`, 'g'), String(value));
        });
      }

      return text;
    };
  }, [translations]);

  // Application de la classe de thème sur document.body si disponible
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.body.classList.add('sirius-theme--dark');
      } else {
        document.body.classList.remove('sirius-theme--dark');
      }
    }
  }, [theme]);

  const contextValue = useMemo<SiriusAppContextType>(
    () => ({
      translations,
      translate,
      linkComponent,
      theme,
      portalsContainer: portalsContainerRef.current,
    }),
    [translations, translate, linkComponent, theme]
  );

  return (
    <SiriusAppContext.Provider value={contextValue}>
      <div className="sirius-app-provider">
        {children}
        {/* Conteneur global pour les portails (Popovers, Modales, Tooltips) */}
        <div id="sirius-portals-container" ref={portalsContainerRef} />
      </div>
    </SiriusAppContext.Provider>
  );
};

/**
 * Hook d'accès au contexte Sirius global
 */
export const useSiriusApp = (): SiriusAppContextType => {
  return useContext(SiriusAppContext);
};

/**
 * Hook d'accès direct au composant de lien personnalisé
 */
export const useSiriusLink = (): SiriusLinkComponent | undefined => {
  const { linkComponent } = useContext(SiriusAppContext);
  return linkComponent;
};

/**
 * Hook d'accès à la fonction de traduction
 */
export const useSiriusI18n = () => {
  const { translate } = useContext(SiriusAppContext);
  return { t: translate };
};

export default SiriusAppProvider;

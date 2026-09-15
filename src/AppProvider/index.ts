export {
  SiriusAppProvider,
  SiriusAppProvider as AppProvider,
  useSiriusApp,
  useSiriusLink,
  useSiriusI18n,
} from './AppProvider';

export type {
  SiriusAppProviderProps,
  SiriusAppProviderProps as AppProviderProps,
  SiriusAppContextType,
  SiriusLinkComponent,
} from './AppProvider';

export { frTranslations, enTranslations } from './translations';
export type { SiriusTranslations } from './translations';

export default './AppProvider';

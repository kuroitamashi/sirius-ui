/**
 * Design System Sirius
 * Composants et tokens inspirÃ©s du standard Sirius UI
 */

import './tokens.css';

export { SiriusButton, SiriusButton as Button } from './Button/Button';
export type { SiriusButtonProps, SiriusButtonProps as ButtonProps } from './Button/Button';

export { SiriusSplitButton, SplitButton } from './Button/SplitButton';
export type {
  SiriusSplitButtonProps,
  SiriusSplitButtonPrimaryAction,
  SplitButtonProps,
} from './Button/SplitButton';

export { SiriusButtonGroup } from './ButtonGroup/ButtonGroup';
export type { SiriusButtonGroupProps } from './ButtonGroup/ButtonGroup';

export { SiriusClickableChip } from './ClickableChip/ClickableChip';
export type { SiriusClickableChipProps } from './ClickableChip/ClickableChip';

export { SiriusMenu } from './Menu/Menu';
export type { SiriusMenuProps, SiriusMenuItem } from './Menu/Menu';

export { SiriusActionList, ActionList } from './ActionList';

export { SiriusBulkActions, BulkActions } from './BulkActions';
export type {
  SiriusBulkActionsProps,
  SiriusBulkAction,
  SiriusBulkActionMenu,
  BulkActionsProps,
} from './BulkActions';
export type {
  SiriusActionListProps,
  SiriusActionListItemDescriptor,
  SiriusActionListSection,
  ActionListProps,
  ActionListItemDescriptor,
  ActionListSection,
} from './ActionList';

export { SiriusLink } from './Link/Link';
export type { SiriusLinkProps } from './Link/Link';

export { SiriusCard, SiriusCardSection, Card } from './Card/Card';
export type {
  SiriusCardProps,
  SiriusCardSectionProps,
  SiriusCardAction,
  SiriusCardProps as CardProps,
} from './Card/Card';

export { SiriusBadge } from './Badge/Badge';
export type { SiriusBadgeProps, SiriusBadgeTone, SiriusBadgePip } from './Badge/Badge';

export { SiriusMomoField } from './MomoField/MomoField';
export type { SiriusMomoFieldProps } from './MomoField/MomoField';

export { SiriusBanner } from './Banner/Banner';
export type { SiriusBannerProps, SiriusBannerTone, SiriusBannerLayout, SiriusBannerAction } from './Banner/Banner';

export { SiriusCalloutCard } from './CalloutCard/CalloutCard';
export type { SiriusCalloutCardProps, SiriusCalloutCardAction } from './CalloutCard/CalloutCard';

export { SiriusSpinner } from './Spinner/Spinner';
export type { SiriusSpinnerProps } from './Spinner/Spinner';
export { SiriusThumbnail, SiriusThumbnail as Thumbnail } from './Thumbnail/Thumbnail';
export type { SiriusThumbnailProps } from './Thumbnail/Thumbnail';

export { SiriusMetricCard } from './MetricCard/MetricCard';
export type { SiriusMetricCardProps } from './MetricCard/MetricCard';

export { SiriusAccordion, SiriusAccordionItem } from './Accordion/Accordion';
export type { SiriusAccordionItemProps } from './Accordion/Accordion';

export { SiriusProgressBar } from './ProgressBar/ProgressBar';
export type { SiriusProgressBarProps } from './ProgressBar/ProgressBar';

export { SiriusModal } from './Modal/Modal';
export type { SiriusModalProps, SiriusModalAction } from './Modal/Modal';

export { SiriusTooltip, SiriusTooltipBubble } from './Tooltip/Tooltip';
export type { SiriusTooltipProps, SiriusTooltipBubbleProps } from './Tooltip/Tooltip';

export { SiriusDivider } from './Divider/Divider';
export type { SiriusDividerProps } from './Divider/Divider';


export { SiriusDataTable, DataTable } from './DataTable';
export type {
  SiriusDataTableProps,
  SiriusDataTablePagination,
  ColumnContentType,
  SortDirection,
  DataTableRowTone,
} from './DataTable';

export { SiriusList, SiriusListItem } from './List/List';
export type { SiriusListProps, SiriusListItemProps } from './List/List';

export { SiriusPageHeader } from './PageHeader/PageHeader';
export type { SiriusPageHeaderProps, SiriusBreadcrumbItem } from './PageHeader/PageHeader';

export { SiriusContextualSaveBar, ContextualSaveBar } from './ContextualSaveBar';
export type { SiriusContextualSaveBarProps, SiriusContextualSaveBarAction } from './ContextualSaveBar';

export { SiriusAccountConnection, AccountConnection } from './AccountConnection';
export type {
  SiriusAccountConnectionProps,
  SiriusAccountConnectionAction,
  AccountConnectionProps,
} from './AccountConnection';

export * from './Form';
export * from './DatePicker';

export { Icon } from './Icon/Icon';
export type { IconProps, IconName } from './Icon/Icon';
export { SIRIUS_ICONS, ICON_ALIASES } from './Icon/sirius-icons';

export { SiriusPagination, Pagination } from './Pagination';
export type { SiriusPaginationProps, PaginationProps } from './Pagination';

export {
  SiriusAppProvider,
  AppProvider,
  useSiriusApp,
  useSiriusLink,
  useSiriusI18n,
  frTranslations,
  enTranslations,
} from './AppProvider';
export type {
  SiriusAppProviderProps,
  AppProviderProps,
  SiriusAppContextType,
  SiriusLinkComponent,
  SiriusTranslations,
} from './AppProvider';

export { SiriusAutocomplete, Autocomplete } from './Autocomplete';
export type {
  SiriusAutocompleteProps,
  AutocompleteProps,
  AutocompleteOption,
  AutocompleteSection,
  AutocompleteAction,
} from './Autocomplete';

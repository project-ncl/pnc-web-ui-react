import { ExpandableSection as ExpandableSectionPF } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

export interface IExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: (isExpanded: boolean) => void;
}

/**
 * Section of content that can be collapsed and expanded.
 * Can be used as a form section.
 *
 * @param title - Title of the section
 * @param isExpanded - Section expand state
 * @param onToggle - Callback to change the expand state with
 * @param children - Section contents
 */
export const ExpandableSection = ({ children, title, isExpanded, onToggle }: PropsWithChildren<IExpandableSectionProps>) => (
  <ExpandableSectionPF toggleText={title} isExpanded={isExpanded} onToggle={(_, value) => onToggle(value)}>
    {children}
  </ExpandableSectionPF>
);

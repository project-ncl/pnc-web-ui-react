import { ExpandableSection as ExpandableSectionPF } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { PlainContentBox } from 'components/ContentBox/PlainContentBox';

import styles from './ExpandableSection.module.css';

export interface IExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: (isExpanded: boolean) => void;
  marginBottom?: boolean;
}

/**
 * Section of content that can be collapsed and expanded.
 * Can be used as a form section.
 *
 * @param title - Title of the section
 * @param isExpanded - Section expand state
 * @param onToggle - Callback to change the expand state with
 * @param marginBottom - Whether to set margin below the expand toggle / expanded section
 * @param children - Section contents
 */
export const ExpandableSection = ({
  children,
  title,
  isExpanded,
  onToggle,
  marginBottom,
}: PropsWithChildren<IExpandableSectionProps>) => (
  <PlainContentBox marginBottom={marginBottom}>
    <ExpandableSectionPF
      toggleText={title}
      isExpanded={isExpanded}
      onToggle={(_, value) => onToggle(value)}
      className={styles['expandable-section']}
    >
      {children}
    </ExpandableSectionPF>
  </PlainContentBox>
);

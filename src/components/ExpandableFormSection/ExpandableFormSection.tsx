import { ExpandableSection } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

export interface IExpandableFormSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: (isExpanded: boolean) => void;
}

export const ExpandableFormSection = ({
  children,
  title,
  isExpanded,
  onToggle,
}: PropsWithChildren<IExpandableFormSectionProps>) => (
  <ExpandableSection toggleText={title} isExpanded={isExpanded} onToggle={onToggle} isIndented>
    {children}
  </ExpandableSection>
);

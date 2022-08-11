import { ToolbarContent, Toolbar as ToolbarPF } from '@patternfly/react-core';
import React from 'react';

import styles from './Toolbar.module.css';

interface IToolbarProps {}

export const Toolbar = ({ children }: React.PropsWithChildren<IToolbarProps>) => (
  <div className={styles['toolbar']}>
    <ToolbarPF>
      <ToolbarContent>{children}</ToolbarContent>
    </ToolbarPF>
  </div>
);

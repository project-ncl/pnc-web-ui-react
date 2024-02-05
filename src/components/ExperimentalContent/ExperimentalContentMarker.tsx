import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

import styles from './ExperimentalContentMarker.module.css';

interface IExperimentalContentMarkerProps {
  dataSource: 'mock' | 'experimental';
  contentType: 'text' | 'box';
  showTooltip?: boolean;
}

/**
 * Component encapsulating experimental content (REST API is experimental or mocked).
 * Based on passed props, it applies styles to the content.
 * Intended to be used as a descendant of {@link ExperimentalContent}.
 *
 * @param dataSource - Type of experimental data
 * @param contentType - Type of HTML content
 * @param showTooltip - Whether warning tooltip is displayed
 */
export const ExperimentalContentMarker = ({
  children,
  dataSource,
  contentType,
  showTooltip = false,
}: PropsWithChildren<IExperimentalContentMarkerProps>) => (
  <div
    title={
      showTooltip
        ? dataSource === 'mock'
          ? 'The content data are mocked.'
          : dataSource === 'experimental'
          ? 'The content data are experimental.'
          : undefined
        : undefined
    }
    className={css(
      styles['experimental-content'],
      dataSource === 'mock' && styles['mock-data'],
      dataSource === 'experimental' && styles['experimental-data'],
      contentType === 'text' && styles['text-content'],
      contentType === 'box' && styles['box-content']
    )}
  >
    {children}
  </div>
);

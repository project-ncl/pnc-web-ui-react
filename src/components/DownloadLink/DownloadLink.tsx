import { DownloadIcon } from '@patternfly/react-icons';

import styles from './DownloadLink.module.css';

interface IDownloadLinkProps {
  url: string;
  title: string;
  showIcon?: boolean;
}

export const DownloadLink = ({ url, title, showIcon = true }: IDownloadLinkProps) => {
  return (
    <div>
      {showIcon && (
        <span className={styles['download-icon']}>
          <a href={url} target="_self">
            <DownloadIcon />
          </a>
        </span>
      )}
      <span>
        <a href={url} target="_self">
          {title}
        </a>
      </span>
    </div>
  );
};

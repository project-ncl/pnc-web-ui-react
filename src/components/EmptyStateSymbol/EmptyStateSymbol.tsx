import styles from './EmptyStateSymbol.module.css';

interface IEmptyStateSymbol {
  title?: string;
  variant?: 'text' | 'mdash' | 'ndash';
}

export const EmptyStateSymbol = ({ title, variant = 'mdash' }: IEmptyStateSymbol) => (
  <span title={title ? `${title} is not available` : ''}>
    {variant === 'text' && <span className={styles['value-empty']}>Empty</span>}
    {variant === 'mdash' && <>&mdash;</>}
    {variant === 'ndash' && <>&ndash;</>}
  </span>
);

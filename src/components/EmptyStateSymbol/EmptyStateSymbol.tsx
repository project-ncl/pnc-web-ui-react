import styles from './EmptyStateSymbol.module.css';

interface IEmptyStateSymbol {
  title?: string;
  text?: string | boolean;
}

/**
 * Empty inline content that will be displayed when data is not available.
 *
 * @example
 * ```tsx
 * <EmptyStateSymbol />                     // default text will be displayed
 * <EmptyStateSymbol text="custom Text" />  // custom text will be displayed
 * <EmptyStateSymbol text={false} />        // dash symbol will be displayed
 * ```
 */
export const EmptyStateSymbol = ({ title, text = 'Empty' }: IEmptyStateSymbol) => (
  <span title={title ? `${title} is not available` : undefined}>
    {text === false ? <>&mdash;</> : <span className={styles['value-empty']}>{text}</span>}
  </span>
);

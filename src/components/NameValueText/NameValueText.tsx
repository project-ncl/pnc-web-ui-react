import styles from './NameValueText.module.css';

interface INameValueTextProps {
  name: string;
  value: string;
}

export const NameValueText = ({ name, value }: INameValueTextProps) => (
  <>
    <span className={styles['name']}>{name}</span>
    <span className={value ? '' : styles['value']}>{value ?? 'Empty'}</span>
  </>
);

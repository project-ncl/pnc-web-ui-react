import { Grid, GridItem } from '@patternfly/react-core';

import styles from './KeyValueTable.module.css';

interface IKeyValueEntryProps {
  name: React.ReactNode;
  value: React.ReactNode;
}

const KeyValueEntry = ({ name, value }: IKeyValueEntryProps) => (
  <>
    <GridItem md={3} sm={12} className={styles['key']}>
      {name}
    </GridItem>
    <GridItem md={9} sm={12} className={value ? '' : styles['value']}>
      {value ?? 'Empty'}
    </GridItem>
  </>
);

interface IKeyValueTableProps {
  keyValueArray: {
    key: React.ReactNode;
    value: React.ReactNode;
  }[];
}

/**
 * Represents a stylized key-value table component.
 *
 * @param keyValueArray - array of key-value objects
 */
export const KeyValueTable = ({ keyValueArray }: IKeyValueTableProps) => (
  <Grid hasGutter>
    {keyValueArray && keyValueArray.map(({ key, value }) => <KeyValueEntry key={key?.toString()} name={key} value={value} />)}
  </Grid>
);

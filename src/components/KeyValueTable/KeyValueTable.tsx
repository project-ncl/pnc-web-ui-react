import { Grid, GridItem } from '@patternfly/react-core';

import styles from './KeyValueTable.module.css';

interface IKeyValueEntryProps {
  name: string;
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
  keyValueObject: {
    [key: string]: React.ReactNode;
  };
}

/**
 * Represents a stylized key-value table component.
 *
 * @param keyValueObject - dictionary object with keys and values
 */
export const KeyValueTable = ({ keyValueObject }: IKeyValueTableProps) => (
  <Grid hasGutter>
    {Object.entries(keyValueObject).map(([key, value]) => (
      <KeyValueEntry key={key} name={key} value={value} />
    ))}
  </Grid>
);

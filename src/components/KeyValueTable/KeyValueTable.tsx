import { Grid, GridItem } from '@patternfly/react-core';

import styles from './KeyValueTable.module.css';

interface IKeyValueEntryProps {
  name: string;
  value: string | undefined;
}

const KeyValueEntry = ({ name, value }: IKeyValueEntryProps) => (
  <>
    <GridItem span={6} className={styles['key']}>
      {name}
    </GridItem>
    <GridItem span={6} className={value ? '' : styles['value']}>
      {value ?? 'Empty'}
    </GridItem>
  </>
);

interface IKeyValueTableProps {
  keyValueObject: {
    [key: string]: string | undefined;
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

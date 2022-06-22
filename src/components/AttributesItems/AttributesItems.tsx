import { Grid, GridItem } from '@patternfly/react-core';

import styles from './AttributesItems.module.css';

interface IAttributesItemProps {
  name: React.ReactNode;
  value: React.ReactNode;
}

const AttributesItem = ({ name, value }: IAttributesItemProps) => (
  <>
    <GridItem md={6} sm={12} className={styles['name']}>
      {name}
    </GridItem>
    <GridItem md={6} sm={12} className={value != null ? '' : styles['value-empty']}>
      {value ?? 'Empty'}
    </GridItem>
  </>
);

interface IAttributesItemsProps {
  attributes: {
    name: React.ReactNode;
    value: React.ReactNode;
  }[];
}

/**
 * Represents a stylized name-value table component.
 *
 * @param attributes - array of name-value objects
 */
export const AttributesItems = ({ attributes: keyValueArray }: IAttributesItemsProps) => (
  <Grid hasGutter>
    {keyValueArray && keyValueArray.map(({ name, value }) => <AttributesItem key={name?.toString()} name={name} value={value} />)}
  </Grid>
);

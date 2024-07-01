import { Divider, MenuToggle, Select, SelectGroup, SelectList, SelectOption } from '@patternfly/react-core';
import { ArrowsAltVIcon, LongArrowAltDownIcon, LongArrowAltUpIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { useMemo } from 'react';

import { ISortAttributes, SortFunction, TSortAttribute } from 'hooks/useSorting';

import styles from './SortGroup.module.css';

export interface ISortGroupProps {
  title: string;
  sort: {
    sortAttributes: ISortAttributes;
    sortGroup: string;
    sort: SortFunction;
    activeSortAttribute?: string;
    activeSortDirection?: string;
  };
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
}

export const SortGroup = ({ title, sort, isDropdownOpen, onDropdownToggle }: ISortGroupProps) => {
  const sortGroupAttributes = useMemo(
    () => Object.values(sort.sortAttributes).filter((sortAttribute) => sort.sortGroup === sortAttribute.sort.group),
    [sort.sortAttributes, sort.sortGroup]
  );

  const fallbackSortAttribute = useMemo(
    () => sortGroupAttributes.at(0)?.id || sort.activeSortAttribute,
    [sort.activeSortAttribute, sortGroupAttributes]
  );

  const isSortGroupActive = useMemo(
    () => !!sort.activeSortAttribute && sort.sortGroup === sort.sortAttributes[sort.activeSortAttribute].sort.group,
    [sort.sortAttributes, sort.activeSortAttribute, sort.sortGroup]
  );

  return (
    <Select
      id="sort-options"
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          className={css(styles['sort-toggle'], isSortGroupActive && styles['sort-toggle--active'])}
          variant="plain"
          isExpanded={isDropdownOpen}
          onClick={onDropdownToggle}
        >
          <span className={styles['sort-title']}>{title}</span>

          {isSortGroupActive ? (
            sort.activeSortDirection === 'asc' ? (
              <LongArrowAltUpIcon className={styles['sort-icon']} />
            ) : (
              <LongArrowAltDownIcon className={styles['sort-icon']} />
            )
          ) : (
            <ArrowsAltVIcon className={styles['sort-icon']} />
          )}

          {isSortGroupActive && (
            <span className={styles['sort-icon-title']}>{sort.sortAttributes[sort.activeSortAttribute!].title}</span>
          )}
        </MenuToggle>
      )}
      isOpen={isDropdownOpen}
      onOpenChange={onDropdownToggle}
      onSelect={onDropdownToggle}
    >
      <SelectGroup label="Column" key="column">
        <SelectList>
          {sortGroupAttributes.map((sortAttribute: TSortAttribute) => (
            <SelectOption
              key={sortAttribute.id}
              isSelected={sort.activeSortAttribute === sortAttribute.id}
              onClick={() => {
                sort.sort({ sortAttribute: sortAttribute.id, sortDirection: sort.activeSortDirection });
              }}
            >
              {sortAttribute.title}
            </SelectOption>
          ))}
        </SelectList>
      </SelectGroup>

      <Divider key="divider" />

      <SelectGroup label="Order" key="order">
        <SelectList>
          <SelectOption
            id="ascending"
            isSelected={isSortGroupActive && sort.activeSortDirection === 'asc'}
            onClick={() => sort.sort({ sortAttribute: fallbackSortAttribute, sortDirection: 'asc' })}
          >
            Ascending
          </SelectOption>
          <SelectOption
            id="descending"
            isSelected={isSortGroupActive && sort.activeSortDirection === 'desc'}
            onClick={() => sort.sort({ sortAttribute: fallbackSortAttribute, sortDirection: 'desc' })}
          >
            Descending
          </SelectOption>
          <SelectOption id="cancel" isDisabled={!isSortGroupActive} onClick={() => sort.sort({ resetSorting: true })}>
            None
          </SelectOption>
        </SelectList>
      </SelectGroup>
    </Select>
  );
};

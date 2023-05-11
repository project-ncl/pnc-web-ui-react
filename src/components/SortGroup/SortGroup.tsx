import {
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuItemGroup,
  OptionsMenuSeparator,
  OptionsMenuToggle,
  OptionsMenuToggleProps,
} from '@patternfly/react-core';
import { ArrowsAltVIcon, LongArrowAltDownIcon, LongArrowAltUpIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';

import { ISortAttribute, ISortAttributes, SortFunction } from 'hooks/useSorting';

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
  onDropdownToggle: OptionsMenuToggleProps['onToggle'];
}

export const SortGroup = ({ title, sort, isDropdownOpen, onDropdownToggle }: ISortGroupProps) => {
  const isSortGroupActive =
    sort.activeSortAttribute && sort.sortGroup === sort.sortAttributes[sort.activeSortAttribute].sortGroup;
  return (
    <OptionsMenu
      className={css(styles['sort-group'], isSortGroupActive && styles['sort-group-selected'])}
      id="sort-options"
      menuItems={[
        <OptionsMenuItemGroup key={0}>
          {Object.values(sort.sortAttributes)
            .filter((sortAttribute: ISortAttribute) => sortAttribute.sortGroup === sort.sortGroup)
            .map((sortAttribute: ISortAttribute, index: number) => (
              <OptionsMenuItem
                key={index}
                isSelected={sort.activeSortAttribute === sortAttribute.id}
                onSelect={() => {
                  sort.sort({ sortAttribute: sortAttribute.id, sortDirection: sort.activeSortDirection });
                }}
              >
                {sortAttribute.title}
              </OptionsMenuItem>
            ))}
        </OptionsMenuItemGroup>,
        <OptionsMenuSeparator key={1} />,
        <OptionsMenuItemGroup key={2}>
          <OptionsMenuItem
            id="ascending"
            isSelected={sort.activeSortDirection === 'asc'}
            onSelect={() => sort.sort({ sortAttribute: sort.activeSortAttribute, sortDirection: 'asc' })}
          >
            Ascending
          </OptionsMenuItem>
          <OptionsMenuItem
            id="descending"
            isSelected={sort.activeSortDirection === 'desc'}
            onSelect={() => sort.sort({ sortAttribute: sort.activeSortAttribute, sortDirection: 'desc' })}
          >
            Descending
          </OptionsMenuItem>
          <OptionsMenuItem id="cancel" isDisabled={!isSortGroupActive} onSelect={() => sort.sort({ resetSorting: true })}>
            None
          </OptionsMenuItem>
        </OptionsMenuItemGroup>,
      ]}
      isOpen={isDropdownOpen}
      toggle={
        <OptionsMenuToggle
          className={styles['sort-icon-toggle']}
          hideCaret
          toggleTemplate={
            <>
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
            </>
          }
          onToggle={onDropdownToggle}
        />
      }
      isPlain
      isGrouped
      removeFindDomNode
    />
  );
};

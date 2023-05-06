import {
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuItemGroup,
  OptionsMenuSeparator,
  OptionsMenuToggle,
  OptionsMenuToggleProps,
} from '@patternfly/react-core';
import { ArrowsAltVIcon, LongArrowAltDownIcon, LongArrowAltUpIcon } from '@patternfly/react-icons';

import { ISortAttribute, ISortAttributes, SortFunction } from 'hooks/useSorting';

import styles from './SortGroup.module.css';

export interface ISortGroupProps {
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

export const SortGroup = ({ sort, isDropdownOpen, onDropdownToggle }: ISortGroupProps) => (
  <OptionsMenu
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
      </OptionsMenuItemGroup>,
    ]}
    isOpen={isDropdownOpen}
    toggle={
      <OptionsMenuToggle
        className={styles['sort-icon-toggle']}
        hideCaret
        toggleTemplate={
          <>
            {sort.activeSortAttribute && sort.sortAttributes[sort.activeSortAttribute].sortGroup === sort.sortGroup ? (
              sort.activeSortDirection === 'asc' ? (
                <LongArrowAltUpIcon />
              ) : (
                <LongArrowAltDownIcon />
              )
            ) : (
              <ArrowsAltVIcon />
            )}
            {sort.activeSortAttribute && sort.sortAttributes[sort.activeSortAttribute].sortGroup === sort.sortGroup && (
              <span className={styles['sort-icon-title']}>{sort.sortAttributes[sort.activeSortAttribute].title}</span>
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

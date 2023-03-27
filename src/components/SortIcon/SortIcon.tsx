import {
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuItemGroup,
  OptionsMenuSeparator,
  OptionsMenuToggle,
  OptionsMenuToggleProps,
} from '@patternfly/react-core';
import { SortAmountDownIcon } from '@patternfly/react-icons';

import { ISortAttribute, ISortObject, ISortOptions } from 'hooks/useSorting';

import styles from './SortIcon.module.css';

interface ISortIconProps {
  sortOptions: ISortOptions;
  sortingGroup: string;
  sort: ISortObject['sort'];
  activeSortAttribute: ISortObject['activeSortAttribute'];
  activeSortDirection: ISortObject['activeSortDirection'];
  isDropdownOpen: boolean;
  onDropdownToggle: OptionsMenuToggleProps['onToggle'];
}

export const SortIcon = ({
  sortOptions,
  sortingGroup,
  activeSortAttribute,
  activeSortDirection,
  sort,
  isDropdownOpen,
  onDropdownToggle,
}: ISortIconProps) => (
  <OptionsMenu
    id="sort-options"
    menuItems={[
      <OptionsMenuItemGroup>
        {Object.values(sortOptions)
          .filter((sortAttribute: ISortAttribute) => sortAttribute.sortingGroup === sortingGroup)
          .map((sortAttribute: ISortAttribute) => (
            <OptionsMenuItem
              isSelected={activeSortAttribute === sortAttribute.id}
              onSelect={() => {
                sort({ sortAttribute: sortAttribute.id, sortDirection: activeSortDirection! });
              }}
            >
              {sortAttribute.title}
            </OptionsMenuItem>
          ))}
      </OptionsMenuItemGroup>,
      <OptionsMenuSeparator />,
      <OptionsMenuItemGroup>
        <OptionsMenuItem
          id="ascending"
          isSelected={activeSortDirection === 'asc'}
          onSelect={() => sort({ sortAttribute: activeSortAttribute!, sortDirection: 'asc' })}
        >
          Ascending
        </OptionsMenuItem>
        <OptionsMenuItem
          id="descending"
          isSelected={activeSortDirection === 'desc'}
          onSelect={() => sort({ sortAttribute: activeSortAttribute!, sortDirection: 'desc' })}
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
            <SortAmountDownIcon />
            {activeSortAttribute && sortOptions[activeSortAttribute].sortingGroup === sortingGroup && (
              <span className={styles['sort-icon-title']}>{sortOptions[activeSortAttribute].title}</span>
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

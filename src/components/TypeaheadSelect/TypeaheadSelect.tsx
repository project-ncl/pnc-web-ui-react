import {
  Button,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  SelectOptionProps,
  Spinner,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { css } from '@patternfly/react-styles';
import { useEffect, useMemo, useRef, useState } from 'react';

import { IRegisterData } from 'hooks/useForm';

import styles from './TypeaheadSelect.module.css';

const CREATE_NEW_OPTION_VALUE = 'create-new';

const NO_RESULTS_OPTION_VALUE = 'no-results';

export interface ITypeaheadSelectProps {
  selectOptions: SelectOptionProps[];
  isMenuOpen: boolean;
  onMenuToggle: (isOpen: boolean) => void;
  selectedValue: string | undefined;
  onSelect: (selectedValue: string) => void;
  onInputChange?: (inputValue: string) => void;
  onViewMore?: (inputValue: string) => void;
  isViewMoreDisabled?: boolean;
  onCreateOption?: (inputValue: string) => void;
  creatableOptionText?: string;
  onClear: () => void;
  isFiltrable?: boolean;
  placeholderText?: string;
  validated?: IRegisterData<any>['validated'];
  isLoading?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}

/**
 * Select with a text input filter. Includes creatable select feature.
 *
 * @param selectOptions - list of objects representing options selectable by user
 * @param isMenuOpen - whether is select menu open
 * @param onMenuToggle - callback toggling isMenuOpen state
 * @param selectedValue - value currently selected in the menu
 * @param onSelect - callback setting selectedValue state
 * @param onInputChange - callback called on text input (filter) change
 * @param onViewMore - callback called on 'View more' button click. if undefined, 'View more' button is never displayed
 * @param isViewMoreDisabled - whether is 'View more' button disabled (not clickable)
 * @param onCreateOption - callback called on 'Create new option' option click. intended to add new option to selectOptions
 * @param creatableOptionText - text displayed on 'Create new option' option
 * @param onClear - callback unselecting selectedValue state
 * @param isFiltrable - if false, select options are not filtered on text input change. use for custom handling of filtering
 * @param placeholderText - text displayed in the empty text input
 * @param validated - state of validation in the form state
 * @param isLoading - if true, displays loading spinner inside select
 * @param errorMessage - if defined, displays error message inside select
 * @param isDisabled - whether is select disabled
 */
export const TypeaheadSelect = ({
  selectOptions,
  isMenuOpen,
  onMenuToggle,
  selectedValue,
  onSelect,
  onInputChange,
  onViewMore,
  isViewMoreDisabled = false,
  onCreateOption,
  creatableOptionText,
  onClear,
  isFiltrable = true,
  placeholderText,
  validated,
  isLoading = false,
  errorMessage,
  isDisabled = false,
}: ITypeaheadSelectProps) => {
  const textInputRef = useRef<HTMLInputElement>(undefined);

  const [textInputValue, setTextInputValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);

  const filteredSelectOptions = useMemo(() => {
    if (!isFiltrable || !filterValue) {
      return selectOptions;
    }

    return selectOptions.filter((option) => String(option.children).toLowerCase().includes(filterValue.toLowerCase()));
  }, [selectOptions, filterValue, isFiltrable]);

  useEffect(() => {
    if (!selectedValue) {
      setTextInputValue('');
      setFilterValue('');
    }

    if (selectedValue) {
      setTextInputValue(selectedValue);
    }
  }, [selectedValue]);

  const closeMenu = () => {
    onMenuToggle(false);
    setFocusedItemIndex(null);
  };

  const onMenuSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (!value || value === NO_RESULTS_OPTION_VALUE) {
      return;
    }

    closeMenu();
    setFilterValue('');

    if (value === CREATE_NEW_OPTION_VALUE) {
      onCreateOption?.(textInputValue);
      onSelect(textInputValue);
    } else {
      onSelect(String(value));
    }
  };

  const onTextInputClick = () => {
    if (!isMenuOpen) {
      onMenuToggle(true);
    } else if (!textInputValue) {
      closeMenu();
    }
  };

  const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    onInputChange?.(value);
    setTextInputValue(value);
    setFilterValue(value);
    !isMenuOpen && onMenuToggle(true);
    setFocusedItemIndex(null);

    if (selectedValue && value !== selectedValue) {
      onClear();
    }
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus = 0;

    !isMenuOpen && onMenuToggle(true);

    if (filteredSelectOptions.every((option) => option.isDisabled)) {
      return;
    }

    const finalOptionIndex = filteredSelectOptions.length - 1;

    if (key === 'ArrowUp') {
      if (focusedItemIndex === null || focusedItemIndex === 0) {
        indexToFocus = finalOptionIndex;
      } else {
        indexToFocus = focusedItemIndex - 1;
      }

      while (filteredSelectOptions[indexToFocus].isDisabled) {
        if (indexToFocus === 0) {
          indexToFocus = finalOptionIndex;
        } else {
          indexToFocus--;
        }
      }
    }

    if (key === 'ArrowDown') {
      if (focusedItemIndex === null || focusedItemIndex === finalOptionIndex) {
        indexToFocus = 0;
      } else {
        indexToFocus = focusedItemIndex + 1;
      }

      while (filteredSelectOptions[indexToFocus].isDisabled) {
        if (indexToFocus === finalOptionIndex) {
          indexToFocus = 0;
        } else {
          indexToFocus++;
        }
      }
    }

    setFocusedItemIndex(indexToFocus);
  };

  const onTextInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const focusedItem = focusedItemIndex !== null ? filteredSelectOptions[focusedItemIndex] : null;

    if (event.key === 'Enter') {
      if (isMenuOpen && focusedItem && !focusedItem.isAriaDisabled) {
        onMenuSelect(undefined, focusedItem.value);
      }

      !isMenuOpen && onMenuToggle(true);
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      handleMenuArrowKeys(event.key);
    }
  };

  const onSelectMenuToggle = () => {
    onMenuToggle(!isMenuOpen);
    !isMenuOpen && textInputRef.current?.focus();
  };

  const onClearButtonClick = () => {
    onClear();
    setTextInputValue('');
    setFilterValue('');
    setFocusedItemIndex(null);
    textInputRef?.current?.focus();
  };

  const getToggleStatus = () => {
    if (validated === 'error') {
      return 'danger';
    }

    if (validated === 'default') {
      return undefined;
    }

    return validated;
  };

  const menuToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      isExpanded={isMenuOpen}
      onClick={onSelectMenuToggle}
      status={getToggleStatus()}
      isDisabled={isDisabled}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          innerRef={textInputRef}
          value={textInputValue}
          onChange={onTextInputChange}
          isExpanded={isMenuOpen}
          onClick={onTextInputClick}
          onKeyDown={onTextInputKeyDown}
          placeholder={placeholderText}
          autoComplete="off"
        />
        <TextInputGroupUtilities className={css(!textInputValue && 'display-none')}>
          <Button variant="plain" onClick={onClearButtonClick} icon={<TimesIcon />} />
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  const chooseTopSelectOption = () => {
    if (onCreateOption && textInputValue && !filteredSelectOptions.some((option) => option.value === textInputValue)) {
      return (
        <SelectOption value={CREATE_NEW_OPTION_VALUE}>
          {creatableOptionText} "{textInputValue}"
        </SelectOption>
      );
    }

    return null;
  };

  const chooseBottomSelectOption = () => {
    if (isLoading) {
      return (
        <SelectOption isLoading>
          <Spinner size="lg" />
        </SelectOption>
      );
    }

    if (errorMessage) {
      return (
        <SelectOption isDanger isAriaDisabled>
          {errorMessage}
        </SelectOption>
      );
    }

    if (!filteredSelectOptions.length && !onCreateOption) {
      return (
        <SelectOption isAriaDisabled value={NO_RESULTS_OPTION_VALUE}>
          No results were found
        </SelectOption>
      );
    }

    if (onViewMore) {
      return (
        <SelectOption
          isAriaDisabled={isViewMoreDisabled}
          isLoadButton={!isViewMoreDisabled}
          onClick={() => onViewMore(filterValue)}
          tooltipProps={viewMoreButtonTooltipProps}
        >
          View more
        </SelectOption>
      );
    }

    return null;
  };

  return (
    <>
      {isLoading && (
        <Spinner
          size="sm"
          className={css(
            styles['select_spinner'],
            textInputValue && validated && validated !== 'default'
              ? styles['select_spinner--filtered-and-validated']
              : textInputValue || (validated && validated !== 'default')
              ? styles['select_spinner--filtered']
              : styles['select_spinner--no-filter']
          )}
        />
      )}

      <Select
        variant="typeahead"
        isOpen={isMenuOpen}
        onOpenChange={(isOpen) => {
          onSelectMenuToggle();
          !isOpen && setFocusedItemIndex(null);
        }}
        selected={selectedValue}
        onSelect={onMenuSelect}
        toggle={menuToggle}
        popperProps={selectPopperProps}
      >
        <SelectList>
          {chooseTopSelectOption()}
          {filteredSelectOptions.map((option, index) => (
            <SelectOption key={option.value || option.children} isFocused={focusedItemIndex === index} {...option} />
          ))}
          {chooseBottomSelectOption()}
        </SelectList>
      </Select>
    </>
  );
};

const viewMoreButtonTooltipProps = { content: 'No more options available' };

const selectPopperProps = { width: 'trigger' };

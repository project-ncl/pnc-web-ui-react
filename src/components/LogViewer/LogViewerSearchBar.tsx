import { LogViewerSearch } from '@patternfly/react-log-viewer';
import { memo, useEffect } from 'react';

const SEARCH_INPUT_SELECTOR = '.pf-v6-c-log-viewer__header .pf-v6-c-text-input-group__text-input';

interface ILogViewerSearchBarProps {
  autofocusSearchBar: boolean;
}

/**
 * Search Bar component for Log viewer.
 *
 * @example
 * ```tsx
 * <LogViewerSearchBar autofocusSearchBar={true} />
 * ```
 *
 * @param autofocusSearchBar - If true, activates the search input when the component mounts
 */
export const LogViewerSearchBar = memo(({ autofocusSearchBar }: ILogViewerSearchBarProps) => {
  const focusSearchInput = () => {
    const searchInput = document.querySelector<HTMLInputElement>(SEARCH_INPUT_SELECTOR);
    searchInput?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || target.isContentEditable;

      // proceed with default key down when keydown action is from input element of the search bar(which means input already activated)
      if (isInput) {
        return;
      }

      if (event.key === '/') {
        event.preventDefault();
        focusSearchInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (autofocusSearchBar) {
      const timeoutId = setTimeout(() => {
        focusSearchInput();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [autofocusSearchBar]);

  return <LogViewerSearch minSearchChars={1} placeholder="Type / to search" />;
});

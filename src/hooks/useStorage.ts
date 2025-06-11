import { useCallback, useState } from 'react';

type TStorageValue = string | boolean | number;

interface IUseStorageProps<T extends TStorageValue> {
  storageKey: string;
  initialValue: T;
  storage?: Storage;
}

/**
 * Hook managing access to local or session storage.
 *
 * @param storageKey - key of value in the storage
 * @param initialValue - when no value is stored on storageKey, storageValue is set to initialValue
 * @param storage - localStorage or sessionStorage
 * @returns object containing:
 * - storageValue - value on storageKey in the storage
 * - storeToStorage - stores the new value into the storage
 */
export const useStorage = <T extends TStorageValue>({
  storageKey,
  initialValue,
  storage = localStorage,
}: IUseStorageProps<T>) => {
  const storageValueParser = useCallback(
    (rawStorageValue: string): T => {
      if (typeof initialValue === 'number') {
        return Number(rawStorageValue) as T;
      }
      if (typeof initialValue === 'boolean') {
        return (rawStorageValue.toLowerCase() === 'true') as T;
      }

      return rawStorageValue as T;
    },
    [initialValue]
  );

  const [storageValue, setStorageValue] = useState<T>(() => {
    const rawStorageValue = storage.getItem(storageKey);
    return rawStorageValue ? storageValueParser(rawStorageValue) : initialValue;
  });

  const storeToStorage = useCallback(
    (value: T) => {
      const stringifiedValue = `${value}`;
      if (stringifiedValue) {
        storage.setItem(storageKey, stringifiedValue);
      } else {
        storage.removeItem(storageKey);
      }

      setStorageValue(value);
    },
    [storageKey, storage]
  );

  return { storageValue, storeToStorage };
};

// Storage keys (like localStorage), see NCL-8496
export const StorageKeys = {
  isBuildsListCompactMode: 'is-builds-list-compact-mode',
  isArtifactIdentifierParsed: 'is-artifact-identifier-parsed',
  isLogViewerFollowingNewContent: 'log-viewer-following',
  isLogViewerContentWrapped: 'log-viewer-wrapping',
  isExperimentalContentEnabled: 'is-experimental-content-enabled',
  areOnlyLatestBuildPushesShown: 'are-only-latest-build-pushes-shown',
  loggerLabel: 'logger-label',
} as const;

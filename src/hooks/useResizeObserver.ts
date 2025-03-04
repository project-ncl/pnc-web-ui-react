import { useCallback, useLayoutEffect, useState } from 'react';

/**
 * Hook that observes and returns current width and height of a container.
 *
 * @returns object containing ref, width and height
 * - ref - Reference to be passed to the container (ref property)
 * - width - Width of the container
 * - height - Height of the container
 */
export const useResizeObserver = () => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (entries.length > 0) {
          const entry = entries[0];
          setWidth((entry.target as HTMLElement).offsetWidth);
          setHeight((entry.target as HTMLElement).offsetHeight);
        }
      });
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [node]);

  return { ref, width, height };
};

import { useCallback, useState } from 'react';

/**
 * Hook that observes and returns current width and height of a container.
 *
 * @returns object containing ref, width and height
 * - ref - Reference to be passed to the container (ref property)
 * - width - Width of the container
 * - height - Height of the container
 */
export const useResizeObserver = () => {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        setWidth(node.offsetWidth);
        setHeight(node.offsetHeight);
      });
    });
    resizeObserver.observe(node);
  }, []);

  return { ref, width, height };
};

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook that observes and returns current width and height of a container.
 *
 * @returns object containing ref, width and height
 * - ref - Reference to be passed to the container (ref property)
 * - width - Width of the container
 * - height - Height of the container
 */
export const useResizeObserver = () => {
  const resizeObserver = useRef<ResizeObserver>();
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    resizeObserver.current = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        setWidth(node.offsetWidth);
        setHeight(node.offsetHeight);
      });
    });
    resizeObserver.current.observe(node);
  }, []);

  useEffect(() => {
    return () => {
      resizeObserver.current?.disconnect();
    };
  }, []);

  return { ref, width, height };
};

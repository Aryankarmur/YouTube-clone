import { useState, useEffect } from "react";

/**
 * Generic debounce hook.
 * Returns a debounced version of the input value.
 *
 * @param {*} value - The value to debounce
 * @param {number} [delay=400] - Debounce delay in ms
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

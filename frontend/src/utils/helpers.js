/**
 * Shared utility functions for the Jor Shor POS frontend.
 */

/** Format a number as Indian Rupee currency */
export const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

/** Format a date string to locale-friendly format */
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** Format a timestamp to locale time string */
export const formatTime = (date) =>
  new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

/** Truncate text to maxLength with ellipsis */
export const truncate = (text, maxLength = 30) =>
  text?.length > maxLength ? text.slice(0, maxLength) + '…' : text;

/** Debounce a function */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

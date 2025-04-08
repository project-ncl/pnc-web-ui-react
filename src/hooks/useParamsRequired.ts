import { useParams } from 'react-router';

/**
 * Type translator of useParams React Router hook changing type of ID of URL param from string | undefined to string.
 * Use when absolutely sure the param cannot be undefined.
 */
export const useParamsRequired = () => useParams() as Record<string, string>;

import { PropsWithChildren } from 'react';

interface IOptionalTextProps {}

export const OptionalText = ({ children }: PropsWithChildren<IOptionalTextProps>) => {
  return children ? <>{children}</> : <>&mdash;</>;
};

interface IEmptyStateSymbol {
  title?: string;
}
export const EmptyStateSymbol = ({ title }: IEmptyStateSymbol) => <span title={`${title} is not available`}>&ndash;</span>;

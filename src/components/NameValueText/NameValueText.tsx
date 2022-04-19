interface INameValueTextProps {
  name: string;
  value: string;
}

export const NameValueText = ({ name, value }: INameValueTextProps) => (
  <>
    <span style={{ fontWeight: 'bold' }}>{name}</span>
    <span style={{ ...(!value && { color: 'grey', fontStyle: 'italic' }) }}>{value ?? 'Empty'}</span>
  </>
);

import { render, screen } from '@testing-library/react';

import { ILabelMapper, LabelMapper } from 'components/LabelMapper/LabelMapper';

jest.mock('services/uiLogger');

const TEST_LABEL_MAPPER: ILabelMapper<'TEST_1' | 'TEST_2'> = {
  TEST_1: {
    text: 'TEST 1',
    color: 'blue',
  },
  TEST_2: {
    text: 'TEST 2',
    color: 'red',
  },
};

test('Render Label 1', () => {
  const testObject = TEST_LABEL_MAPPER['TEST_1'];
  render(<LabelMapper mapper={testObject} />);
  const labelText = screen.getByText(testObject.text);
  expect(labelText).toBeInTheDocument();
});

test('Render Empty object', () => {
  render(<LabelMapper mapper={undefined} />);
  const labelText = screen.getByText('—');
  expect(labelText).toBeInTheDocument();
});

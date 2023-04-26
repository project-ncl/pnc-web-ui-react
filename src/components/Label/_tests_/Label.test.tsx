import { render, screen } from '@testing-library/react';

import { ILabelMapper, Label } from 'components/Label/Label';

const TEST_LABEL_MAPPER: ILabelMapper = {
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
  render(<Label labelObject={testObject} />);
  const labelText = screen.getByText(testObject.text);
  expect(labelText).toBeInTheDocument();
});

test('Render Empty object', () => {
  render(<Label labelObject={undefined} />);
  const labelText = screen.getByText('—');
  expect(labelText).toBeInTheDocument();
});
